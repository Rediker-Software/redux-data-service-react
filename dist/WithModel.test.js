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
var WithModel_1 = require("./WithModel");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach;
var expect = intern.getPlugin("chai").expect;
var exampleServiceName = "fakeModel";
describe("withModel", function () {
    var fakeModel;
    var fakeModelId;
    var fakeService;
    var Component;
    beforeEach(function () {
        redux_data_service_1.initializeTestServices(redux_data_service_1.fakeModelModule);
        fakeService = redux_data_service_1.getDataService(exampleServiceName);
        fakeModel = redux_data_service_1.seedService(exampleServiceName);
        fakeModelId = fakeModel.id;
        Component = WithModel_1.withModel(exampleServiceName)(TestUtils_1.FakeComponent);
    });
    describe("base functionality", function () {
        it("renders the component", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.true;
            });
        });
        it("returns a component with the correct model", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModel: fakeModel }, "the enhanced component is given the model");
            });
        });
        it("receives the modelId as a fall through prop", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModelId: fakeModelId }, "the enhanced component is given the model id");
            });
        });
        it("allows any other props through", function () {
            var additionalProps = { favoriteAnimal: "Alpaca" };
            TestUtils_1.usingMount(React.createElement(Component, __assign({}, additionalProps, { fakeModelId: fakeModelId })), function (wrapper) {
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.equal(__assign({ fakeModel: fakeModel, fakeModelId: fakeModelId }, additionalProps));
            });
        });
    });
    describe("optional fields", function () {
        it("accepts a idPropKey and looks for the id in the prop with that name", function () {
            var _a;
            var altIdPropField = "randomIdPropField";
            Component = WithModel_1.withModel(exampleServiceName, altIdPropField)(TestUtils_1.FakeComponent);
            TestUtils_1.usingMount(React.createElement(Component, __assign({}, (_a = {}, _a[altIdPropField] = fakeModelId, _a))), function (wrapper) {
                var _a;
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.include((_a = { fakeModel: fakeModel }, _a[altIdPropField] = fakeModelId, _a));
            });
        });
        it("accepts a modelPropKey and enhances the component with the model under that prop name", function () {
            var altModelPropField = "randomModelPropField";
            Component = WithModel_1.withModel(exampleServiceName, "fakeModelId", altModelPropField)(TestUtils_1.FakeComponent);
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                var _a;
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.include((_a = {}, _a[altModelPropField] = fakeModel, _a));
            });
        });
    });
    describe("live observable", function () {
        var stubGetById;
        var fakeModelObservable;
        beforeEach(function () {
            fakeModelObservable = new Subject_1.Subject();
            stubGetById = sinon_1.stub(fakeService, "getById").returns(fakeModelObservable);
        });
        it("calls the getById function", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function () {
                expect(stubGetById.calledOnce).to.be.true;
            });
        });
        it("subscribes to the observable when the component mounts", function () {
            var stubSubscribe = sinon_1.stub(fakeModelObservable, "subscribe").callThrough();
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                expect(stubSubscribe.calledOnce).to.be.true;
            });
        });
        it("unsubscribes from the observable when the component unmounts", function () {
            var stubUnsubscribe = sinon_1.spy();
            var stubSubscribe = sinon_1.stub(fakeModelObservable, "subscribe")
                .returns({ unsubscribe: stubUnsubscribe });
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                wrapper.unmount();
                expect(stubUnsubscribe.calledOnce).to.be.true;
            });
        });
        it("adds the model to the component", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                fakeModelObservable.next(fakeModel);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModel: fakeModel });
            });
        });
        it("updates the component when the observable updates", function () {
            TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModelId }), function (wrapper) {
                fakeModelObservable.next(fakeModel);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModel: fakeModel });
                var newerFakeModel = redux_data_service_1.seedService(exampleServiceName);
                fakeModelObservable.next(newerFakeModel);
                wrapper.update();
                expect(wrapper.find(TestUtils_1.FakeComponent).props()).to.deep.include({ fakeModel: newerFakeModel });
            });
        });
    });
});
