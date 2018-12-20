// tslint:disable: no-unused-expression

import * as React from "react";

import {
  fakeModelModule,
  getDataService,
  initializeTestServices,
  seedService,
} from "redux-data-service";

import { Subject } from "rxjs/Subject";
import { spy, stub } from "sinon";

import "./TestUtils/TestSetup";
import { FakeComponent, usingMount } from "./TestUtils";
import { withModel } from "./WithModel";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

const modelName = "fakeModel";

describe("withModel", () => {
  let fakeModel;
  let fakeModelId;
  let fakeService;
  let Component;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);

    fakeService = getDataService(modelName);
    fakeModel = seedService(modelName);
    fakeModelId = fakeModel.id;

    Component = withModel({ modelName })(FakeComponent);
  });

  describe("base functionality", () => {
    it("renders the component", () => {
      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).exists()).to.be.true;
      });
    });

    it("returns a component with the correct model", () => {
      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ model: fakeModel }, "the enhanced component is given the model");
      });
    });

    it("receives the id as a fall through prop", () => {
      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ id: fakeModelId }, "the enhanced component is given the model id");
      });
    });

    it("allows any other props through", () => {
      const additionalProps = { favoriteAnimal: "Alpaca" };

      usingMount(<Component {...additionalProps} id={fakeModelId}/>, (wrapper) => {
        expect(
          wrapper.find(FakeComponent).props(),
        ).to.deep.equal({
          model: fakeModel,
          id: fakeModelId,
          ...additionalProps,
        });
      });
    });
  });

  describe("optional fields", () => {
    it("accepts an idPropKey and looks for the id in the prop with that name", () => {
      const altIdPropField = "randomIdPropField";

      Component = withModel({
        modelName,
        idPropKey: altIdPropField,
      })(FakeComponent);

      usingMount(<Component {...{ [altIdPropField]: fakeModelId }} />, (wrapper) => {
        expect(
          wrapper.find(FakeComponent).props(),
        ).to.include({
          model: fakeModel,
          [altIdPropField]: fakeModelId,
        });
      });
    });

    it("accepts a modelPropKey and enhances the component with the model under that prop name", () => {
      const altModelPropField = "randomModelPropField";

      Component = withModel({
        modelName,
        idPropKey: "fakeModelId",
        modelPropKey: altModelPropField,
      })(FakeComponent);

      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.include({ [altModelPropField]: fakeModel });
      });
    });
  });

  describe("live observable", () => {
    let stubGetById;
    let fakeModelObservable;

    beforeEach(() => {
      fakeModelObservable = new Subject();
      stubGetById = stub(fakeService, "getById").returns(fakeModelObservable);
    });

    it("calls the getById function", () => {
      usingMount(<Component id={fakeModelId}/>, () => {
        expect(stubGetById.calledOnce).to.be.true;
      });
    });

    it("subscribes to the observable when the component mounts", () => {
      const stubSubscribe = stub(fakeModelObservable, "subscribe").callThrough();

      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        expect(stubSubscribe.calledOnce).to.be.true;
      });
    });

    it("unsubscribes from the observable when the component unmounts", () => {
      const stubUnsubscribe = spy();

      stub(fakeModelObservable, "subscribe")
        .returns({ unsubscribe: stubUnsubscribe });

      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        wrapper.unmount();
        expect(stubUnsubscribe.calledOnce).to.be.true;
      });
    });

    it("adds the model to the component", () => {
      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        fakeModelObservable.next(fakeModel);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ model: fakeModel });
      });
    });

    it("updates the component when the observable updates", () => {
      usingMount(<Component id={fakeModelId}/>, (wrapper) => {
        fakeModelObservable.next(fakeModel);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ model: fakeModel });
        const newerFakeModel = seedService(modelName);
        fakeModelObservable.next(newerFakeModel);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ model: newerFakeModel });
      });
    });
  });

  describe("when the modelName is given as a prop", () => {

    beforeEach(() => {
      Component = withModel()(FakeComponent);
    });

    it("renders the component with a modelName given as a prop", () => {
      usingMount(<Component modelName={modelName} id={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).exists()).to.be.true;
      });
    });

    it("renders a component with the correct model for the given modelName", () => {
      usingMount(<Component modelName={modelName} id={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ model: fakeModel });
      });
    });

    it("does not allow IWithModelProps to fall-through as props to the wrapped component", () => {
      const additionalProps = { favoriteAnimal: "Alpaca" };

      usingMount(<Component modelName={modelName} {...additionalProps} id={fakeModelId}/>, (wrapper) => {
        expect(
          wrapper.find(FakeComponent).props(),
        ).to.not.include.keys([
          "idPropKey",
          "modelPropKey",
          "modelName",
        ]);
      });
    });
  });

});
