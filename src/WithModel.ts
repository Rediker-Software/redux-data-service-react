import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";

import {Observable} from "rxjs/Observable";
import rxjsConfig from "recompose/rxjsObservableConfig";
import {branch, ComponentEnhancer, compose, mapPropsStreamWithConfig} from "recompose";

import {getDataService} from "redux-data-service";
import {withLoadingIndicator} from "./WithLoadingIndicator";

/**
 * An HOC to inject a model into a component given the name of the DataService for that model.
 *
 * Automatically updates (rerenders) the component when the observable updates and
 * automatically unsubscribes on unmount
 *
 * @generic P: lifeCycle method output type
 * @param dataServiceName name of service to retrieve from service provider
 * @param idPropKey property name to find the id for the model on
 * @param modelPropKey name of model prop name to enhance component with
 */

export function withModel<P>(
  dataServiceName: string,
  idPropKey: string = dataServiceName + "Id",
  modelPropKey: string = dataServiceName,
): ComponentEnhancer<P, P> {
  return compose<P, P>(
    branch<P>(
      (props) => props[modelPropKey] != null || props[idPropKey] != null,
      mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) =>
        props$.combineLatest(
          props$.switchMap(props => getDataService(dataServiceName).getById(props[idPropKey] || props[modelPropKey].id)),
          (props, model) => ({[modelPropKey]: model, ...props}),
        ),
      ),
    ),
    withLoadingIndicator(props => props[modelPropKey] == null),
  );
}
