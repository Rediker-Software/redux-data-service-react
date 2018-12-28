// tslint:disable:max-classes-per-file no-unused-expression

import * as React from "react";
import {
  fakeModelModule,
  getDataService,
  initializeTestServices,
  IQueryParams,
  QueryBuilder,
  QueryManager,
  seedServiceList
} from "redux-data-service";

import { Subject } from "rxjs/Subject";
import { of as of$ } from "rxjs/observable/of";

import { spy, stub } from "sinon";
import { lorem } from "faker";

import "./TestUtils/TestSetup";
import { FakeComponent, usingMount } from "./TestUtils";
import { withModelQuery } from "./WithModelQuery";

declare var intern;
const { describe, it, beforeEach } = intern.getPlugin("interface.bdd");
const { expect } = intern.getPlugin("chai");

describe("withModelQuery", () => {
  let items;
  let query;
  let Component;

  beforeEach(() => {
    initializeTestServices(fakeModelModule);

    query = { fullText: lorem.word() };
    items = seedServiceList("fakeModel", 5, query);

    Component = withModelQuery<any>({ modelName: "fakeModel" })(FakeComponent);
  });

  describe("base functionality", () => {
    it("renders the component", () => {
      usingMount(<Component query={query}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).exists()).to.be.true;
      });
    });

    it("returns a component with the correct list of models", () => {
      usingMount(<Component query={query}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("items")).to.have.members(items, "the enhanced component is given the models");
      });
    });

    it("receives the query as a QueryManager", () => {
      usingMount(<Component query={query}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("query")).to.be.an.instanceof(QueryManager);
      });
    });

    it("does not receive the modelName as a fall through prop", () => {
      usingMount(<Component query={query}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("modelName")).to.be.undefined;
      });
    });

    it("receives the items, if given, as a fall through prop", () => {
      usingMount(<Component items={items}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("items")).to.equal(items, "the enhanced component is given the models");
      });
    });

    it("allows any other props through", () => {
      const additionalProps = { favoriteAnimal: "Alpaca" };

      usingMount(<Component {...additionalProps} query={query}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).props()).to.deep.include(additionalProps);
      });
    });

    it("allows modelName to be specified as a prop", () => {
      Component = withModelQuery<any>()(FakeComponent);
      usingMount(<Component modelName="fakeModel" query={query}/>, (wrapper) => {
        expect(wrapper.find(FakeComponent).prop("items")).to.have.members(items);
      });
    });
  });

  describe("default query", () => {
    let fakeService;
    let stubGetDefaultQueryParams;
    let stubGetByQuery;

    beforeEach(() => {
      fakeService = getDataService("fakeModel");
      stubGetDefaultQueryParams = stub(fakeService, "getDefaultQueryParams").returns(of$(query));
      stubGetByQuery = stub(fakeService, "getByQuery").returns(of$(new QueryManager(query)));
    });

    it("gets the default query params from the service", () => {
      usingMount(<Component/>, () => {
        expect(stubGetDefaultQueryParams.callCount).to.equal(1);
      });
    });

    it("uses the service's default query params by default", () => {
      usingMount(<Component/>, () => {
        expect(stubGetByQuery.firstCall.args[0].queryParams).to.deep.equal(query);
      });
    });

    it("optionally overrides the default query params", () => {
      const otherFakeQuery = { fullText: lorem.word() };
      usingMount(<Component query={otherFakeQuery} />, () => {
        expect(stubGetByQuery.firstCall.args[0].queryParams).to.deep.equal(otherFakeQuery);
      });
    });

    it("merges incoming query params with default query params", () => {
      const otherFakeQuery = { lastName: lorem.word() };
      usingMount(<Component query={otherFakeQuery} />, () => {
        expect(stubGetByQuery.firstCall.args[0].queryParams).to.deep.equal({
          lastName: otherFakeQuery.lastName,
          fullText: query.fullText,
        });
      });
    });

    it("uses expected query params given query as a QueryBuilder", () => {
      const queryBuilderParams = { firstName: lorem.word() };
      const queryBuilder = new QueryBuilder("fakeService", queryBuilderParams);
      usingMount(<Component query={queryBuilder} />, (wrapper) => {
        expect(stubGetByQuery.firstCall.args[0].queryParams).to.deep.include(queryBuilderParams);
      });
    });

    it("uses expected query params given query as QueryParams", () => {
      const queryParams = { firstName: lorem.word() } as IQueryParams;
      usingMount(<Component query={queryParams} />, (wrapper) => {
        expect(stubGetByQuery.firstCall.args[0].queryParams).to.deep.include(queryParams);
      });
    });

    it("does not get default query params if items were provided as a prop", () => {
      usingMount(<Component items={items} />, () => {
        expect(stubGetDefaultQueryParams.callCount).to.equal(0);
      });
    });

  });

  describe("live observable", () => {
    let stubGetByQuery;
    let fakeModelObservable;
    let otherQuery;
    let otherItems;

    beforeEach(() => {
      const fakeService = getDataService("fakeModel");
      otherQuery = { lastName: lorem.word() };
      otherItems = seedServiceList("fakeModel", 5, otherQuery);
      fakeModelObservable = new Subject();
      stubGetByQuery = stub(fakeService, "getByQuery").returns(fakeModelObservable);
    });

    it("calls the getByQuery function", () => {
      usingMount(<Component query={query}/>, () => {
        expect(stubGetByQuery.callCount).to.equal(1);
      });
    });

    it("does not call the getByQuery function if items were provided as a prop", () => {
      usingMount(<Component items={items}/>, () => {
        expect(stubGetByQuery.callCount).to.equal(0);
      });
    });

    it("subscribes to the observable when the component mounts", () => {
      const stubSubscribe = stub(fakeModelObservable, "subscribe").callThrough();

      usingMount(<Component query={query}/>, () => {
        expect(stubSubscribe.callCount).to.equal(1);
      });
    });

    it("unsubscribes from the observable when the component unmounts", () => {
      const stubUnsubscribe = spy();
      stub(fakeModelObservable, "subscribe")
        .returns({ unsubscribe: stubUnsubscribe });

      usingMount(<Component query={query}/>, (wrapper) => {
        wrapper.unmount();
        expect(stubUnsubscribe.callCount).to.equal(1);
      });
    });

    it("adds the models to the component", () => {
      usingMount(<Component query={query} />, (wrapper) => {
        const queryManager = new QueryManager(query, items);
        fakeModelObservable.next(queryManager);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ items });
      });
    });

    it("updates the component when the observable updates", () => {
      usingMount(<Component query={query} />, (wrapper) => {
        const queryManager = new QueryManager(query, items);
        fakeModelObservable.next(queryManager);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ items });

        const otherQueryManager = new QueryManager(otherQuery, otherItems);
        fakeModelObservable.next(otherQueryManager);
        wrapper.update();
        expect(wrapper.find(FakeComponent).props()).to.deep.include({ items: otherItems });
      });
    });
  });
});
