"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
var DefaultLoadingComponent_1 = require("./DefaultLoadingComponent");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it;
var expect = intern.getPlugin("chai").expect;
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("<DefaultLoadingComponent />", function () {
    it("displays loading text", function () {
        var wrapper = enzyme_1.shallow(React.createElement(DefaultLoadingComponent_1.DefaultLoadingComponent, null));
        expect(wrapper.text()).to.equal("Loading...");
    });
});
