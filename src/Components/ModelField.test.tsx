// tslint:disable no-unused-expression

import * as React from "react";
import * as PropTypes from "prop-types";

import { IFakeModel, getDataService, initializeTestServices, seedService } from "redux-data-service";
import { compose, getContext, mapProps } from "recompose";

import { Card } from "@material-ui/core";

import { spy, stub } from "sinon";
import { lorem } from "faker";
import "TestUtils/TestSetup";

import {
  usingMount,
  simulateBlurEvent,
  simulateFocusEvent,
  simulateFormInput,
} from "TestUtils";

import modules from "Modules";
import { ModelForm } from "./ModelForm";
import { ModelField } from "./ModelField";
import { Input } from "./Input";
import { Typography } from "../Layout";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("<ModelField />", () => {

  beforeEach(() => {
    initializeTestServices(modules);
  });

  describe("sets the default value", () => {

    it("sets the default value on the model when the component mounts if the field is empty", () => {
      const model = seedService<IFakeModel>("fakeModel", { fullText: "" });
      const fakeModelService = getDataService("fakeModel");
      const setFieldStub = stub(fakeModelService.actions, "setField").returns({ invoke: spy() });

      const defaultValue = lorem.word();

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            defaultValue={defaultValue}
            component={Input}
          />
        </ModelForm>, () => {
          expect(setFieldStub.firstCall.args[0]).to.deep.equal({
            id: model.id,
            fieldName: "fullText",
            value: defaultValue,
          });
        }, { context: { model } },
      );
    });

    it("does not set the default value on the model when the component mounts if the field is not empty", () => {
      const model = seedService<IFakeModel>("fakeModel");
      const fakeModelService = getDataService("fakeModel");
      const setFieldStub = stub(fakeModelService.actions, "setField");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            value={lorem.word()}
            component={Input}
          />
        </ModelForm>, () => {
          expect(setFieldStub.callCount).to.equal(0);
        }, { context: { model } },
      );
    });

  });

  describe("handles the read only state", () => {
    it("renders a ReadOnlyTextField by default when in read only mode", () => {
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model} readOnly>
          <ModelField
            name="fullText"
            component={Input}
          />
        </ModelForm>, (wrapper) => {
          expect(wrapper.find("ReadOnlyTextField").exists()).to.be.true;
        }, { context: { model }}
      );
    });

    it("renders a ReadOnlyEmptyField by default when in read only mode and value is null", () => {
      const model = seedService<IFakeModel>("fakeModel", { fullText: null });

      usingMount(
        <ModelForm model={model} readOnly>
          <ModelField
            name="fullText"
            component={Input}
          />
        </ModelForm>, (wrapper) => {
          expect(wrapper.find("ReadOnlyEmptyField").exists()).to.be.true;
        }, { context: { model }}
      );
    });

    it("renders a ReadOnlyEmptyField by default when in read only mode and value length is 0", () => {
      const model = seedService<IFakeModel>("fakeModel", { fullText: "" });

      usingMount(
        <ModelForm model={model} readOnly>
          <ModelField
            name="fullText"
            component={Input}
          />
        </ModelForm>, (wrapper) => {
          expect(wrapper.find("ReadOnlyEmptyField").exists()).to.be.true;
        }, { context: { model }}
      );
    });

    it("renders the passed readOnlyComponent when in read only mode", () => {
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model} readOnly>
          <ModelField
            name="fullText"
            component={Input}
            readOnlyComponent={Card}
          />
        </ModelForm>, (wrapper) => {
          expect(wrapper.find(Card).exists()).to.be.true;
        }, { context: { model }}
      );
    });

    it("does not render readOnlyComponent when not in read only mode", () => {
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            component={Input}
          />
        </ModelForm>, (wrapper) => {
          expect(wrapper.find(Typography).exists()).to.be.false;
        }, { context: { model }}
      );
    });
  });

  describe("handles onChange event", () => {

    it("sets the value on the model when the input component triggers an onChange event", () => {
      const expectedValue = lorem.word();
      const model = seedService<IFakeModel>("fakeModel");
      const fakeModelService = getDataService("fakeModel");
      const setFieldStub = stub(fakeModelService.actions, "setField").returns({ invoke: spy() });

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
          />
        </ModelForm>, (wrapper) => {
          simulateFormInput(wrapper, { fullText: expectedValue });
          expect(setFieldStub.firstCall.args[0]).to.deep.equal({
            id: model.id,
            fieldName: "fullText",
            value: expectedValue,
          });
        }, { context: { model } },
      );
    });

    it("triggers an optional onChange callback when the input component triggers an onChange event", () => {
      const onChangeSpy = spy();
      const expectedValue = lorem.word();
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
            onChange={onChangeSpy}
          />
        </ModelForm>, (wrapper) => {
          simulateFormInput(wrapper, { fullText: expectedValue });

          expect(onChangeSpy.firstCall.args[0]).to.deep.contain({
            target: {
              value: expectedValue,
            },
          });
        }, { context: { model } },
      );
    });

    it("does not trigger an optional onChange callback when no onChange event occurs", () => {
      const onChangeSpy = spy();
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
            onChange={onChangeSpy}
          />
        </ModelForm>, () => {
          expect(onChangeSpy.callCount).to.equal(0);
        }, { context: { model } },
      );
    });
  });

  describe("handles onBlur event", () => {

    it("validates the field on the model when the input component triggers an onBlur event", () => {
      const model = seedService<IFakeModel>("fakeModel");
      const validateFieldStub = stub(model, "validateField");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
          />
        </ModelForm>, (wrapper) => {
          simulateBlurEvent(wrapper, "fullText");

          expect(validateFieldStub.firstCall.args[0]).to.equal("fullText");
        }, { context: { model } },
      );
    });

    it("triggers an optional onBlur callback when the input component triggers an onBlur event", () => {
      const onBlurSpy = spy();
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
            onBlur={onBlurSpy}
          />
        </ModelForm>, (wrapper) => {
          simulateBlurEvent(wrapper, "fullText");

          expect(onBlurSpy.calledOnce).to.be.true;
        }, { context: { model } },
      );
    });

    it("does not trigger an optional onBlur callback when no onBlur event occurs", () => {
      const onBlurSpy = spy();
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
            onBlur={onBlurSpy}
          />
        </ModelForm>, () => {
          expect(onBlurSpy.callCount).to.equal(0);
        }, { context: { model } },
      );
    });
  });

  describe("handles onFocus event", () => {

    it("triggers an optional onFocus callback when the input component triggers an onFocus event", () => {
      const onFocusSpy = spy();
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
            onFocus={onFocusSpy}
          />
        </ModelForm>, (wrapper) => {
          simulateFocusEvent(wrapper, "fullText");

          expect(onFocusSpy.calledOnce).to.be.true;
        }, { context: { model } },
      );
    });

    it("does not trigger an optional onFocus callback when no onFocus event occurs", () => {
      initializeTestServices(modules);

      const onFocusSpy = spy();
      const model = seedService<IFakeModel>("fakeModel");

      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
            onFocus={onFocusSpy}
          />
        </ModelForm>, () => {
          expect(onFocusSpy.callCount).to.equal(0);
        }, { context: { model } },
      );
    });
  });

  describe("onFieldError", () => {

    it("passes onFieldError callback over child context", () => {
      const model = seedService("fakeModel");
      let onFieldError;

      const Component = compose<any, any>(
        getContext({ field: PropTypes.object }),
      )(({ field }) => {
        onFieldError = field.onFieldError;
        return <span />;
      });

      usingMount(
        <ModelForm model={model}>
          <ModelField name={lorem.word()} component={Component} />
        </ModelForm>,
        () => {
          expect(onFieldError).to.be.a("function");
        }
      );
    });

    it("calling onFieldError sets errorMessage", () => {
      const model = seedService("fakeModel");
      const expectedValue = lorem.words();

      const Component = compose<any, any>(
        getContext({ field: PropTypes.object }),
      )(({ field }) => {
        field.onFieldError(expectedValue);
        return <span/>;
      });

      usingMount(
        <ModelForm model={model}>
          <ModelField name={lorem.word()} component={Component} />
        </ModelForm>,
        (wrapper) => {
          wrapper.update();
          expect(
            wrapper.find("FormHelperText").first().text()
          ).to.equal(expectedValue);
        }
      );
    });

  });

  describe("sets color prop based on onFocus and onBlur events", () => {
    let model;

    beforeEach(() => {
      model = seedService<IFakeModel>("fakeModel");
    });

    it("sets color to undefined prior to triggering an onFocus event", () => {
      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
          />
        </ModelForm>, wrapper => {
          expect(wrapper.find("Field").prop("color")).to.be.an("undefined");
        }, { context: { model } }
      );
    });

    it("sets the color to be a string when the input component triggers an onFocus event", () => {
      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
          />
        </ModelForm>, wrapper => {
          simulateFocusEvent(wrapper, "fullText");

          expect(wrapper.find("Field").prop("color")).to.be.a("string");
        }, { context: { model } }
      );
    });

    it("sets color to undefined when the input component triggers an onFocus event, does not change the input value, then triggers an onBlur event", () => {
      usingMount(
        <ModelForm model={model}>
          <ModelField
            name="fullText"
            label="First Name *"
            component={Input}
          />
        </ModelForm>, wrapper => {
          simulateFocusEvent(wrapper, "fullText");
          simulateBlurEvent(wrapper, "fullText");

          expect(wrapper.find("Field").prop("color")).to.be.an("undefined");
        }, { context: { model } }
      );
    });
  });

});
