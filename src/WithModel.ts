import "rxjs/add/operator/switchMap";
import "rxjs/add/operator/combineLatest";

import { Observable } from "rxjs/Observable";
import rxjsConfig from "recompose/rxjsObservableConfig";
import { branch, ComponentEnhancer, compose, defaultProps, mapProps, mapPropsStreamWithConfig } from "recompose";

import { getDataService } from "redux-data-service";
import { withLoadingIndicator } from "./WithLoadingIndicator";

export interface IWithModelProps {
  modelName?: string;
  idPropKey?: string;
  modelPropKey?: string;
}

/**
 * An HOC to inject a model into a component given the name of the DataService for that model.
 *
 * Automatically updates (rerenders) the component when the observable updates and
 * automatically unsubscribes on unmount
 */
export function withModel<P>(options?: IWithModelProps): ComponentEnhancer<P, P & IWithModelProps> {
  return compose<P & IWithModelProps, P>(
    defaultProps({
      idPropKey: "id",
      modelPropKey: "model",
      ...options,
    }),
    branch<P & IWithModelProps>(
      (props) => props[props.modelPropKey] == null && props[props.idPropKey] != null,
      mapPropsStreamWithConfig(rxjsConfig)<any, P>((props$: Observable<any>) => props$.combineLatest(
        props$.switchMap(({ modelName, idPropKey, ...props }) => (
          getDataService(modelName).getById(props[idPropKey])
        )),
        (props, model) => ({
          [props.modelPropKey]: model,
          ...props,
        }),
      )),
    ),
    withLoadingIndicator(props => props[props.modelPropKey] == null),
    mapProps(({ idPropKey, modelPropKey, modelName, ...props }) => props),
  );
}
