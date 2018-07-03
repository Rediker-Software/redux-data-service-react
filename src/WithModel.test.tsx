// tslint:disable:max-classes-per-file no-unused-expression

import * as React from "react";
import { fakeModelModule, getDataService, initializeTestServices, seedService } from "redux-data-service";

import { Subject } from "rxjs/Subject";
import { spy, stub } from "sinon";

import { FakeComponent, usingMount } from "./TestUtils";
import { withModel } from "./WithModel";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

const exampleServiceName = "fakeModel";

describe("withModel", () => {
  let fakeModel;
  let fakeModelId;
  let fakeService;
  let Component;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);

    fakeService = getDataService(exampleServiceName);
    fakeModel = seedService(exampleServiceName);
    fakeModelId = fakeModel.id;

    Component = withModel(exampleServiceName)(FakeComponent);
  });

  describe("base functionality", () => {
    it("renders the component", () => {
      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).exists()).to.be.true;
      });
    });

    it("returns a component with the correct model", () => {
      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModel }, "the enhanced component is given the model");
      });
    });

    it("receives the modelId as a fall through prop", () => {
      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModelId }, "the enhanced component is given the model id");
      });
    });

    it("allows any other props through", () => {
      const additionalProps = { favoriteAnimal: "Alpaca" };

      usingMount(<Component {...additionalProps} fakeModelId={fakeModelId}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.equal({ fakeModel, fakeModelId, ...additionalProps });
      });
    });
  });

  describe("optional fields", () => {
    it("accepts a idPropKey and looks for the id in the prop with that name", () => {
      const altIdPropField = "randomIdPropField";
      Component = withModel(exampleServiceName, altIdPropField)(FakeComponent);

      usingMount(<Component {...{ [altIdPropField]: fakeModelId }} />, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.include({ fakeModel, [altIdPropField]: fakeModelId });
      });
    });

    it("accepts a modelPropKey and enhances the component with the model under that prop name", () => {
      const altModelPropField = "randomModelPropField";
      Component = withModel(exampleServiceName, "fakeModelId", altModelPropField)(FakeComponent);

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
      usingMount(<Component fakeModelId={fakeModelId}/>, () => {
        expect(stubGetById.calledOnce).to.be.true;
      });
    });

    it("subscribes to the observable when the component mounts", () => {
      const stubSubscribe = stub(fakeModelObservable, "subscribe").callThrough();

      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        expect(stubSubscribe.calledOnce).to.be.true;
      });
    });

    it("unsubscribes from the observable when the component unmounts", () => {
      const stubUnsubscribe = spy();
      const stubSubscribe = stub(fakeModelObservable, "subscribe")
        .returns({ unsubscribe: stubUnsubscribe });

      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        wrapper.unmount();
        expect(stubUnsubscribe.calledOnce).to.be.true;
      });
    });

    it("adds the model to the component", () => {
      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        fakeModelObservable.next(fakeModel);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModel });
      });
    });

    it("updates the component when the observable updates", () => {
      usingMount(<Component fakeModelId={fakeModelId}/>, (wrapper) => {
        fakeModelObservable.next(fakeModel);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModel });
        const newerFakeModel = seedService(exampleServiceName);
        fakeModelObservable.next(newerFakeModel);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModel: newerFakeModel });
      });
    });
  });
});
