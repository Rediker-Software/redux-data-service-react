import * as React from "react";
import * as PropTypes from "prop-types";
import { IModel, Omit } from "redux-data-service";

import { get, isEmpty, set } from "lodash";
import { compose, defaultProps, getContext, mapProps, setDisplayName, withStateHandlers, withPropsOnChange, withContext } from "recompose";

import { omitProps } from "../Helpers";

export interface IFieldInputProps {
  name: string;
  onChange: <T>(event: React.ChangeEvent<T> | any) => void;
  onBlur?: <T>(event?: React.FocusEvent<T>) => void;
  onFocus?: <T>(event?: React.FocusEvent<T>) => void;
  onFieldError?: (error: string) => void;
  value?: any;
}

export interface IModelFieldProps<T = any> extends Omit<IFieldInputProps, "value"> {
  readOnlyFieldName?: string;
  validateField?: (model: IModel<any>, name: string) => void;
  defaultValue?: any;

  fieldComponent?: React.ComponentType<IFieldInputProps & any>;
  component?: React.ComponentType<IFieldInputProps & any>;
  componentProps?: ((props: IFieldInputProps & Partial<T>) => Partial<T>) | Partial<T>;

  readOnlyComponent?: React.ComponentType<IFieldInputProps & any>;
  readOnlyComponentProps?: ((props: IFieldInputProps & Partial<T>) => Partial<T>) | Partial<T>;

  [otherProp: string]: any;
}

export interface IFieldContext {
  field: {
    onFieldError: (errorMessage: string) => void;
  };
}

export const defaultValidateField = (model: IModel<any>, name: string) => model.validateField(name);

export const ModelField = compose<IModelFieldProps, IModelFieldProps>(
  setDisplayName("ModelField"),
  defaultProps({
    validateField: defaultValidateField,
  }),
  getContext({
    model: PropTypes.object,
    readOnly: PropTypes.bool
  }),
  withPropsOnChange(
    ["defaultValue", "model", "name", "readOnly"], ({ model, name, defaultValue, readOnly }) => {
      if (!readOnly && model != null && defaultValue != null && isEmpty(get(model, name))) {
        set(model, name, defaultValue);
      }
    }),
  withStateHandlers<{ active: boolean, internalErrorMessage: string }, { onChange, onFieldError, onBlur, onFocus }, IModelFieldProps>(
    { active: false, internalErrorMessage: undefined },
    {
      onChange: (state, { model, name, onChange, validateField }) => event => {

        const value = (typeof event === "object" && "target" in event)
          ? (event.target.value == null && event.target.checked) || event.target.value || null
          : event;

        set(model, name, value);

        if (onChange) {
          onChange(event);
        }

        validateField(model, name);

        return state;
      },
      onFieldError: () => (errorMessage) => ({
        internalErrorMessage: errorMessage,
      }),
      onBlur: (state, { onBlur, model, name, validateField }) => event => {
        if (onBlur) {
          onBlur(event);
        }

        validateField(model, name);

        return { active: false };
      },
      onFocus: (state, { onFocus }) => event => {
        if (onFocus) {
          onFocus(event);
        }

        return { active: true };
      },
    },
  ),
  withContext({ field: PropTypes.object }, ({ active, onFieldError, model, name, internalErrorMessage }) => {
    const fieldErrors = model.getFieldError(name);
    const errorMessage = !isEmpty(fieldErrors)
      ? fieldErrors
      : internalErrorMessage;

    const isFieldDirty = model.isFieldDirty(name);

    return {
      field: {
        active,
        errorMessage,
        isFieldDirty,
        onFieldError,
      }
    };
  }),
  withPropsOnChange(["model", "readOnlyFieldName", "name", "readOnly"], ({
    model,
    readOnlyFieldName,
    name,
    readOnly,
  }: IModelFieldProps) => ({
    value: readOnly && readOnlyFieldName
      ? get(model, readOnlyFieldName)
      : get(model, name)
  })),
  omitProps(["model", "active", "internalErrorMessage", "onFieldError", "defaultValue", "validateField", "readOnlyFieldName"])
)(({ fieldComponent: Field, ...props }) => <Field {...props} />);
