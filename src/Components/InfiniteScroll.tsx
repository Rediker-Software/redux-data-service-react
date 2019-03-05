import * as React from "react";

import { IModel, IModelData, IQueryBuilder, IQueryManager, IQueryParams, QueryBuilder } from "redux-data-service";
import { Omit } from "redux-data-service/dist/Omit";

import {
  branch,
  compose,
  defaultProps,
  lifecycle, mapProps,
  pure,
  setDisplayName,
  withHandlers,
  withProps,
  withPropsOnChange,
  withState,
  withStateHandlers
} from "recompose";

import { Cancelable, isEmpty, debounce, merge, throttle } from "lodash";

import { Query } from "../Query";
import { withModelQuery } from "../WithModelQuery";
import { average, calculateGroupHeight, omitProps } from "../Helpers";
import { IWithDelayedHandlers, withDelayedHandlers } from "../WithDelayedHandlers";
import { IWithLoadingIndicatorProps, withLoadingIndicator } from "../WithLoadingIndicator";

export interface IInfiniteScrollProps<T extends IModelData> extends IWithDelayedHandlers, IWithLoadingIndicatorProps {
  modelName: string;
  query: IQueryParams | IQueryBuilder;
  containerComponent: React.ComponentType<{ onScroll: React.UIEventHandler } & any>;
  modelComponent: React.ComponentType<{ model: T } & any>;
  modelComponentProps?: any;
  disableVirtualScrolling?: boolean;
  contentPlaceHolderComponent?: React.ComponentType<{ height: number }>;

  /* Any extra props will be passed-through to the container component */
  [key: string]: any;
}

