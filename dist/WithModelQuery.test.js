"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var redux_data_service_1 = require("redux-data-service");
var Subject_1 = require("rxjs/Subject");
var sinon_1 = require("sinon");
var faker_1 = require("faker");
var TestUtils_1 = require("./TestUtils");
var WithModelQuery_1 = require("./WithModelQuery");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach;
var expect = intern.getPlugin("chai").expect;
describe("withModelQuery", function () {
    var items;
    var query;
    var Component;
    beforeEach(function () {
        redux_data_service_1.initializeTestServices(redux_data_service_1.fakeModelModule);
        query = { fullText: faker_1.lorem.word() };
        items = redux_data_service_1.seedServiceList("fakeModel", 5, query);
        Component = WithModelQuery_1.withModelQuery({ modelName: "fakeModel" })(TestUtils_1.FakeComponent);
    });
    describe("base functionality", function () {
        it("renders the component", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.true;
            });
        });
        it("returns a component with the correct list of models", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("items")).to.have.members(items, "the enhanced component is given the models");
            });
        });
        it("does not receive the query as a fall through prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("query")).to.be.undefined;
            });
        });
        it("does not receive the modelName as a fall through prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("modelName")).to.be.undefined;
            });
        });
        it("receives the items, if given, as a fall through prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { items: items }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("items")).to.equal(items, "the enhanced component is given the models");
            });
        });
        it("allows any other props through", function () {
            var additionalProps = { favoriteAnimal: "Alpaca" };
            TestUtils_1.usingMount(React.createElement(Component, __assign({}, additionalProps, { query: query })), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include(additionalProps);
            });
        });
        it("allows modelName to be specified as a prop", function () {
            Component = WithModelQuery_1.withModelQuery()(TestUtils_1.FakeComponent);
            TestUtils_1.usingMount(React.createElement(Component, { modelName: "fakeModel", query: query }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("items")).to.have.members(items);
            });
        });
    });
    describe("default query", function () {
        var fakeService;
        var stubGetDefaultQueryParams;
        var stubGetByQuery;
        beforeEach(function () {
            fakeService = redux_data_service_1.getDataService("fakeModel");
            stubGetDefaultQueryParams = sinon_1.stub(fakeService, "getDefaultQueryParams").returns(query);
            stubGetByQuery = sinon_1.stub(fakeService, "getByQuery").callThrough();
        });
        it("gets the default query params from the service", function () {
            TestUtils_1.usingMount(React.createElement(Component, null), function () {
                expect(stubGetDefaultQueryParams.callCount).to.equal(1);
            });
        });
        it("uses the service's default query params by default", function () {
            TestUtils_1.usingMount(React.createElement(Component, null), function () {
                expect(stubGetByQuery.firstCall.args[0]).to.deep.equal(query);
            });
        });
        it("optionally overrides the default query params", function () {
            var otherFakeQuery = { fullText: faker_1.lorem.word() };
            TestUtils_1.usingMount(React.createElement(Component, { query: otherFakeQuery }), function () {
                expect(stubGetByQuery.firstCall.args[0]).to.deep.equal(otherFakeQuery);
            });
        });
        it("merges incoming query params with default query params", function () {
            var otherFakeQuery = { lastName: faker_1.lorem.word() };
            TestUtils_1.usingMount(React.createElement(Component, { query: otherFakeQuery }), function () {
                expect(stubGetByQuery.firstCall.args[0]).to.deep.equal({
                    lastName: otherFakeQuery.lastName,
                    fullText: query.fullText,
                });
            });
        });
        it("does not get default query params if items were provided as a prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { items: items }), function () {
                expect(stubGetDefaultQueryParams.callCount).to.equal(0);
            });
        });
    });
    describe("live observable", function () {
        var stubGetByQuery;
        var fakeModelObservable;
        beforeEach(function () {
            var fakeService = redux_data_service_1.getDataService("fakeModel");
            fakeModelObservable = new Subject_1.Subject();
            stubGetByQuery = sinon_1.stub(fakeService, "getByQuery").returns(fakeModelObservable);
        });
        it("calls the getByQuery function", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function () {
                expect(stubGetByQuery.callCount).to.equal(1);
            });
        });
        it("does not call the getByQuery function if items were provided as a prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { items: items }), function () {
                expect(stubGetByQuery.callCount).to.equal(0);
            });
        });
        it("subscribes to the observable when the component mounts", function () {
            var stubSubscribe = sinon_1.stub(fakeModelObservable, "subscribe").callThrough();
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function () {
                expect(stubSubscribe.callCount).to.equal(1);
            });
        });
        it("unsubscribes from the observable when the component unmounts", function () {
            var stubUnsubscribe = sinon_1.spy();
            sinon_1.stub(fakeModelObservable, "subscribe")
                .returns({ unsubscribe: stubUnsubscribe });
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                wrapper.unmount();
                expect(stubUnsubscribe.callCount).to.equal(1);
            });
        });
        it("adds the models to the component", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                fakeModelObservable.next(items);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ items: items });
            });
        });
        it("updates the component when the observable updates", function () {
            TestUtils_1.usingMount(React.createElement(Component, { query: query }), function (wrapper) {
                fakeModelObservable.next(items);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ items: items });
                var newerFakeModels = redux_data_service_1.seedServiceList("fakeModel");
                fakeModelObservable.next(newerFakeModels);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ items: newerFakeModels });
            });
        });
    });
});
