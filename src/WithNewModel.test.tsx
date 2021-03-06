// tslint:disable no-unused-expression

import * as React from "react";
import { fakeModelModule, getDataService, initializeTestServices, seedService } from "redux-data-service";

import { mount } from "enzyme";
import { stub } from "sinon";

import "./TestUtils/TestSetup";
import { usingMount } from "./TestUtils";

import { withNewModel } from "./WithNewModel";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("withNewModel", () => {
  let store;

  beforeEach(() => {
    store = initializeTestServices(fakeModelModule);
  });

  it("creates a new model if one was not provided", () => {
    let model;

    const Component = withNewModel({ modelName: "fakeModel" })(props => {
      model = props.model;
      return <span/>;
    });

    usingMount(<Component/>, () => {
      expect(model).to.have.property("isNew").to.be.true;
    }, { context: { store } });
  });

  it("does not create a new model if one was provided", () => {
    const fakeModel = seedService("fakeModel");
    let model;

    const Component = withNewModel({ modelName: "fakeModel" })(props => {
      model = props.model;
      return <span/>;
    });

    usingMount(<Component model={fakeModel}/>, () => {
      expect(model).to.have.property("id").to.equal(fakeModel.id);
    }, { context: { store } });
  });

  it("does not create a new model if an id was provided", () => {
    const fakeModel = seedService("fakeModel");
    let modelId;

    const Component = withNewModel({ modelName: "fakeModel" })(props => {
      modelId = props.id;
      return <span/>;
    });

    usingMount(<Component id={fakeModel.id}/>, () => {
      expect(modelId).to.equal(fakeModel.id);
    }, { context: { store } });
  });

  it("removes the new model from the store if it is still new when the component unmounts", () => {
    const fakeModelService = getDataService("fakeModel");
    const fakeModel = fakeModelService.createNew();
    const unloadStub = stub(fakeModel, "unload");

    const Component = withNewModel({ modelName: "fakeModel" })(() => <span/>);

    const wrapper = mount(<Component model={fakeModel}/>, { context: { store } });
    wrapper.unmount();

    expect(unloadStub.calledOnce).to.be.true;
  });

  it("does not remove the new model from the store if it is not new when the component unmounts", () => {
    const fakeModel = seedService("fakeModel");
    const unloadStub = stub(fakeModel, "unload");

    const Component = withNewModel({ modelName: "fakeModel" })(() => <span/>);

    const wrapper = mount(<Component model={fakeModel}/>, { context: { store } });
    wrapper.unmount();

    expect(unloadStub.called).to.be.false;
  });
});