export interface IInfiniteScrollStateProps {
  currentPage: number;
  currentPageStartMarkerRef: React.RefObject<any>;
  currentPageEndMarkerRef: React.RefObject<any>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastScrollTop: number;
  lastSuccessfulQuery: IQueryManager<any>;
  nextPage: number;
  nextPageQuery: IQueryBuilder;
  nextPageEndMarkerRef: React.RefObject<any>;
  nextPageStartMarkerRef: React.RefObject<any>;
  nextPlaceHolderHeight: number;
  pageHeightMap: { [key: string]: number };
  previousPage: number;
  previousPageQuery: IQueryBuilder;
  previousPageEndMarkerRef: React.RefObject<any>;
  previousPageStartMarkerRef: React.RefObject<any>;
  previousPlaceHolderHeight: number;
  query: IQueryBuilder;
  totalPages: number;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>>
  extends Omit<IInfiniteScrollProps<T>, "query">, Omit<IInfiniteScrollStateProps, "query"> {
  query: IQueryManager<T>;
  handleScrollDebounced: ((e) => void) & Cancelable;
  handleScrollThrottled: ((e) => void) & Cancelable;
  handleScrollPersistingEvent: (e) => void;
  estimatedPageHeight: number;
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
    contentPlaceHolderComponent: DefaultContentPlaceHolder,
  }),
  withStateHandlers<IInfiniteScrollStateProps, { updateState }, IInfiniteScrollProps<any>>(
    ({ query, modelName }) => ({
      currentPage: 1,
      currentPageStartMarkerRef: React.createRef(),
      currentPageEndMarkerRef: React.createRef(),
      hasNextPage: false,
      hasPreviousPage: false,
      lastScrollTop: 0,
      lastSuccessfulQuery: null,
      nextPage: null,
      nextPageQuery: null,
      nextPageEndMarkerRef: React.createRef(),
      nextPageStartMarkerRef: React.createRef(),
      nextPlaceHolderHeight: 0,
      pageHeightMap: {},
      previousPage: null,
      previousPageQuery: null,
      previousPageEndMarkerRef: React.createRef(),
      previousPageStartMarkerRef: React.createRef(),
      previousPlaceHolderHeight: 0,
      query: query instanceof QueryBuilder
        ? query
        : new QueryBuilder(modelName, query as IQueryParams),
      totalPages: 0,
    }),
    {
      updateState: () => newState => newState
    },
  ),
  withModelQuery(),
  withPropsOnChange(["currentPage", "pageHeightMap", "totalPages"], ({
    currentPage,
    pageHeightMap,
    totalPages,
  }) => {
    let previousPlaceHolderHeight = 0;
    let nextPlaceHolderHeight = 0;

    const estimatedPageHeight = average(Object.values(pageHeightMap));

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
      estimatedPageHeight,
      nextPlaceHolderHeight,
      previousPlaceHolderHeight,
    };
  }),
  withHandlers<any, any>({
    updateStateFromQuery: ({ updateState }) => (queryManager: IQueryManager<any>) => {
      updateState({
        currentPage: queryManager.response.currentPage,
        nextPage: queryManager.response.nextPage,
        nextPageQuery: queryManager.getNextPage(),
        hasNextPage: queryManager.hasNextPage(),
        hasPreviousPage: queryManager.hasPreviousPage(),
        lastSuccessfulQuery: queryManager,
        previousPage: queryManager.response.previousPage,
        previousPageQuery: queryManager.getPreviousPage(),
        totalPages: queryManager.response.totalPages,
      });
    },
  }),
  withDelayedHandlers({
    updatePageHeightMap: ({
      currentPage,
      currentPageEndMarkerRef,
      currentPageStartMarkerRef,
      lastSuccessfulQuery,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      nextPageEndMarkerRef,
      nextPageStartMarkerRef,
      pageHeightMap,
      previousPage,
      previousPageEndMarkerRef,
      previousPageStartMarkerRef,
      updateState,
    }) => () => {
      const updatedPageHeightMap = {};

      if (currentPageStartMarkerRef.current) {
        const currentPageHeight = calculateGroupHeight(
          currentPageStartMarkerRef.current.nextSibling,
          currentPageEndMarkerRef.current.previousSibling,
        );

        if (currentPageHeight !== pageHeightMap[currentPage]) {
          updatedPageHeightMap[currentPage] = currentPageHeight;
        }
      }

      if (hasPreviousPage && previousPageStartMarkerRef.current) {
        const previousPageHeight = calculateGroupHeight(
          previousPageStartMarkerRef.current.nextSibling,
          previousPageEndMarkerRef.current.previousSibling,
        );

        if (previousPageHeight !== pageHeightMap[previousPage]) {
          updatedPageHeightMap[previousPage] = previousPageHeight;
        }
      }

      if (hasNextPage && nextPageStartMarkerRef.current) {
        const nextPageHeight = calculateGroupHeight(
          nextPageStartMarkerRef.current.nextSibling,
          nextPageEndMarkerRef.current.previousSibling,
        );

        if (nextPageHeight !== pageHeightMap[nextPage]) {
          updatedPageHeightMap[nextPage] = nextPageHeight;
        }
      }

      if (!isEmpty(updatedPageHeightMap)) {
        pageHeightMap = {
          ...pageHeightMap,
          ...updatedPageHeightMap
        };

        updateState({
          pageHeightMap
        });
      }

      return pageHeightMap;
    },
    handleScroll: ({
      disableVirtualScrolling,
      estimatedPageHeight,
      lastScrollTop,
      lastSuccessfulQuery,
      pageHeightMap,
      updateState,
    }) => ({ target: { clientHeight, scrollHeight, scrollTop } }) => {

      // TODO fix "synthetic event" error in console

      const updatedState = {
        lastScrollTop: scrollTop
      } as Partial<IInfiniteScrollStateProps>;

      const scrollingDown = scrollTop > lastScrollTop;
      const currentScrollBottom = scrollHeight - scrollTop - clientHeight;
      const { totalPages, currentPage } = lastSuccessfulQuery.response;

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
          updatedState.query = lastSuccessfulQuery.query.page(nextPageToLoad);
        }
      } else if (scrollingDown && currentScrollBottom < (clientHeight / 2) && lastSuccessfulQuery.hasNextPage()) {
        updatedState.query = lastSuccessfulQuery.getNextPage();
      }

      return updateState(updatedState);
    },
  }),
  pure,
  lifecycle<IInfiniteScrollInternalProps<any>, {}>({
    componentDidMount() {
      console.log("componentDidMount", this.props);
      if (this.props.query.response) {
        this.props.updateStateFromQuery(this.props.query);
      }
    },
    componentDidUpdate(prevProps) {
      console.log("componentDidUpdate", this.props);
      if (prevProps.query !== this.props.query && this.props.query.response) {
        this.props.updateStateFromQuery(this.props.query);
      } else if (this.props.lastSuccessfulQuery && this.props.pageHeightMap === prevProps.pageHeightMap) {
        this.props.updatePageHeightMap();
      }
    },
  }),
  withLoadingIndicator(({ lastSuccessfulQuery }) => !lastSuccessfulQuery || !lastSuccessfulQuery.response),
  omitProps([
    "currentPage",
    "items",
    "lastScrollTop",
    "loadingComponent",
    "loadingComponentProps",
    "totalPages",
    "updatePageHeightMap",
    "updateState",
    "updateStateFromQuery",
  ]),
)(({
  containerComponent: ContainerComponent,
  contentPlaceHolderComponent: ContentPlaceHolder,
  currentPageEndMarkerRef,
  currentPageStartMarkerRef,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScroll,
  hasPreviousPage,
  hasNextPage,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPage,
  nextPageQuery,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPage,
  previousPageQuery,
  previousPageEndMarkerRef,
  previousPageStartMarkerRef,
  previousPlaceHolderHeight,
  nextPageStartMarkerRef,
  nextPageEndMarkerRef,
  lastSuccessfulQuery: queryManager,
  ...containerProps
}) => (
  <ContainerComponent {...containerProps} onScroll={handleScroll}>
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
