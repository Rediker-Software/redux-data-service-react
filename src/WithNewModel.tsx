import { compose, lifecycle, ComponentEnhancer } from "recompose";
import { IModel, getDataService } from "redux-data-service";

import { withModel } from "./WithModel";

/**
 * An HOC which returns a new unsaved model if one is not provided.
 *
 * @param {string} dataServiceName name of service to retrieve from service provider
 * @param {string} idPropKey property name to find the id for the model on
 * @param {string} modelPropKey name of model prop name to enhance component with
 */
export function withNewModel<P = any>(
  dataServiceName: string,
  idPropKey: string = dataServiceName + "Id",
  modelPropKey: string = dataServiceName,
): ComponentEnhancer<P, P> {
  return compose<P, P>(
    lifecycle<P, {}>({
      componentDidMount() {
        if (!this.props[idPropKey] && !this.props[modelPropKey]) {
          const model = getDataService(dataServiceName).createNew();
          this.setState({ [idPropKey]: model.id });
        }
      },
      componentWillUnmount() {
        const model = this.props[modelPropKey] as IModel<any>;
        if (model && model.isNew) {
          model.unload();
        }
      },
    }),
    withModel(dataServiceName, idPropKey, modelPropKey),
  );
}
