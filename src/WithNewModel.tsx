import { compose, lifecycle, ComponentEnhancer, defaultProps } from "recompose";
import { IModel, getDataService } from "redux-data-service";

import { withModel, IWithModelProps } from "./WithModel";

/**
 * An HOC which returns a new unsaved model if one is not provided.
 */
export function withNewModel<P = any>(options?: IWithModelProps): ComponentEnhancer<P, P> {
  return compose<P, P>(
    defaultProps({
      idPropKey: "id",
      modelPropKey: "model",
      ...options,
    }),
    lifecycle<P & IWithModelProps, {}>({
      componentDidMount() {
        const { idPropKey, modelPropKey, modelName } = this.props;

        if (!this.props[idPropKey] && !this.props[modelPropKey]) {
          const model = getDataService(modelName).createNew();
          this.setState({ [idPropKey]: model.id });
        }
      },
      componentWillUnmount() {
        const { modelPropKey } = this.props;

        const model = this.props[modelPropKey] as IModel<any>;
        if (model && model.isNew) {
          model.unload();
        }
      },
    }),
    withModel(options),
  );
}
