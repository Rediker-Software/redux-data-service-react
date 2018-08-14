"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
var WithLoadingIndicator_1 = require("./WithLoadingIndicator");
var DefaultLoadingComponent_1 = require("./DefaultLoadingComponent");
var TestUtils_1 = require("./TestUtils");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach;
var expect = intern.getPlugin("chai").expect;
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("withLoadingIndicator", function () {
    var exampleComponent;
    beforeEach(function () {
        exampleComponent = function () { return React.createElement("span", null, "hello world!"); };
    });
    it("by default renders a loading component when isLoading is true", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator()(exampleComponent);
        TestUtils_1.usingMount(React.createElement(Component, { isLoading: true }), function (wrapper) {
            expect(wrapper.find(DefaultLoadingComponent_1.DefaultLoadingComponent).exists()).to.be.true;
        });
    });
    it("by default does not render a loading component when isLoading is false", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator()(exampleComponent);
        TestUtils_1.usingMount(React.createElement(Component, null), function (wrapper) {
            expect(wrapper.text()).to.equal("hello world!");
        });
    });
    it("uses an optional test function to determine if it should show the loading indicator", function () {
        var test = function () { return true; };
        var Component = WithLoadingIndicator_1.withLoadingIndicator(test)(exampleComponent);
        TestUtils_1.usingMount(React.createElement(Component, null), function (wrapper) {
            expect(wrapper.find(DefaultLoadingComponent_1.DefaultLoadingComponent).exists()).to.be.true;
        });
    });
    it("renders the default loading component if one is not given", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator()(exampleComponent);
        TestUtils_1.usingMount(React.createElement(Component, { isLoading: true }), function (wrapper) {
            expect(wrapper.find(DefaultLoadingComponent_1.DefaultLoadingComponent).exists()).to.be.true;
        });
    });
    it("renders the given loading component", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator(WithLoadingIndicator_1.defaultShowLoadingIndicator, TestUtils_1.FakeComponent)(exampleComponent);
        TestUtils_1.usingMount(React.createElement(Component, { isLoading: true }), function (wrapper) {
            expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.true;
        });
    });
    it("renders the loading component specified as a prop", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator()(exampleComponent);
        TestUtils_1.usingMount(React.createElement(Component, { isLoading: true, loadingComponent: TestUtils_1.FakeComponent }), function (wrapper) {
            expect(wrapper.find(TestUtils_1.FakeComponent).exists()).to.be.true;
        });
    });
    it("renders the loading component specified as a prop with the given props", function () {
        var Component = WithLoadingIndicator_1.withLoadingIndicator()(exampleComponent);
        var testLoadingComponent = function (_a) {
            var value = _a.value;
            return React.createElement("span", null, value);
        };
        TestUtils_1.usingMount(React.createElement(Component, { isLoading: true, loadingComponent: testLoadingComponent, loadingComponentProps: { value: "hello world" } }), function (wrapper) {
            expect(wrapper.text()).to.equal("hello world");
        });
    });
});
