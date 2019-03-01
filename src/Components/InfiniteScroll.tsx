import * as React from "react";

import { IModel, IModelData, IQueryBuilder, IQueryManager, IQueryParams, QueryBuilder } from "redux-data-service";
import { Omit } from "redux-data-service/dist/Omit";

import {
  compose,
  defaultProps,
  lifecycle,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
  withStateHandlers
} from "recompose";

import { Cancelable, debounce, merge, throttle } from "lodash";

import { Query } from "../Query";
import { withModelQuery } from "../WithModelQuery";
import { average, calculateGroupHeight, omitProps } from "../Helpers";

export interface IInfiniteScrollProps<T extends IModelData> {
  modelName: string;
  query: IQueryParams | IQueryBuilder;
  containerComponent: React.ComponentType<{ onScroll: React.UIEventHandler } & any>;
  modelComponent: React.ComponentType<{ model: T } & any>;
  modelComponentProps?: any;
  debounceTime?: number;
  disableVirtualScrolling?: boolean;
  contentPlaceHolderComponent?: React.ComponentType<{ height: number }>;

  /* Any extra props will be passed-through to the container component */
  [key: string]: any;
}

export interface IInfiniteScrollStateProps {
  estimatedPageHeight: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastScrollTop: number;
  nextPage: number;
  nextPageQuery: IQueryBuilder;
  nextPlaceHolderHeight: number;
  pageHeightMap: { [key: string]: number };
  previousPage: number;
  previousPageQuery: IQueryBuilder;
  previousPlaceHolderHeight: number;
  query: IQueryBuilder;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>>
  extends Omit<IInfiniteScrollProps<T>, "query">, Omit<IInfiniteScrollStateProps, "query"> {
  query: IQueryManager<T>;
  nextPageHeightRef: React.RefObject<any>;
  handleScrollDebounced: ((e) => void) & Cancelable;
  handleScrollThrottled: ((e) => void) & Cancelable;
  handleScrollPersistingEvent: (e) => void;
  recordPageMetaData: (meta: Partial<IInfiniteScrollStateProps>) => void;
}

export interface IDisplayPreviousPageProps<T extends IModelData> {
  modelName: string;
  queryManager: IQueryManager<T>;
  modelComponent: React.ComponentType<{ model: T } & any>;
  modelComponentProps?: any;
}

const DisplayPreviousPage = compose<IDisplayPreviousPageProps<any>, IDisplayPreviousPageProps<any>>(
  setDisplayName("DisplayPreviousPage"),
  pure,
)(
  (({ queryManager, modelName, modelComponent: ModelComponent, modelComponentProps }) => {
    return queryManager.hasPreviousPage() && (
      <Query key={`page-${queryManager.response.previousPage}`} modelName={modelName} query={queryManager.getPreviousPage()}>
        {({ query }) => (
          <>
            <DisplayPreviousPage queryManager={query} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName} />
            {query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))}
          </>
        )}
      </Query>
    );
  }),
);

interface IContentPlaceHolderProps {
  height: number;
}

const DefaultContentPlaceHolder = ({ height }: IContentPlaceHolderProps) => {
  const style = {
    height,
  };

  return (
    <div style={style} />
  );
};

/**
 * Adds infinite and virtual scroll capability to a container and model component,
 * querying for the next page of results when scrolling down (or up if virtual scrolling).
 * The container component must be scrollable.
 */
