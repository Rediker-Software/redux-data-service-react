import "rxjs/add/observable/of";
import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { Observable } from "rxjs/Observable";

import { branch, compose, ComponentEnhancer, defaultProps, mapPropsStreamWithConfig } from "recompose";
import { getDataService, IQueryBuilder, IQueryManager, IQueryParams, QueryBuilder } from "redux-data-service";

import { defaultsDeep } from "lodash";

import { withLoadingIndicator, IWithLoadingIndicatorProps } from "./WithLoadingIndicator";
import rxjsConfig from "recompose/rxjsObservableConfig";

export interface IWithModelQueryProps {
  query?: IQueryParams | IQueryBuilder;
  items?: any[];
}

export interface IWithModelQueryOptions extends IWithModelQueryProps, IWithLoadingIndicatorProps {
  modelName?: string;
}

/**
 * An HOC to inject a model array into a component given the name of the DataService for that model and some query
 * params which will be passed to the API to load those items.
 *
 * Automatically updates (rerenders) the component when the observable updates and
 * automatically unsubscribes on unmount
 */
export function withModelQuery<P = {}>(options?: IWithModelQueryOptions & P): ComponentEnhancer<P, P> {
  return compose<P & { items: any[], query: IQueryManager<any> }, P & IWithModelQueryOptions>(
    defaultProps(options || {}),
    branch(
      ({ items, modelName }) => modelName && items == null,
      mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) =>
        props$.combineLatest(
          props$.switchMap(({ modelName, query }: IWithModelQueryOptions) => {
            const service = getDataService(modelName);

            const observable = (query instanceof QueryBuilder)
              ? Observable.of(query)
              : service
                .getDefaultQueryParams()
                .map(defaultQueryParams => new QueryBuilder(modelName, defaultsDeep({}, query, defaultQueryParams)));

            return observable.switchMap(queryBuilder => service.getByQuery(queryBuilder));
          }),
          ({ modelName, query, ...props }, queryManager) => ({
            query: queryManager,
            items: queryManager && queryManager.items,
            ...props,
          }),
        ),
      ),
    ),
    withLoadingIndicator<IWithModelQueryOptions>(({ items }) => items == null),
  );
}
