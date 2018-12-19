// tslint:disable:no-unused-expression

import * as React from "react";

import {
  fakeModelModule,
  initializeTestServices,
  seedService,
} from "redux-data-service";

import { spy, stub } from "sinon";
import { lorem, random } from "faker";

import "./TestUtils/TestSetup";
import { usingMount } from "./TestUtils";
import { Model } from "./Model";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

const modelName = "fakeModel";

describe("<Model />", () => {
  let item;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);
    item = seedService(modelName);
  });

  it("loads the model and passes it into the render props function", () => {
    let model;

    usingMount((
      <Model modelName={modelName} id={item.id}>
        {(props) => {
          model = props.model;
          return <span />;
        }}
      </Model>
    ), () => {
      expect(model).to.equal(item);
    });
  });

  it("renders the output of the render props function with the given model data", () => {
    usingMount((
      <Model modelName={modelName} id={item.id}>
        {({model}) => <span>{model.fullText}</span>}
      </Model>
    ), (wrapper) => {
      expect(
        wrapper
          .find("span")
          .text(),
      ).to.equal(item.fullText);
    });
  });
});
