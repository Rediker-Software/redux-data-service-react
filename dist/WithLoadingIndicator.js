"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var recompose_1 = require("recompose");
var Configure_1 = require("./Configure");
exports.defaultShowLoadingIndicator = function (_a) {
    var isLoading = _a.isLoading;
    return isLoading;
};
function withLoadingIndicator(test, loadingComponent) {
    if (test === void 0) { test = exports.defaultShowLoadingIndicator; }
    return recompose_1.compose(recompose_1.defaultProps({
        loadingComponent: loadingComponent || Configure_1.getConfiguration().loadingComponent,
        loadingComponentProps: {},
    }), recompose_1.branch(test, recompose_1.renderComponent(function (_a) {
        var Loading = _a.loadingComponent, loadingComponentProps = _a.loadingComponentProps;
        return React.createElement(Loading, __assign({}, loadingComponentProps));
    })), recompose_1.mapProps(function (_a) {
        var isLoading = _a.isLoading, Loading = _a.loadingComponent, loadingComponentProps = _a.loadingComponentProps, props = __rest(_a, ["isLoading", "loadingComponent", "loadingComponentProps"]);
        return props;
    }));
}
exports.withLoadingIndicator = withLoadingIndicator;
