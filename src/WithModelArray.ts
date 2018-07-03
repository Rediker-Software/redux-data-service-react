import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";
import { Observable } from "rxjs/Observable";

import { plural } from "pluralize";
import { branch, mapPropsStream } from "recompose";

import { getDataService } from "Services";

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
 * @returns HOC of model linked to data service
 *
 */

export function withModelArray<P>(
  dataServiceName: string,
  idPropKey: string = dataServiceName + "Ids",
  modelPropKey: string = plural(dataServiceName),
) {
  return branch(
    (props) => props[modelPropKey] == null && props[idPropKey] != null,
    mapPropsStream<any, P>((props$: Observable<any>) =>
      props$.combineLatest(
        props$.switchMap(props => getDataService(dataServiceName).getByIds(props[idPropKey])),
        (props, model) => ({ [modelPropKey]: model, ...props }),
      ),
    ),
  );
}
