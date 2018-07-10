// tslint:disable:max-classes-per-file no-unused-expression

import * as React from "react";
import { fakeModelModule, getDataService, initializeTestServices, seedServiceList } from "redux-data-service";

import { of as of$ } from "rxjs/observable/of";
import { Subject } from "rxjs/Subject";
import { spy, stub } from "sinon";

import { FakeComponent, usingMount } from "./TestUtils";
import { withModelArray } from "./WithModelArray";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("withModelArray", () => {
  let fakeModels;
  let fakeModelIds;
  let fakeService;
  let Component;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);

    fakeService = getDataService("fakeModel");
    fakeModels = seedServiceList("fakeModel");
    fakeModelIds = fakeModels.map(fakeModel => fakeModel.id);

    Component = withModelArray("fakeModel")(FakeComponent);
  });

  describe("base functionality", () => {
    beforeEach(() => {
      stub(fakeService, "getByIds").returns(of$(fakeModels));
    });

    it("renders the component", () => {
      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).exists()).to.be.true;
      });
    });

    it("returns a component with the correct list of models", () => {
      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("fakeModels")).to.have.members(fakeModels, "the enhanced component is given the models");
      });
    });

    it("receives the modelId as a fall through prop", () => {
      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("fakeModelIds")).to.have.members(fakeModelIds, "the enhanced component is given the model ids");
      });
    });

    it("allows any other props through", () => {
      const additionalProps = { favoriteAnimal: "Alpaca" };

      usingMount(<Component {...additionalProps} fakeModelIds={fakeModelIds}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include(additionalProps);
      });
    });
  });

  describe("optional fields", () => {
    beforeEach(() => {
      stub(fakeService, "getByIds").returns(of$(fakeModels));
    });

    it("accepts a idPropKey and looks for the ids in the prop with that name", () => {
      const altIdPropField = "randomIdPropField";
      Component = withModelArray("fakeModel", altIdPropField)(FakeComponent);

      usingMount(<Component {...{ [altIdPropField]: fakeModelIds }} />, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop(altIdPropField)).to.have.members(fakeModelIds);
      });
    });

    it("accepts a modelPropKey and enhances the component with the model under that prop name", () => {
      const altModelPropField = "randomModelPropField";
      Component = withModelArray("fakeModel", "fakeModelIds", altModelPropField)(FakeComponent);

      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop(altModelPropField)).to.have.members(fakeModels);
      });
    });
  });

  describe("live observable", () => {
    let fakeModelObservable;
    let stubGetById;

    beforeEach(() => {
      fakeModelObservable = new Subject();
      stubGetById = stub(fakeService, "getByIds").returns(fakeModelObservable);
    });

    it("calls the getByIds function", () => {
      usingMount(<Component fakeModelIds={fakeModelIds}/>, () => {
        expect(stubGetById.calledOnce).to.be.true;
      });
    });

    it("subscribes to the observable when the component mounts", () => {
      const stubSubscribe = stub(fakeModelObservable, "subscribe").callThrough();

      usingMount(<Component fakeModelIds={fakeModelIds}/>, () => {
        expect(stubSubscribe.calledOnce).to.be.true;
      });
    });

    it("unsubscribes from the observable when the component unmounts", () => {
      const stubUnsubscribe = spy();
      stub(fakeModelObservable, "subscribe")
        .returns({ unsubscribe: stubUnsubscribe });

      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        wrapper.unmount();
        expect(stubUnsubscribe.calledOnce).to.be.true;
      });
    });

    it("adds the models to the component", () => {
      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        fakeModelObservable.next(fakeModels);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModels });
      });
    });

    it("updates the component when the observable updates", () => {
      usingMount(<Component fakeModelIds={fakeModelIds}/>, (wrapper) => {
        fakeModelObservable.next(fakeModels);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModels });
        const newerFakeModels = seedServiceList("fakeModel");
        fakeModelObservable.next(newerFakeModels);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ fakeModels: newerFakeModels });
      });
    });
  });
});
