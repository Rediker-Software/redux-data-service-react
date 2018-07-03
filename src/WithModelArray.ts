import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";
import { Observable } from "rxjs/Observable";

import { branch, ComponentEnhancer, mapPropsStreamWithConfig } from "recompose";
import { getDataService } from "redux-data-service";
import { plural } from "pluralize";
import rxjsConfig from "recompose/rxjsObservableConfig";

/**
 * An HOC to inject a model array into a component given the name of the DataService for that model and a list of ids.
 *
 * Automatically updates (rerenders) the component when the observable updates and
 * automatically unsubscribes on unmount
 *
 * @generic P: lifeCycle method output type
 * @param dataServiceName name of service to retrieve from service provider
 * @param idPropKey property name to find the list of ids from which to load the given list of models
 * @param modelPropKey name of component prop to enhance the component with the list of models
 */
export function withModelArray<P>(
  dataServiceName: string,
  idPropKey: string = dataServiceName + "Ids",
  modelPropKey: string = plural(dataServiceName),
): ComponentEnhancer<P, P> {
  return branch(
    (props) => props[modelPropKey] == null && props[idPropKey] != null,
    mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) =>
      props$.combineLatest(
        props$.switchMap(props => getDataService(dataServiceName).getByIds(props[idPropKey])),
        (props, model) => ({ [modelPropKey]: model, ...props }),
      ),
    ),
  );
}
