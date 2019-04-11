import * as React from "react";

import { IModel, IModelData, IQueryBuilder, IQueryManager, IQueryParams, QueryBuilder } from "redux-data-service";
import { Omit } from "redux-data-service/dist/Omit";

import {
  compose,
  defaultProps,
  lifecycle,
  pure,
  setDisplayName,
  withPropsOnChange,
  withStateHandlers
} from "recompose";

import { isEmpty } from "lodash";

import { Query } from "../Query";
import { withModelQuery } from "../WithModelQuery";
import { average, calculateGroupHeight, omitProps } from "../Helpers";
import { IWithDelayedHandlers, withDelayedHandlers } from "../WithDelayedHandlers";

import { InfiniteScrollPreviousPage } from "./InfiniteScrollPreviousPage";

export interface IInfiniteScrollProps<T extends IModelData> extends IWithDelayedHandlers {
  modelName: string;
  query: IQueryParams | IQueryBuilder;
  containerComponent: React.ComponentType<{ onScroll: React.UIEventHandler } & any>;
  modelComponent: React.ComponentType<{ model: T } & any>;
  modelComponentProps?: any;
  disableVirtualScrolling?: boolean;
  contentPlaceHolderComponent?: React.ComponentType<{ height: number | string }>;
  contentPlaceHolderComponentProps?: any;

  /* Any extra props will be passed-through to the container component */
  [key: string]: any;
}

