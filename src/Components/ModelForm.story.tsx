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
  StringField } from "redux-data-service";
import { Model } from "redux-data-service-react";
import { lorem, random } from "faker";

import { Grid, Paper } from "@material-ui/core";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { withInfo } from "@storybook/addon-info";

import { Card, Typography } from "Common/Layout";
import { FormCheckbox } from "./FormCheckbox";
import { Input } from "./Input";
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
  .add("With checkbox", withInfo({ inline: true })(() => (
    <Model modelName="modelFormFakeModel" id={fakeModel.id}>
      {({ model }) => (
        <div style={{ padding: "20px" }}>
          <Paper>
            <ModelForm model={model}>
              <Grid container alignItems="center" spacing={8}>
                <Grid item>
                  <ModelField
                    name="id"
                    component={Input}
                    label="ID"
                  />
                </Grid>
                <Grid item>
                  <ModelField
                    name="checkbox"
                    component={FormCheckbox}
                    checkboxLabel="Checkbox"
                  />
                </Grid>
              </Grid>
            </ModelForm>
          </Paper>
        </div>
      )}
    </Model>
  )))
  .add("Disabled - default", withInfo({ inline: true })(() => (
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
  )))
  .add("Disabled - optional", withInfo({ inline: true })(() => {

    const Component = ({ value }) => (
      <Card>
        <Typography>
          {value}
        </Typography>
      </Card>
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
  }))
;
