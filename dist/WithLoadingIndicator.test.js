"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
var WithLoadingIndicator_1 = require("./WithLoadingIndicator");
var TestUtils_1 = require("./TestUtils");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it;
var expect = intern.getPlugin("chai").expect;
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("withLoadingIndicator", function () {
    it("renders a spinner when isLoading is true", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator(WithLoadingIndicator_1.defaultShowLoadingIndicator, TestUtils_1.FakeComponent)(function () { return React.createElement("span", null); });
        TestUtils_1.usingMount(React.createElement(Component, { isLoading: true }), function (wrapper) {
            expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.true;
        });
    });
    it("does not render a spinner when isLoading is false", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator()(function () { return React.createElement("span", null); });
        TestUtils_1.usingMount(React.createElement(Component, null), function (wrapper) {
            expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.false;
        });
    });
});
