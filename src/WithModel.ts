import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";

import { Observable } from "rxjs/Observable";
import { branch, ComponentEnhancer, mapPropsStreamWithConfig } from "recompose";
import rxjsConfig from "recompose/rxjsObservableConfig";
import { getDataService } from "redux-data-service";

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
  return branch<P>(
    (props) => props[modelPropKey] == null && props[idPropKey] != null,
    mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) =>
      props$.combineLatest(
        props$.switchMap(props => getDataService(dataServiceName).getById(props[idPropKey])),
        (props, model) => ({ [modelPropKey]: model, ...props }),
      ),
    ),
  );
}
