import * as React from "react";
import { compose, pure, setDisplayName } from "recompose";
import { IModel, IQueryBuilder, IQueryManager } from "redux-data-service";
import { Omit } from "redux-data-service/dist/Omit";

import { withModelQuery } from "../WithModelQuery";
import { omitProps } from "../Helpers";

export interface IInfiniteScrollPreviousPageProps {
  query: IQueryBuilder;
  modelComponent: React.ComponentType<{ model: IModel<any> } & any>;
  modelComponentProps?: any;
}

interface IInfiniteScrollPreviousPageInternalProps extends Omit<IInfiniteScrollPreviousPageProps, "query"> {
  query: IQueryManager<any>;
}

export const InfiniteScrollPreviousPage = compose<IInfiniteScrollPreviousPageInternalProps, IInfiniteScrollPreviousPageProps>(
  setDisplayName("InfiniteScrollPreviousPage"),
  pure,
  withModelQuery({ isLoading: ({ query }) => query.response == null }),
)(({
  query,
  modelComponent: ModelComponent,
  modelComponentProps
}) => (
  <React.Fragment key={`page-${query.response.currentPage}`}>
    {query.hasPreviousPage() && (
      <InfiniteScrollPreviousPage
        query={query.getPreviousPage()}
        modelComponent={ModelComponent}
        modelComponentProps={modelComponentProps}
      />
    )}
    {query.items.map(model => (
      <ModelComponent key={model.id} model={model} {...modelComponentProps} />
    ))}
  </React.Fragment>
));
