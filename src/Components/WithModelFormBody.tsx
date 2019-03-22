import * as React from "react";
import * as PropTypes from "prop-types";

import { compose, setDisplayName, withContext } from "recompose";
import { IModel } from "redux-data-service";

export interface IModelFormBodyProps<T extends IModel<any>> {
  model: T;
  readOnly?: boolean;
}

/**
 * An HOC to wrap the inputs of the body of a ModelForm.
 * The given `model` and `readOnly` props will be passed along as child context, where they will be used by the `ModelField`.
 */
export function withModelFormBody<T extends IModel<any>, P = {}>() {
  return compose<IModelFormBodyProps<T>, IModelFormBodyProps<T> & P>(
    setDisplayName("ModelFormBody"),
    withContext(
      {
        model: PropTypes.object,
        readOnly: PropTypes.bool
      },
      ({ model, readOnly }) => ({ model, readOnly }),
    ),
  );
}
