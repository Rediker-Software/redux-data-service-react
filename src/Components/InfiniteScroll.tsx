import * as React from "react";
import { IModelData, IQueryParams, QueryManager, QueryBuilder, IModel } from "redux-data-service";
import { compose, setDisplayName, withProps, withStateHandlers, lifecycle, withState } from "recompose";
import { debounce } from "lodash";

export interface IInfiniteScrollProps<T extends IModelData> {
  serviceName: string;
  containerComponent: React.ComponentType<{ onScroll: React.UIEventHandler } & any>;
  itemComponent: React.ComponentType<{ item: T } & any>;
  containerProps?: any;
  itemProps?: any;
  queryParams?: IQueryParams;
}

export interface IInfiniteScrollInternalProps<T extends IModel<IModelData>> extends IInfiniteScrollProps<any> {
  queryManager: QueryManager<T>;
  lastScrollTop: number;
  handleScrollDebounced: (e) => void;
  handleScrollPersistingEvent: (e) => void;
}

export const InfiniteScroll = compose<IInfiniteScrollInternalProps<any>, IInfiniteScrollProps<any>>(
  setDisplayName("InfiniteScroll"),
  withState("lastScrollTop", "setLastScrollTop", 0),
  withStateHandlers<{ queryManager: QueryManager<any>, lastScrollTop: number }, { handleScroll }, IInfiniteScrollProps<any>>(
    ({ serviceName, queryParams }) => ({
      queryManager: new QueryManager(new QueryBuilder(serviceName, queryParams ? queryParams : { pageNumber: 1 })),
      lastScrollTop: 0, // TODO: May need to adjust based on initial page number
    }),
    {
      handleScroll: ({ queryManager, lastScrollTop }) => (clientHeight: number, scrollHeight: number, currentScrollTop: number) => {
        // console.log("ScrollHeight: " + scrollHeight + " CurrentScrollTop: " + currentScrollTop);

        const scrollingDown = currentScrollTop > lastScrollTop;
        const scrollingUp = currentScrollTop < lastScrollTop;

        const scrollBottom = scrollHeight - currentScrollTop - clientHeight;

        if (scrollingDown && scrollBottom < clientHeight && queryManager.hasNextPage()) {
          // console.log("load next page");
          return { queryManager: new QueryManager(queryManager.getNextPage()) };
        }

        if (scrollingUp && currentScrollTop < clientHeight && queryManager.hasPreviousPage()) {
          // console.log("load previous page");
          return { queryManager: new QueryManager(queryManager.getPreviousPage()) };
        }

        // console.log("do not load new page");
        return { queryManager, lastScrollTop: currentScrollTop };
      },
    }
  ),
  withProps(({ handleScroll }) => ({
    handleScrollDebounced: debounce(handleScroll, 200),
  })),
  withProps(({ handleScrollDebounced }) => ({
    handleScrollPersistingEvent: (event: React.UIEvent) => {
      const clientHeight = event.currentTarget.clientHeight;
      const scrollHeight = event.currentTarget.scrollHeight;
      const scrollTop = event.currentTarget.scrollTop;

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
  queryManager,
  serviceName,
  handleScrollPersistingEvent
}) => (
    <ContainerComponent {...containerProps}>
      <Scrollbar onScroll={handleScrollPersistingEvent}>
      {queryManager.hasPreviousPage() && (
        <Query modelName={serviceName} query={queryManager.getPreviousPage().queryParams}>
          {({ items }) => (
            items.map(item => (
              <ItemComponent key={item.id} item={item} {...itemProps} />
            ))
          )}
        </Query>
      )}

      <Query modelName={serviceName} query={queryManager.query.queryParams}>
        {({ items }) => (
          items.map(item => (
            <ItemComponent key={item.id} item={item} {...itemProps} />
          ))
        )}
      </Query>

      {queryManager.hasNextPage() && (
        <Query modelName={serviceName} query={queryManager.getNextPage().queryParams}>
          {({ items }) => (
            items.map(item => (
              <ItemComponent key={item.id} item={item} {...itemProps} />
            ))
          )}
        </Query>
      )}
        </Scrollbar>
    </ContainerComponent>
  ));
