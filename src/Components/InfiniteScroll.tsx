import * as React from "react";
import { IModelData, IQueryParams, IQueryBuilder, QueryManager, QueryBuilder, IModel, IQueryManager } from "redux-data-service";
import { compose, setDisplayName, withProps, withStateHandlers, lifecycle, pure, withState } from "recompose";
import { debounce } from "lodash";
import { Query } from "../Query";
import { withModelQuery } from "../WithModelQuery";
import { Omit } from "redux-data-service/dist/Omit";

export interface IInfiniteScrollProps<T extends IModelData> {
  modelName: string;
  query: IQueryParams | IQueryBuilder;
  containerComponent: React.ComponentType<{ onScroll: React.UIEventHandler } & any>;
  itemComponent: React.ComponentType<{ item: T } & any>;
  containerProps?: any;
  itemProps?: any;
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
  itemComponent: React.ComponentType<{ item: T } & any>;
  itemProps?: any;
}

const DisplayPreviousPage = compose<IDisplayPreviousPageProps<any>, IDisplayPreviousPageProps<any>>(
  setDisplayName("DisplayPreviousPage"),
  pure,
)(
  (({ queryManager, modelName, itemComponent: ItemComponent, itemProps }) => {
    return queryManager.hasPreviousPage() && (
      <Query key={`page-${queryManager.response.previousPage}`} modelName={modelName} query={queryManager.getPreviousPage()}>
        {({ query }) => (
          <>
            <DisplayPreviousPage queryManager={query} itemComponent={ItemComponent} itemProps={itemProps} modelName={modelName} />
            {query.items.map(item => (
              <ItemComponent key={item.id} item={item} {...itemProps} />
            ))}
          </>
        )}
      </Query>
    );
  })
);

export const InfiniteScroll = compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  withState<IInfiniteScrollProps<any>, IQueryBuilder, "query", "updateQuery">("query", "updateQuery", ({ query, modelName }) => (
    query instanceof QueryBuilder
      ? query
      : new QueryBuilder(modelName, query as IQueryParams)
  )),
  withModelQuery(),
  withStateHandlers<{ lastScrollTop: number }, { handleScroll }, IInfiniteScrollInternalProps<any>>(
    { lastScrollTop: 0, },
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
  withProps(({ handleScroll }) => ({
    handleScrollDebounced: debounce(handleScroll, 200)
  })),
  withProps(({ handleScrollDebounced }) => ({
    handleScrollPersistingEvent: (event: React.UIEvent) => {
      const clientHeight = event.currentTarget.clientHeight;
      const scrollHeight = event.currentTarget.scrollHeight;
      const scrollTop = event.currentTarget.scrollTop;

      console.log(clientHeight, scrollHeight, scrollTop);

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
  itemComponent: ItemComponent,
  itemProps,
  query: queryManager,
  modelName,
  handleScrollPersistingEvent,
}) => (
    <ContainerComponent {...containerProps} onScroll={handleScrollPersistingEvent}>
      <>
        <DisplayPreviousPage queryManager={queryManager} itemComponent={ItemComponent} itemProps={itemProps} modelName={modelName} />

        {queryManager.items.map(item => (
          <ItemComponent key={item.id} item={item} {...itemProps} />
        ))}

        {queryManager.hasNextPage() && (
          <Query modelName={modelName} query={queryManager.getNextPage()}>
            {({ query }) => (
              query.items.map(item => (
                <ItemComponent key={item.id} item={item} {...itemProps} />
              ))
            )}
          </Query>
        )}
      </>
    </ContainerComponent>
  ));
