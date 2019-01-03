import * as React from "react";
import { IModelData, IQueryParams, IQueryBuilder, QueryManager, QueryBuilder, IModel, IQueryManager } from "redux-data-service";
import { compose, setDisplayName, withProps, withStateHandlers, lifecycle, withState } from "recompose";
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
  initialScrollPosition?: number;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>> extends Omit<IInfiniteScrollProps<any>, "query"> {
  query: IQueryManager<T>;
  updateQuery: (queryBuilder: IQueryBuilder) => void;
  lastScrollTop: number;
  handleScrollDebounced: (e) => void;
  handleScrollPersistingEvent: (e) => void;
}

const DisplayPreviousPage = (({ queryManager, modelName, itemComponent: ItemComponent, itemProps }) => {
  return queryManager.hasPreviousPage() && (
    <>
      <strong>
        {JSON.stringify(queryManager.getPreviousPage().queryParams)}
      </strong>
      <Query modelName={modelName} query={queryManager.getPreviousPage()}>
        {({ query }) => (
          <>
            <DisplayPreviousPage queryManager={query} itemComponent={ItemComponent} itemProps={itemProps} modelName={modelName} />
            {query.items.map(item => (
              <><p>Next Page</p>
              <ItemComponent key={item.id} item={item} {...itemProps} /></>
            ))}
          </>    
        )}
      </Query>
    </>
  );
});

export const InfiniteScroll = compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  withState<IInfiniteScrollProps<any>, IQueryBuilder, "query", "updateQuery">("query", "updateQuery", ({ query, modelName }) => (
    query instanceof QueryBuilder
      ? query
      : new QueryBuilder(modelName, query as IQueryParams)
  )),
  withModelQuery(),
  withStateHandlers<{ lastScrollTop: number }, { handleScroll }, IInfiniteScrollInternalProps<any>>(
    ({ initialScrollPosition }) => ({
      lastScrollTop: initialScrollPosition || 0,
    }),
    {
      handleScroll: ({ lastScrollTop }, { query, updateQuery }) => (clientHeight: number, scrollHeight: number, currentScrollTop: number) => {
        console.log(lastScrollTop, query);

        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollingUp = currentScrollTop < lastScrollTop;

        const scrollBottom = scrollHeight - currentScrollTop - clientHeight;

        console.log("scrollBottom", scrollBottom);

        if (scrollingDown && scrollBottom < 10 && query.hasNextPage()) {
          console.log("load next page");
          updateQuery(query.getNextPage());
        } else if (scrollingUp && currentScrollTop < clientHeight && query.hasPreviousPage()) {
          console.log("load previous page");
          updateQuery(query.getPreviousPage());
        }

        console.log("do not load new page");
        return { lastScrollTop: currentScrollTop };
      },
    },
  ),
  // withProps(({ handleScroll }) => ({
  //   handleScrollDebounced: debounce(handleScroll, 200)
  // })),
  withProps(({ handleScroll }) => ({
    handleScrollPersistingEvent: (event: React.UIEvent) => {
      const clientHeight = event.currentTarget.clientHeight;
      const scrollHeight = event.currentTarget.scrollHeight;
      const scrollTop = event.currentTarget.scrollTop;

      console.log(clientHeight, scrollHeight, scrollTop);

      handleScroll(clientHeight, scrollHeight, scrollTop);
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
        {/*queryManager.hasPreviousPage() && (
          <>
            <strong>
              {JSON.stringify(queryManager.getPreviousPage().queryParams)}
            </strong>
            <Query modelName={modelName} query={queryManager.getPreviousPage()}>
              {
                queryManager.items.map(item => (
                  <ItemComponent key={item.id} item={item} {...itemProps} />
                ))
              }
            </Query>
            </>
          )*/}

        <DisplayPreviousPage queryManager={queryManager} itemComponent={ItemComponent} itemProps={itemProps} modelName={modelName} />

        <hr />

          {/*queryManager.items.map(item => (
            <ItemComponent key={item.id} item={item} {...itemProps} />
        ))*/}

        <hr />

        {queryManager.hasNextPage() && (
          <>
            <strong>
              {JSON.stringify(queryManager.getNextPage().queryParams)}
            </strong>
            <Query modelName={modelName} query={ queryManager.query.queryParams }>
              {({ query }) => (
                query.items.map(item => (
                  <><p>Next Page</p>
                  <ItemComponent key={item.id} item={item} {...itemProps} /></>
                ))
              )}
            </Query>
          </>
          )}
        </>
    </ContainerComponent>
  ));
