"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var enzyme_1 = require("enzyme");
var enzyme_adapter_react_16_1 = require("enzyme-adapter-react-16");
var FakeComponent_1 = require("./FakeComponent");
var EnzymeHelper_1 = require("./EnzymeHelper");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it;
var expect = intern.getPlugin("chai").expect;
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
describe("EnzymeHelper", function () {
    describe("usingMount", function () {
        it("mounts the component and runs the function", function () {
            var didRun = false;
            EnzymeHelper_1.usingMount(React.createElement(FakeComponent_1.FakeComponent, { fakeProp: "value" }), function (wrapper) {
                didRun = true;
                expect(wrapper.props()).to.deep.equal({ fakeProp: "value" });
            });
            expect(didRun).to.be.true;
        });
        it("mounts an intrinsic element", function () {
            var didRun = false;
            EnzymeHelper_1.usingMount(React.createElement("span", null), function (wrapper) {
                didRun = true;
                expect(wrapper).not.to.be.undefined;
            });
            expect(didRun).to.be.true;
        });
        it("wont cause an error if the whileMounted func unmounts the component", function () {
            var didRun = false;
            EnzymeHelper_1.usingMount(React.createElement("span", null), function (wrapper) {
                didRun = true;
                wrapper.unmount();
            });
            expect(didRun).to.be.true;
        });
        it("throws any exceptions", function () {
            var didRun = false;
            expect(function () {
                return EnzymeHelper_1.usingMount(React.createElement("span", null), function (wrapper) {
                    didRun = true;
                    throw new Error("test");
                });
            }).to.throw("test");
            expect(didRun).to.be.true;
        });
    });
});
