import "rxjs/add/operator/combineLatest";
import "rxjs/add/operator/distinctUntilChanged";
import "rxjs/add/operator/map";
import "rxjs/add/operator/switchMap";
import { Observable } from "rxjs/Observable";

import {branch, compose, defaultProps, mapPropsStreamWithConfig} from "recompose";
import { getDataService } from "redux-data-service";

import { defaultsDeep } from "lodash";

import { withLoadingIndicator, IWithLoadingIndicatorProps } from "./WithLoadingIndicator";
import rxjsConfig from "recompose/rxjsObservableConfig";

export interface IWithModelQueryProps {
  query?: any;
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
  return compose<P & { items: any[] }, P>(
    defaultProps(options || {}),
    branch(
      ({ items, modelName }) => modelName && items == null && modelName != null,
      mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) =>
        props$.combineLatest(
          props$.switchMap(({ modelName, query }) => {
            const service = getDataService(modelName);
            return service
              .getDefaultQueryParams()
              .map(defaultQueryParams => defaultsDeep({}, query, defaultQueryParams))
              .switchMap(queryParams => service.getByQuery(queryParams));
          }),
          ({ modelName, query, ...props }, items) => ({ items, ...props }),
        ),
      ),
    ),
    withLoadingIndicator<IWithModelQueryOptions>(({ items }) => items == null),
  );
}
