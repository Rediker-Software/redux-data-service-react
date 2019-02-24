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

import { debounce, throttle } from "lodash";

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

export interface IInfiniteScrollHeightMapProps {
  pageHeightMap: { [key: string]: number };
  estimatedPageHeight: number;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>> extends Omit<IInfiniteScrollProps<any>, "query">, IInfiniteScrollHeightMapProps {
  query: IQueryManager<T>;
  updatePageHeightMap: (query: IQueryManager<any>) => any;
  updateQuery: (queryBuilder: IQueryBuilder) => void;
  lastScrollTop: number;
  nextPageHeightRef: React.RefObject<any>;
  handleScrollDebounced: (e) => void;
  handleScrollThrottled: (e) => void;
  handleScrollPersistingEvent: (e) => void;
  previousPlaceHolderHeight: number;
  nextPlaceHolderHeight: number;
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
            <DisplayPreviousPage queryManager={query} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName}/>
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
    <div style={style}/>
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
    disableVirtualScrolling: false,
    contentPlaceHolderComponent: DefaultContentPlaceHolder,
  }),
  withProps(
    {
      previousPageStartMarkerRef: React.createRef(),
      previousPageEndMarkerRef: React.createRef(),
      currentPageStartMarkerRef: React.createRef(),
      currentPageEndMarkerRef: React.createRef(),
      nextPageStartMarkerRef: React.createRef(),
      nextPageEndMarkerRef: React.createRef(),
    }),
  withStateHandlers<IInfiniteScrollHeightMapProps, { recordPageHeight }, IInfiniteScrollInternalProps<any>>(
    { pageHeightMap: {}, estimatedPageHeight: 0 },
    {
      recordPageHeight: () =>
        (pageHeightMap: { [key: string]: number }) => ({
          pageHeightMap,
          estimatedPageHeight: average(Object.values(pageHeightMap)),
        }),
    },
  ),
  withState<IInfiniteScrollProps<any>, IQueryBuilder, "query", "updateQuery">("query", "updateQuery", ({ query, modelName }) => {
    return query instanceof QueryBuilder
      ? query
      : new QueryBuilder(modelName, query as IQueryParams);
  }),
  withModelQuery(),
  withPropsOnChange(["query", "estimatedPageHeight"], ({ query, pageHeightMap, estimatedPageHeight }) => {
    let previousPlaceHolderHeight = 0;
    let nextPlaceHolderHeight = 0;

    for (let x = query.response.currentPage - 2; x > 0; x--) {
      previousPlaceHolderHeight += x in pageHeightMap
        ? pageHeightMap[x]
        : estimatedPageHeight;
    }

    for (let x = query.response.currentPage + 2; x <= query.response.totalPages; x++) {
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
      previousPageStartMarkerRef,
      previousPageEndMarkerRef,
      currentPageStartMarkerRef,
      currentPageEndMarkerRef,
      nextPageStartMarkerRef,
      nextPageEndMarkerRef,
      pageHeightMap,
      recordPageHeight,
    }) => (query) => {

      const currentPageHeight = calculateGroupHeight(
        currentPageStartMarkerRef.current.nextSibling,
        currentPageEndMarkerRef.current.previousSibling,
      );

      const updatedPageHeightMap = {
        ...pageHeightMap,
        [query.response.currentPage]: currentPageHeight,
      };

      if (query.hasPreviousPage()) {
        updatedPageHeightMap[query.response.previousPage] = calculateGroupHeight(
          previousPageStartMarkerRef.current.nextSibling,
          previousPageEndMarkerRef.current.previousSibling,
        );
      }

      if (query.hasNextPage()) {
        updatedPageHeightMap[query.response.nextPage] = calculateGroupHeight(
          nextPageStartMarkerRef.current.nextSibling,
          nextPageEndMarkerRef.current.previousSibling,
        );
      }

      recordPageHeight(updatedPageHeightMap);

      return updatedPageHeightMap;
    },
  }),
  withStateHandlers<{ lastScrollTop: number }, { handleScroll }, IInfiniteScrollInternalProps<any>>(
    { lastScrollTop: 0 },
    {
      handleScroll: ({ lastScrollTop }, { disableVirtualScrolling, estimatedPageHeight, query, updatePageHeightMap, updateQuery }) =>
        (clientHeight: number, scrollHeight: number, currentScrollTop: number) => {
          const scrollingDown = currentScrollTop > lastScrollTop;
          const currentScrollBottom = scrollHeight - currentScrollTop - clientHeight;

          if (!disableVirtualScrolling) {
            const updatedPageHeightMap = updatePageHeightMap(query);

            let nextPageToLoad = 1;
            let nextPageScrollTop = updatedPageHeightMap[1];

            while (nextPageScrollTop < (currentScrollTop + (clientHeight / 2)) && nextPageToLoad < query.response.totalPages) {
              nextPageToLoad++;
              nextPageScrollTop += nextPageToLoad in updatedPageHeightMap
                ? updatedPageHeightMap[nextPageToLoad]
                : estimatedPageHeight;
            }

            if (query.response.currentPage !== nextPageToLoad) {
              updateQuery(query.query.page(nextPageToLoad));
            }
          } else if (scrollingDown && currentScrollBottom < (clientHeight / 2) && query.hasNextPage()) {
            updateQuery(query.getNextPage());
          }

          return { lastScrollTop: currentScrollTop };
        },
    },
  ),
  withPropsOnChange(["debounceTime"], ({ debounceTime, handleScroll }) => ({
    handleScrollDebounced: debounce(handleScroll, debounceTime),
    handleScrollThrottled: throttle(handleScroll, debounceTime),
  })),
  withHandlers({
    handleScrollPersistingEvent: ({ handleScrollDebounced, handleScrollThrottled }) => (event: any) => {
      const clientHeight = event.target.clientHeight;
      const scrollHeight = event.target.scrollHeight;
      const scrollTop = event.target.scrollTop;

      handleScrollThrottled(clientHeight, scrollHeight, scrollTop);
      handleScrollDebounced(clientHeight, scrollHeight, scrollTop);
    },
  }),
  lifecycle<{ disableVirtualScrolling, handleScrollDebounced, handleScrollThrottled, query: IQueryManager<any>, updatePageHeightMap }, {}>({
    componentDidMount() {
      if (!this.props.disableVirtualScrolling) {
        // Initialize page height map and estimated page height
        this.props.updatePageHeightMap(this.props.query);
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
    "updateQuery",
    "updatePageHeightMap",
  ]),
  pure,
)(({
  containerComponent: ContainerComponent,
  contentPlaceHolderComponent: ContentPlaceHolder,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScrollPersistingEvent,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPageHeightRef,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPlaceHolderHeight,
  previousPageStartMarkerRef,
  previousPageEndMarkerRef,
  currentPageStartMarkerRef,
  currentPageEndMarkerRef,
  nextPageStartMarkerRef,
  nextPageEndMarkerRef,
  query: queryManager,
  ...containerProps
}) => (
  <ContainerComponent {...containerProps} onScroll={handleScrollPersistingEvent}>
    {disableVirtualScrolling && (
      <DisplayPreviousPage queryManager={queryManager} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName}/>
    )}
    {queryManager.hasPreviousPage() && !disableVirtualScrolling &&
    <>
      <ContentPlaceHolder height={previousPlaceHolderHeight}/>

      <script ref={previousPageStartMarkerRef}/>

      <Query
        modelName={modelName}
        query={queryManager.getPreviousPage()}
        loadingComponent={ContentPlaceHolder}
        loadingComponentProps={{ height: pageHeightMap[queryManager.response.previousPage] || estimatedPageHeight }}
      >
        {({ query }) => (
          query.items.map(model => (
            <ModelComponent key={model.id} model={model} {...modelComponentProps} />
          ))
        )}
      </Query>

      <script ref={previousPageEndMarkerRef}/>
    </>
    }

    <script ref={currentPageStartMarkerRef}/>

    {queryManager.items.map(model => (
      <ModelComponent key={model.id} model={model} {...modelComponentProps} />
    ))}

    <script ref={currentPageEndMarkerRef}/>

    {queryManager.hasNextPage() && (
      <>
        <script ref={nextPageStartMarkerRef}/>

        <Query
          modelName={modelName}
          query={queryManager.getNextPage()}
          loadingComponent={ContentPlaceHolder}
          loadingComponentProps={{ height: pageHeightMap[queryManager.response.nextPage] || estimatedPageHeight }}
        >
          {({ query }) => (
            query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))
          )}
        </Query>

        <script ref={nextPageEndMarkerRef}/>

        {!disableVirtualScrolling && (
          <ContentPlaceHolder height={nextPlaceHolderHeight}/>
        )}
      </>
    )}
  </ContainerComponent>
));
