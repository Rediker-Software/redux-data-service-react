import { compose, lifecycle } from "recompose";

import { getDataService } from "redux-data-service/src/index";
import { IModel } from "../IModel";
import { withModel } from "./WithModel";

/**
 * An HOC which returns a new unsaved model if one is not provided.
 *
 * @param {string} dataServiceName name of service to retrieve from service provider
 * @param {string} idPropKey property name to find the id for the model on
 * @param {string} modelPropKey name of model prop name to enhance component with
 * @returns {"recompose".ComponentEnhancer<P, P>}
 */
export function withNewModel<P = any>(
  dataServiceName: string,
  idPropKey: string = dataServiceName + "Id",
  modelPropKey: string = dataServiceName,
) {
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