export const InfiniteScroll = compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  defaultProps({
    debounceTime: 200,
    contentPlaceHolderComponent: DefaultContentPlaceHolder,
  }),
  withProps({
    previousPageStartMarkerRef: React.createRef(),
    previousPageEndMarkerRef: React.createRef(),
    currentPageStartMarkerRef: React.createRef(),
    currentPageEndMarkerRef: React.createRef(),
    nextPageStartMarkerRef: React.createRef(),
    nextPageEndMarkerRef: React.createRef(),
  }),
  withStateHandlers<IInfiniteScrollStateProps, { updateState, handleScroll }, IInfiniteScrollProps<any>>(
    ({ query, modelName }) => ({
      currentPage: 1,
      estimatedPageHeight: 0,
      lastScrollTop: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      nextPage: null,
      nextPageQuery: null,
      nextPlaceHolderHeight: 0,
      pageHeightMap: {},
      previousPage: null,
      previousPageQuery: null,
      previousPlaceHolderHeight: 0,
      query: query instanceof QueryBuilder
        ? query
        : new QueryBuilder(modelName, query as IQueryParams),
      totalPages: 0,
    }),
    {
      updateState: (prevState) => (newState: Partial<IInfiniteScrollStateProps>) => {
        const state = merge({}, prevState, newState);

        if ("pageHeightMap" in newState) {
          state.estimatedPageHeight = average(Object.values(state.pageHeightMap));
        }

        return state;
      },
      handleScroll: (
        { currentPage, estimatedPageHeight, hasNextPage, lastScrollTop, nextPageQuery, pageHeightMap, query, totalPages },
        { disableVirtualScrolling }
      ) => ({ target: { clientHeight, scrollHeight, scrollTop } }) => {

        const updatedState = {
          lastScrollTop: scrollTop
        } as Partial<IInfiniteScrollStateProps>;

        const scrollingDown = scrollTop > lastScrollTop;
        const currentScrollBottom = scrollHeight - scrollTop - clientHeight;

        if (!disableVirtualScrolling) {
          let nextPageToLoad = 1;
          let nextPageScrollTop = pageHeightMap[1];

          while (nextPageScrollTop < (scrollTop + (clientHeight / 2)) && nextPageToLoad < totalPages) {
            nextPageToLoad++;
            nextPageScrollTop += nextPageToLoad in pageHeightMap
              ? pageHeightMap[nextPageToLoad]
              : estimatedPageHeight;
          }

          if (currentPage !== nextPageToLoad) {
            updatedState.query = query.page(nextPageToLoad);
          }
        } else if (scrollingDown && currentScrollBottom < (clientHeight / 2) && hasNextPage) {
          updatedState.query = nextPageQuery;
        }

        return updatedState;
      },
    },
  ),
  withModelQuery(),
  withPropsOnChange(["currentPage", "totalPages", "pageHeightMap", "estimatedPageHeight"], ({
    currentPage,
    totalPages,
    pageHeightMap,
    estimatedPageHeight,
  }) => {
    let previousPlaceHolderHeight = 0;
    let nextPlaceHolderHeight = 0;

    for (let x = currentPage - 2; x > 0; x--) {
      previousPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    for (let x = currentPage + 2; x <= totalPages; x++) {
      nextPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    return {
      previousPlaceHolderHeight,
      nextPlaceHolderHeight,
    };
  }),
  withHandlers({
    updatePageHeightMap: ({
      currentPage,
      currentPageEndMarkerRef,
      currentPageStartMarkerRef,
      hasPreviousPage,
      hasNextPage,
      nextPage,
      previousPage,
      previousPageEndMarkerRef,
      previousPageStartMarkerRef,
      nextPageEndMarkerRef,
      nextPageStartMarkerRef,
    }) => () => {
      const updatedPageHeightMap = {
        [currentPage]: calculateGroupHeight(
          currentPageStartMarkerRef.current.nextSibling,
          currentPageEndMarkerRef.current.previousSibling,
        ),
      };

      if (hasPreviousPage) {
        updatedPageHeightMap[previousPage] = calculateGroupHeight(
          previousPageStartMarkerRef.current.nextSibling,
          previousPageEndMarkerRef.current.previousSibling,
        );
      }

      if (hasNextPage) {
        updatedPageHeightMap[nextPage] = calculateGroupHeight(
          nextPageStartMarkerRef.current.nextSibling,
          nextPageEndMarkerRef.current.previousSibling,
        );
      }

      return updatedPageHeightMap;
    },
    getStateInfoFromQuery: () => (query) => {

    }
  }),
  withPropsOnChange(["debounceTime", "handleScroll"], ({ debounceTime, handleScroll }) => ({
    handleScrollDebounced: debounce(handleScroll, debounceTime),
    handleScrollThrottled: throttle(handleScroll, debounceTime),
  })),
  withHandlers({
    handleScrollPersistingEvent: ({ handleScrollDebounced, handleScrollThrottled }) => (event) => {
      handleScrollThrottled(event);
      handleScrollDebounced(event);
    },
  }),
  lifecycle<IInfiniteScrollInternalProps<any>, {}>({
    componentDidMount() {
      if (this.props.query.response) {
        this.props.recordPageMetaData(
          this.props.query.response.totalPages,
          this.props.query.response.currentPage
        );

        if (!this.props.disableVirtualScrolling) {
          // Initialize page height map and estimated page height
          this.props.updatePageHeightMap(this.props.query);
        }
      }
    },
    componentDidUpdate(prevProps) {
      if (this.props.query.response) {
        if (
          prevProps.totalPages !== this.props.query.response.totalPages ||
          prevProps.currentPage !== this.props.query.response.currentPage
        ) {
          this.props.recordPageMetaData(
            this.props.query.response.totalPages,
            this.props.query.response.currentPage
          );
        }

        if (!this.props.disableVirtualScrolling && prevProps.query.isLoading && !this.props.query.isLoading) {
          this.props.updatePageHeightMap(this.props.query);
        }
      }
    },
    componentWillUnmount() {
      this.props.handleScrollDebounced.cancel();
      this.props.handleScrollThrottled.cancel();
    },
  }),
  omitProps([
    "debounceTime",
    "handleScroll",
    "handleScrollDebounced",
    "handleScrollThrottled",
    "lastScrollTop",
    "recordPageHeight",
    "updatePageHeightMap",
  ]),
  pure,
)(({
  containerComponent: ContainerComponent,
  contentPlaceHolderComponent: ContentPlaceHolder,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScrollPersistingEvent,
  hasNextPage,
  hasPreviousPage,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPage,
  nextPageHeightRef,
  nextPageQuery,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPage,
  previousPageStartMarkerRef,
  previousPageEndMarkerRef,
  previousPageQuery,
  previousPlaceHolderHeight,
  currentPageStartMarkerRef,
  currentPageEndMarkerRef,
  nextPageStartMarkerRef,
  nextPageEndMarkerRef,
  query: queryManager,
  ...containerProps
}) => (
  <ContainerComponent {...containerProps} onScroll={handleScrollPersistingEvent}>
    {disableVirtualScrolling && (
      <DisplayPreviousPage queryManager={queryManager} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName} />
    )}
    {hasPreviousPage && !disableVirtualScrolling &&
    <>
      <ContentPlaceHolder height={previousPlaceHolderHeight} />

      <script ref={previousPageStartMarkerRef} />

      <Query
        modelName={modelName}
        query={previousPageQuery}
        loadingComponent={ContentPlaceHolder}
        loadingComponentProps={{ height: pageHeightMap[previousPage] || estimatedPageHeight }}
      >
        {({ query }) => (
          query.items.map(model => (
            <ModelComponent key={model.id} model={model} {...modelComponentProps} />
          ))
        )}
      </Query>

      <script ref={previousPageEndMarkerRef} />
    </>
    }

    <script ref={currentPageStartMarkerRef} />

    {queryManager.items.map(model => (
      <ModelComponent key={model.id} model={model} {...modelComponentProps} />
    ))}

    <script ref={currentPageEndMarkerRef} />

    {hasNextPage && (
      <>
        <script ref={nextPageStartMarkerRef} />

        <Query
          modelName={modelName}
          query={nextPageQuery}
          loadingComponent={ContentPlaceHolder}
          loadingComponentProps={{ height: pageHeightMap[nextPage] || estimatedPageHeight }}
        >
          {({ query }) => (
            query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))
          )}
        </Query>

        <script ref={nextPageEndMarkerRef} />

        {!disableVirtualScrolling && (
          <ContentPlaceHolder height={nextPlaceHolderHeight} />
        )}
      </>
    )}
  </ContainerComponent>
));
