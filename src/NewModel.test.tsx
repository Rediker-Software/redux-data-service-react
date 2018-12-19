// tslint:disable:no-unused-expression

import * as React from "react";

import {
  fakeModelModule,
  initializeTestServices,
  FakeModel,
} from "redux-data-service";

import { spy, stub } from "sinon";
import { lorem, random } from "faker";

import "./TestUtils/TestSetup";
import { usingMount } from "./TestUtils";
import { NewModel } from "./NewModel";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

const modelName = "fakeModel";

describe("<NewModel />", () => {

  beforeEach(() => {
    initializeTestServices(fakeModelModule);
  });

  it("creates a new model and passes it into the render props function", () => {
    let model;

    usingMount((
      <NewModel modelName={modelName}>
        {(props) => {
          model = props.model;
          return <span />;
        }}
      </NewModel>
    ), () => {
      expect(model).to.be.an.instanceOf(FakeModel);
    });
  });

  it("renders the output of the render props function with the given new model data", () => {
    usingMount((
      <NewModel modelName={modelName}>
        {({model}) => <span>{model.id}</span>}
      </NewModel>
    ), (wrapper) => {
      expect(
        wrapper
          .find("span")
          .text(),
      ).to.have.string("new-");
    });
  });
});
