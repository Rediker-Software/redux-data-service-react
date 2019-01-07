import * as React from "react";
import { IModel, IModelData, IQueryBuilder, IQueryManager, IQueryParams, QueryBuilder } from "redux-data-service";
import { Omit } from "redux-data-service/dist/Omit";
import { compose, defaultProps, lifecycle, pure, setDisplayName, withProps, withState, withStateHandlers } from "recompose";
import { debounce } from "lodash";

import { Query } from "../Query";
import { withModelQuery } from "../WithModelQuery";

export interface IInfiniteScrollProps<T extends IModelData> {
  modelName: string;
  query: IQueryParams | IQueryBuilder;
  containerComponent: React.ComponentType<{ onScroll: React.UIEventHandler } & any>;
  modelComponent: React.ComponentType<{ model: T } & any>;
  containerProps?: any;
  modelComponentProps?: any;
  debounceTime?: number;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>> extends Omit<IInfiniteScrollProps<any>, "query"> {
  query: IQueryManager<T>;
  updateQuery: (queryBuilder: IQueryBuilder) => void;
  lastScrollTop: number;
  handleScrollDebounced: (e) => void;
  handleScrollPersistingEvent: (e) => void;
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

/**
 * Adds infinite scroll capability to a container and model component, querying for the next page of results when scrolling down.
 * The container component must be scrollable.
 */
export const InfiniteScroll = compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  defaultProps({
    debounceTime: 200,
  }),
  withState<IInfiniteScrollProps<any>, IQueryBuilder, "query", "updateQuery">("query", "updateQuery", ({ query, modelName }) => (
    query instanceof QueryBuilder
      ? query
      : new QueryBuilder(modelName, query as IQueryParams)
  )),
  withModelQuery(),
  withStateHandlers<{ lastScrollTop: number }, { handleScroll }, IInfiniteScrollInternalProps<any>>(
    { lastScrollTop: 0 },
    {
      handleScroll: ({ lastScrollTop }, { query, updateQuery }) => (clientHeight: number, scrollHeight: number, currentScrollTop: number) => {
        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollBottom = scrollHeight - currentScrollTop - clientHeight;

        if (scrollingDown && scrollBottom < (clientHeight / 2) && query.hasNextPage()) {
          updateQuery(query.getNextPage());
        }

        return { lastScrollTop: currentScrollTop };
      },
    },
  ),
  withProps(({ handleScroll, debounceTime }) => ({
    handleScrollDebounced: debounce(handleScroll, debounceTime),
  })),
  withProps(({ handleScrollDebounced }) => ({
    handleScrollPersistingEvent: (event: any) => {
      const clientHeight = event.target.clientHeight;
      const scrollHeight = event.target.scrollHeight;
      const scrollTop = event.target.scrollTop;

      handleScrollDebounced(clientHeight, scrollHeight, scrollTop);
    },
  })),
  lifecycle<{ handleScrollDebounced }, {}>({
    componentWillUnmount() {
      this.props.handleScrollDebounced.cancel();
    },
  }),
)(({
  containerComponent: ContainerComponent,
  containerProps,
  modelComponent: ModelComponent,
  modelComponentProps,
  query: queryManager,
  modelName,
  handleScrollPersistingEvent,
}) => (
    <ContainerComponent {...containerProps} onScroll={handleScrollPersistingEvent}>
      <DisplayPreviousPage queryManager={queryManager} modelComponent={ModelComponent} modelComponentProps={modelComponentProps} modelName={modelName} />

      {queryManager.items.map(model => (
        <ModelComponent key={model.id} model={model} {...modelComponentProps} />
      ))}

      {queryManager.hasNextPage() && (
        <Query modelName={modelName} query={queryManager.getNextPage()}>
          {({ query }) => (
            query.items.map(model => (
              <ModelComponent key={model.id} model={model} {...modelComponentProps} />
            ))
          )}
        </Query>
      )}
    </ContainerComponent>
  ));
