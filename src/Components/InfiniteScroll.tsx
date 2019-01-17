import * as React from "react";
import { IModel, IModelData, IQueryBuilder, IQueryManager, IQueryParams, QueryBuilder } from "redux-data-service";
import { Omit } from "redux-data-service/dist/Omit";
import { compose, defaultProps, lifecycle, pure, setDisplayName, withHandlers, withProps, withPropsOnChange, withState, withStateHandlers } from "recompose";
import { debounce } from "lodash";

import { Query } from "../Query";
import { omitProps } from "../Helpers";
import { withModelQuery } from "../WithModelQuery";
import { average } from "../Helpers/Average";

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
  currentPageHeightRef: React.RefObject<any>;
  previousPageHeightRef: React.RefObject<any>;
  nextPageHeightRef: React.RefObject<any>;
  handleScrollDebounced: (e) => void;
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
    borderBottom: "solid 1px #999",
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
    disableVirtualScrolling: false,
    contentPlaceHolderComponent: DefaultContentPlaceHolder,
  }),
  withProps(
    {
      currentPageHeightRef: React.createRef(),
      previousPageHeightRef: React.createRef(),
      nextPageHeightRef: React.createRef(),
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
      currentPageHeightRef,
      nextPageHeightRef,
      pageHeightMap,
      previousPageHeightRef,
      recordPageHeight,
    }) => (query) => {
      const currentPageHeight = currentPageHeightRef.current.getBoundingClientRect().height;
      let previousPageHeight;
      let nextPageHeight;

      const updatedPageHeightMap = {
        ...pageHeightMap,
        [query.response.currentPage]: currentPageHeight,
      };

      if (query.hasPreviousPage()) {
        previousPageHeight = previousPageHeightRef.current.getBoundingClientRect().height;
        updatedPageHeightMap[query.response.previousPage] = previousPageHeight;
      }

      if (query.hasNextPage()) {
        nextPageHeight = nextPageHeightRef.current.getBoundingClientRect().height;
        updatedPageHeightMap[query.response.nextPage] = nextPageHeight;
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
  })),
  withHandlers({
    handleScrollPersistingEvent: ({ handleScrollDebounced }) => (event: any) => {
      const clientHeight = event.target.clientHeight;
      const scrollHeight = event.target.scrollHeight;
      const scrollTop = event.target.scrollTop;

      handleScrollDebounced(clientHeight, scrollHeight, scrollTop);
    },
  }),
  lifecycle<{ disableVirtualScrolling, handleScrollDebounced, query: IQueryManager<any>, updatePageHeightMap }, {}>({
    componentDidMount() {
      if (!this.props.disableVirtualScrolling) {
        // Initialize page height map and estimated page height
        this.props.updatePageHeightMap(this.props.query);
      }
    },

    componentWillUnmount() {
      this.props.handleScrollDebounced.cancel();
    },
  }),
  omitProps([
    "debounceTime",
    "handleScroll",
    "handleScrollDebounced",
    "lastScrollTop",
    "recordPageHeight",
    "updateQuery",
    "updatePageHeightMap"]),
)(({
  containerComponent: ContainerComponent,
  contentPlaceHolderComponent: ContentPlaceHolder,
  currentPageHeightRef,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScrollPersistingEvent,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPageHeightRef,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPageHeightRef,
  previousPlaceHolderHeight,
  query: queryManager,
  ...containerProps }) => (
    <ContainerComponent {...containerProps} onScroll={handleScrollPersistingEvent}>
      {disableVirtualScrolling &&
        <DisplayPreviousPage queryManager={queryManager} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName} />
      }
      {queryManager.hasPreviousPage() && !disableVirtualScrolling &&
        <>
          <ContentPlaceHolder height={previousPlaceHolderHeight} />

          <span ref={previousPageHeightRef}>
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
          </span>
        </>
      }

      <span ref={currentPageHeightRef}>
        {queryManager.items.map(model => (
          <ModelComponent key={model.id} model={model} {...modelComponentProps} />
        ))}
      </span>

      {queryManager.hasNextPage() && (
        <>
          <span ref={nextPageHeightRef}>
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
          </span>

          {!disableVirtualScrolling &&
            <ContentPlaceHolder height={nextPlaceHolderHeight} />
          }
        </>
      )
      }
    </ContainerComponent>
  ));