export interface IInfiniteScrollStateProps<T extends IModelData> {
  currentItems: T[];
  currentPage: number;
  currentPageStartMarkerRef: React.RefObject<any>;
  currentPageEndMarkerRef: React.RefObject<any>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  lastScrollTop: number;
  nextPage: number;
  nextPageEndMarkerRef: React.RefObject<any>;
  nextPageQuery: IQueryBuilder;
  nextPageStartMarkerRef: React.RefObject<any>;
  nextPlaceHolderHeight: number;
  pageHeightMap: { [key: string]: number };
  previousPage: number;
  previousPageEndMarkerRef: React.RefObject<any>;
  previousPageQuery: IQueryBuilder;
  previousPageStartMarkerRef: React.RefObject<any>;
  previousPlaceHolderHeight: number;
  query: IQueryBuilder;
  totalPages: number;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>>
  extends Omit<IInfiniteScrollProps<T>, "query">, Omit<IInfiniteScrollStateProps<T>, "query"> {
  query: IQueryManager<T>;
  estimatedPageHeight: number;
}

interface IContentPlaceHolderProps {
  height: number | string;
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
  withStateHandlers<IInfiniteScrollStateProps<any>, { updateState, updateStateFromQuery }, IInfiniteScrollProps<any>>(
    ({ query, modelName }) => ({
      currentItems: null,
      currentPage: 1,
      currentPageStartMarkerRef: React.createRef(),
      currentPageEndMarkerRef: React.createRef(),
      hasNextPage: false,
      hasPreviousPage: false,
      lastScrollTop: 0,
      nextPage: null,
      nextPageEndMarkerRef: React.createRef(),
      nextPageQuery: null,
      nextPageStartMarkerRef: React.createRef(),
      nextPlaceHolderHeight: 0,
      pageHeightMap: {},
      previousPage: null,
      previousPageEndMarkerRef: React.createRef(),
      previousPageQuery: null,
      previousPageStartMarkerRef: React.createRef(),
      previousPlaceHolderHeight: 0,
      query: query instanceof QueryBuilder
        ? query
        : new QueryBuilder(modelName, query as IQueryParams),
      totalPages: 0,
    }),
    {
      updateState: () => newState => newState,
      updateStateFromQuery: () => (queryManager: IQueryManager<any>) => ({
        currentItems: queryManager.items,
        currentPage: queryManager.response.currentPage,
        nextPage: queryManager.response.nextPage,
        nextPageQuery: queryManager.getNextPage(),
        hasNextPage: queryManager.hasNextPage(),
        hasPreviousPage: queryManager.hasPreviousPage(),
        previousPage: queryManager.response.previousPage,
        previousPageQuery: queryManager.getPreviousPage(),
        totalPages: queryManager.response.totalPages,
      }),
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
  withDelayedHandlers({
    updatePageHeightMap: ({
      currentPage,
      currentPageEndMarkerRef,
      currentPageStartMarkerRef,
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
    }) => () => () => {
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
    },
    handleScroll: ({
      currentPage,
      disableVirtualScrolling,
      estimatedPageHeight,
      hasNextPage,
      lastScrollTop,
      nextPageQuery,
      pageHeightMap,
      query,
      totalPages,
      updateState,
    }) => ({ target: { clientHeight, scrollHeight, scrollTop } }) => () => {
      const updatedState = {
        lastScrollTop: scrollTop
      } as Partial<IInfiniteScrollStateProps<any>>;

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
          updatedState.query = query.query.page(nextPageToLoad);
        }
      } else if (hasNextPage && scrollingDown && currentScrollBottom < (clientHeight / 2)) {
        updatedState.query = nextPageQuery;
      }

      updateState(updatedState);
    },
  }),
  pure,
  lifecycle<IInfiniteScrollInternalProps<any>, {}>({
    componentDidMount() {
      if (this.props.query.response) {
        this.props.updateStateFromQuery(this.props.query);
      }
    },
    componentDidUpdate(prevProps) {
      if (prevProps.query !== this.props.query && this.props.query.response) {
        this.props.updateStateFromQuery(this.props.query);
      } else if (this.props.currentItems && this.props.pageHeightMap === prevProps.pageHeightMap) {
        this.props.updatePageHeightMap();
      }
    },
  }),
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
  contentPlaceHolderComponentProps,
  currentItems,
  currentPageEndMarkerRef,
  currentPageStartMarkerRef,
  disableVirtualScrolling,
  estimatedPageHeight,
  handleScroll,
  hasNextPage,
  hasPreviousPage,
  modelComponent: ModelComponent,
  modelComponentProps,
  modelName,
  nextPage,
  nextPageEndMarkerRef,
  nextPageQuery,
  nextPageStartMarkerRef,
  nextPlaceHolderHeight,
  pageHeightMap,
  previousPage,
  previousPageEndMarkerRef,
  previousPageQuery,
  previousPlaceHolderHeight,
  previousPageStartMarkerRef,
  ...containerProps
}) => (
    <ContainerComponent {...containerProps} onScroll={handleScroll}>

      {hasPreviousPage && disableVirtualScrolling && (
        <InfiniteScrollPreviousPage
          modelComponent={ModelComponent}
          modelComponentProps={modelComponentProps}
          query={previousPageQuery}
        />
      )}

      {hasPreviousPage && !disableVirtualScrolling && (
        <ContentPlaceHolder
          height={previousPlaceHolderHeight}
          {...contentPlaceHolderComponentProps}
        />
      )}

      {hasPreviousPage && !disableVirtualScrolling && (
        <script ref={previousPageStartMarkerRef} />
      )}

      {hasPreviousPage && !disableVirtualScrolling && (
        <Query
          modelName={modelName}
          query={previousPageQuery}
          loadingComponent={ContentPlaceHolder}
          loadingComponentProps={{ height: pageHeightMap[previousPage] || estimatedPageHeight }}
        >
          {({ query, items }) => (
            query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))
          )}
        </Query>
      )}

      {hasPreviousPage && !disableVirtualScrolling && (
        <script ref={previousPageEndMarkerRef} />
      )}

      <script ref={currentPageStartMarkerRef} />

      {(
        currentItems == null
          ? <ContentPlaceHolder height="100%" {...contentPlaceHolderComponentProps} />
          : currentItems.map(model => (
            <ModelComponent key={model.id} model={model} {...modelComponentProps} />
          ))
      )}

      <script ref={currentPageEndMarkerRef} />

      {hasNextPage && (
        <script ref={nextPageStartMarkerRef} />
      )}

      {hasNextPage && (
        <Query
          modelName={modelName}
          query={nextPageQuery}
          loadingComponent={ContentPlaceHolder}
          loadingComponentProps={{ height: pageHeightMap[nextPage] || estimatedPageHeight }}
        >
          {({ query, items }) => (
            query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))
          )}
        </Query>
      )}

      {hasNextPage && (
        <script ref={nextPageEndMarkerRef} />
      )}

      {hasNextPage && !disableVirtualScrolling && (
        <ContentPlaceHolder
          height={nextPlaceHolderHeight}
          {...contentPlaceHolderComponentProps}
        />
      )}

    </ContainerComponent>
  ));
