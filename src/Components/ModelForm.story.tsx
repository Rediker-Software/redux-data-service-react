// tslint:disable max-classes-per-file
import * as React from "react";
import {
  attr,
  BooleanField,
  DataService,
  IFakeModelData,
  IModel,
  initializeTestServices,
  Model as RDSModel,
  seedService,
  StringField
} from "redux-data-service";

import { Model } from "../Model";
import { lorem, random } from "faker";

import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import { ModelForm } from "./ModelForm";
import { ModelField } from "./ModelField";

interface IModelFormFakeModelData extends IFakeModelData {
  checkbox: boolean;
}

interface IModelFormFakeModel extends IModel<IModelFormFakeModelData>, IModelFormFakeModelData {
}

class ModelFormFakeModel extends RDSModel<IModelFormFakeModelData> implements IModelFormFakeModel {
  public serviceName = "modelFormFakeModel";

  @attr(StringField)
  public fullText: string;

  @attr(BooleanField)
  public checkbox: boolean;
}

class ModelFormFakeModelService extends DataService<IModelFormFakeModelData> {
  public readonly name = "modelFormFakeModel";
  public readonly ModelClass = ModelFormFakeModel;
}

function createMockModelFormFakeModel(id?: string): IModelFormFakeModelData {
  return new ModelFormFakeModel({
    id: random.number().toString(),
    fullText: lorem.word(),
    checkbox: false
  });
}

let fakeModel;
let Input;
let FormCheckbox;

Input = <input />;
FormCheckbox = <input type="checkbox" />

storiesOf("ModelForm", module)
  .addDecorator(story => {
    initializeTestServices({
      modelFormFakeModel: {
        ModelFormFakeModel,
        ModelFormFakeModelService,
        createMockModelFormFakeModel
      }
    });

    fakeModel = seedService("modelFormFakeModel");

    return story();
  })
  .add("Default", () => (
    <Model modelName="modelFormFakeModel" id={fakeModel.id}>
      {({ model }) => (
        <ModelForm
          model={model}
          onSave={action("model saved!")}
        >
          <ModelField
            name="fullText"
            label="FirstName"
            component={Input}
          />
        </ModelForm>
      )}
    </Model>
  ))
  .add("With checkbox", () => (
      <Model modelName="modelFormFakeModel" id={fakeModel.id}>
        {({ model }) => (
          <div style={{ padding: "20px" }}>
            <ModelForm model={model}>
              <ModelField
                name="id"
                component={Input}
                label="ID"
              />
              <ModelField
                name="checkbox"
                component={FormCheckbox}
                checkboxLabel="Checkbox"
              />
            </ModelForm>
          </div>
        )}
      </Model>
  ))
  .add("Disabled - default", () => (
    <Model modelName="modelFormFakeModel" id={fakeModel.id}>
      {({ model }) => (
        <ModelForm model={model} readOnly>
          <ModelField
            name="fullText"
            label="First Name"
          />
        </ModelForm>
      )}
    </Model>
  ))
  .add("Disabled - optional", () => {

    const Component = ({ value }) => (
      <span>
        <div>
          {value}
        </div>
      </span>
    );

    return (
      <Model modelName="modelFormFakeModel" id={fakeModel.id}>
        {({ model }) => (
          <ModelForm model={model} readOnly>
            <ModelField
              name="fullText"
              label="First Name"
              readOnlyComponent={Component}
            />
          </ModelForm>
        )}
      </Model>
    );
  });
