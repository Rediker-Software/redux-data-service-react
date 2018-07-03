"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var redux_data_service_1 = require("redux-data-service");
var enzyme_1 = require("enzyme");
var sinon_1 = require("sinon");
require("./TestUtils/TestSetup");
var TestUtils_1 = require("./TestUtils");
var WithNewModel_1 = require("./WithNewModel");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach;
var expect = intern.getPlugin("chai").expect;
describe("withModelOrCreateNew", function () {
    var store;
    beforeEach(function () {
        store = redux_data_service_1.initializeTestServices(redux_data_service_1.fakeModelModule);
    });
    it("creates a new model if one was not provided", function () {
        var model;
        var Component = WithNewModel_1.withNewModel("fakeModel")(function (props) {
            model = props.fakeModel;
            return React.createElement("span", null);
        });
        TestUtils_1.usingMount(React.createElement(Component, null), function () {
            expect(model).to.have.property("isNew").to.be.true;
        }, { context: { store: store } });
    });
    it("does not create a new model if one was provided", function () {
        var fakeModel = redux_data_service_1.seedService("fakeModel");
        var model;
        var Component = WithNewModel_1.withNewModel("fakeModel")(function (props) {
            model = props.fakeModel;
            return React.createElement("span", null);
        });
        TestUtils_1.usingMount(React.createElement(Component, { fakeModel: fakeModel }), function () {
            expect(model).to.have.property("id").to.equal(fakeModel.id);
        }, { context: { store: store } });
    });
    it("does not create a new model if an id was provided", function () {
        var fakeModel = redux_data_service_1.seedService("fakeModel");
        var modelId;
        var Component = WithNewModel_1.withNewModel("fakeModel")(function (props) {
            modelId = props.fakeModelId;
            return React.createElement("span", null);
        });
        TestUtils_1.usingMount(React.createElement(Component, { fakeModelId: fakeModel.id }), function () {
            expect(modelId).to.equal(fakeModel.id);
        }, { context: { store: store } });
    });
    it("removes the new model from the store if it is still new when the component unmounts", function () {
        var fakeModelService = redux_data_service_1.getDataService("fakeModel");
        var fakeModel = fakeModelService.createNew();
        var unloadStub = sinon_1.stub(fakeModel, "unload");
        var Component = WithNewModel_1.withNewModel("fakeModel")(function () { return React.createElement("span", null); });
        var wrapper = enzyme_1.mount(React.createElement(Component, { fakeModel: fakeModel }), { context: { store: store } });
        wrapper.unmount();
        expect(unloadStub.calledOnce).to.be.true;
    });
    it("does not remove the new model from the store if it is not new when the component unmounts", function () {
        var fakeModel = redux_data_service_1.seedService("fakeModel");
        var unloadStub = sinon_1.stub(fakeModel, "unload");
        var Component = WithNewModel_1.withNewModel("fakeModel")(function () { return React.createElement("span", null); });
        var wrapper = enzyme_1.mount(React.createElement(Component, { fakeModel: fakeModel }), { context: { store: store } });
        wrapper.unmount();
        expect(unloadStub.called).to.be.false;
    });
});
