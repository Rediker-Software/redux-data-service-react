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
var TestUtils_1 = require("./TestUtils");
var WithModelArray_1 = require("./WithModelArray");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach;
var expect = intern.getPlugin("chai").expect;
describe("withModelArray", function () {
    var fakeModels;
    var fakeModelIds;
    var fakeService;
    var Component;
    beforeEach(function () {
        redux_data_service_1.initializeTestServices(redux_data_service_1.fakeModelModule);
        fakeService = redux_data_service_1.getDataService("fakeModel");
        fakeModels = redux_data_service_1.seedServiceList("fakeModel");
        fakeModelIds = fakeModels.map(function (fakeModel) { return fakeModel.id; });
        Component = WithModelArray_1.withModelArray("fakeModel")(TestUtils_1.FakeComponent);
    });
    describe("base functionality", function () {
        it("renders the component", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.true;
            });
        });
        it("returns a component with the correct list of models", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("fakeModels")).to.have.members(fakeModels, "the enhanced component is given the models");
            });
        });
        it("receives the modelId as a fall through prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop("fakeModelIds")).to.have.members(fakeModelIds, "the enhanced component is given the model ids");
            });
        });
        it("allows any other props through", function () {
            var additionalProps = { favoriteAnimal: "Alpaca" };
            TestUtils_1.usingMount(React.createElement(Component, __assign({}, additionalProps, { fakeModelIds: fakeModelIds })), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include(additionalProps);
            });
        });
    });
    describe("optional fields", function () {
        it("accepts a idPropKey and looks for the ids in the prop with that name", function () {
            var _a;
            var altIdPropField = "randomIdPropField";
            Component = WithModelArray_1.withModelArray("fakeModel", altIdPropField)(TestUtils_1.FakeComponent);
            TestUtils_1.usingMount(React.createElement(Component, __assign({}, (_a = {}, _a[altIdPropField] = fakeModelIds, _a))), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop(altIdPropField)).to.have.members(fakeModelIds);
            });
        });
        it("accepts a modelPropKey and enhances the component with the model under that prop name", function () {
            var altModelPropField = "randomModelPropField";
            Component = WithModelArray_1.withModelArray("fakeModel", "fakeModelIds", altModelPropField)(TestUtils_1.FakeComponent);
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).prop(altModelPropField)).to.have.members(fakeModels);
            });
        });
    });
    describe("live observable", function () {
        var stubGetById;
        var fakeModelObservable;
        beforeEach(function () {
            fakeModelObservable = new Subject_1.Subject();
            stubGetById = sinon_1.stub(fakeService, "getByIds").returns(fakeModelObservable);
        });
        it("calls the getByIds function", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function () {
                expect(stubGetById.calledOnce).to.be.true;
            });
        });
        it("subscribes to the observable when the component mounts", function () {
            var stubSubscribe = sinon_1.stub(fakeModelObservable, "subscribe").callThrough();
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function () {
                expect(stubSubscribe.calledOnce).to.be.true;
            });
        });
        it("unsubscribes from the observable when the component unmounts", function () {
            var stubUnsubscribe = sinon_1.spy();
            sinon_1.stub(fakeModelObservable, "subscribe")
                .returns({ unsubscribe: stubUnsubscribe });
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                wrapper.unmount();
                expect(stubUnsubscribe.calledOnce).to.be.true;
            });
        });
        it("adds the models to the component", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                fakeModelObservable.next(fakeModels);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModels: fakeModels });
            });
        });
        it("updates the component when the observable updates", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelIds: fakeModelIds }), function (wrapper) {
                fakeModelObservable.next(fakeModels);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModels: fakeModels });
                var newerFakeModels = redux_data_service_1.seedServiceList("fakeModel");
                fakeModelObservable.next(newerFakeModels);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModels: newerFakeModels });
            });
        });
    });
});
