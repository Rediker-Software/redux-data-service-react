"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
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
        it("awaits promises", function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, EnzymeHelper_1.usingMount(React.createElement(FakeComponent_1.FakeComponent, { fakeProp: "value" }), function () { return new Promise(function (resolve) {
                            resolve();
                        }); })];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); });
    });
});
