// tslint:disable no-unused-expression
import * as React from "react";
import { fakeModelModule, initializeTestServices, seedService } from "redux-data-service";

import { spy, stub } from "sinon";

import "../TestUtils/TestSetup";
import { usingMount } from "../TestUtils";

import { DefaultLoadingComponent } from "../DefaultLoadingComponent";
import { ModelForm } from "./ModelForm";

declare var intern;
const { beforeEach, describe, it } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<ModelForm />", () => {
  let model;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);
    model = seedService("fakeModel");
  });

  it("renders a <ModelForm />", () => {
    usingMount((
        <ModelForm model={model}/>
    ), (wrapper) => {
      expect(wrapper.find("ModelForm").exists()).to.be.true;
    });
  });

  it("Saves the model when the form is submitted", () => {
    const saveSpy = spy(model, "save");

    usingMount((
      <ModelForm model={model}/>
    ), (wrapper) => {
      wrapper.find("form").simulate("submit");
      expect(saveSpy.calledOnce).to.be.true;
    });
  });

  it("Triggers optional onSave callback after the model saves successfully", () => {
    stub(model, "save").returns({ then: stub().callsArg(0).returns({ then: stub() }) });
    const onSaveSpy = spy();

    usingMount((
      <ModelForm model={model} onSave={onSaveSpy}/>
    ), (wrapper) => {
      wrapper.find("form").simulate("submit");
      expect(onSaveSpy.calledOnce).to.be.true;
    });
  });

  it("Triggers optional onError callback after the model rejects", () => {
    stub(model, "save").returns({ then: stub().callsArg(1).returns({ then: stub()}) });
    const onErrorSpy = spy();

    usingMount((
      <ModelForm model={model} onError={onErrorSpy}/>
    ), (wrapper) => {
      wrapper.find("form").simulate("submit");
      expect(onErrorSpy.calledOnce).to.be.true;
    });
  });

  it("Resets the model when the form is reset", () => {
    const resetStub = stub(model, "reset");

    usingMount((
      <ModelForm model={model}/>
    ), (wrapper) => {
      wrapper.find("form").simulate("reset");
      expect(resetStub.calledOnce).to.be.true;
    });
  });

  it("Triggers optional onCancel callback when the form is reset", () => {
    const onCancel = spy();

    usingMount((
      <ModelForm model={model} onCancel={onCancel}/>
    ), (wrapper) => {
      wrapper.find("form").simulate("reset");
      expect(onCancel.calledOnce).to.be.true;
    });
  });

  it("renders a loading component when the model is null", () => {
    usingMount((
      <ModelForm model={null}/>
    ), (wrapper) => {
      expect(wrapper.find(DefaultLoadingComponent).exists()).to.be.true;
    });
  });

});
