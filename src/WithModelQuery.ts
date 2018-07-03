import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";
import { Observable } from "rxjs/Observable";

import { branch, compose, defaultProps, mapPropsStreamWithConfig } from "recompose";
import { getDataService } from "redux-data-service";

import { defaultsDeep } from "lodash";
import { plural } from "pluralize";

import { withLoadingIndicator } from "./WithLoadingIndicator";
import rxjsConfig from "recompose/rxjsObservableConfig";

export interface IWithModelQueryOptions {
  modelName?: string;
  query?: any;
  items?: any;
  isLoading?: boolean;
}

/**
 * An HOC to inject a model array into a component given the name of the DataService for that model and some query
 * params which will be passed to the API to load those items.
 *
 * Automatically updates (rerenders) the component when the observable updates and
 * automatically unsubscribes on unmount
 */
export function withModelQuery<P = {}>(options?: IWithModelQueryOptions | P) {
  return compose<P, P>(
    defaultProps(options || {}),
    branch(
      ({ items, modelName }) => items == null && modelName != null,
      mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) =>
        props$.combineLatest(
          props$.switchMap(({ modelName, query }) => {
            const service = getDataService(modelName);
            const queryParams = defaultsDeep({}, query, service.getDefaultQueryParams());

            return service.getByQuery(queryParams);
          }),
          ({ modelName, query, ...props }, items) => ({ items, isLoading: items == null, ...props }),
        ),
      ),
    ),
    withLoadingIndicator<IWithModelQueryOptions>(({ items }) => items == null),
  );
}
