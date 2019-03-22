import * as React from "react";
import { compose, defaultProps, setDisplayName, withHandlers } from "recompose";
import { IModel } from "redux-data-service";

import { omitProps } from "../Helpers";
import { withLoadingIndicator } from "../WithLoadingIndicator";
import { withModelFormBody } from "./WithModelFormBody";

export interface IModelFormProps {
  model: IModel<any>;
  onSave?: (model: IModel<any>) => void;
  onError?: (errors: any) => void;
  onCancel?: () => void;
  readOnly?: boolean;
}

interface IModelFormInternalProps extends React.FormHTMLAttributes<any> {
  formComponent: React.ComponentType<React.FormHTMLAttributes<any> & any>;
}

const Form = ({ children, ...props }: React.FormHTMLAttributes<any>) => (
  <form
    noValidate
    {...props}
  >
    {children}
  </form>
);

/**
 * Creates a form whose values are lifted from and modify the given model.
 * When the form is saved, the model is saved.
 * The form supports read only mode which is passed to it's children via context.
 *
 * @returns {React.ComponentClass<IModelFormProps>}
 */
export const ModelForm = compose<IModelFormInternalProps, IModelFormProps>(
  setDisplayName("ModelForm"),
  defaultProps({
    formComponent: Form,
    readOnly: false
  }),
  withHandlers<IModelFormProps, { onSubmit }>({
    onSubmit: (props) => (e) => {
      e.preventDefault();

      const {
        model,
        onSave,
        onError
      } = props;

      model
        .save()
        .then(onSave, onError);
    },
    onReset: (props) => (e) => {
      e.preventDefault();

      const { model, onCancel } = props;
      model.reset();

      if (onCancel) {
        onCancel();
      }
    },
  }),
  withLoadingIndicator({ isLoading: ({ model }) => model == null }),
  withModelFormBody(),
  omitProps([ "model", "onCancel", "onError", "onSave" ])
)(({ formComponent: FormComponent, ...props }) => <FormComponent {...props} />);
