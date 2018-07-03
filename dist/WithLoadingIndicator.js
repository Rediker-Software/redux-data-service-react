"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var recompose_1 = require("recompose");
var Configure_1 = require("./Configure");
exports.defaultShowLoadingIndicator = function (_a) {
    var isLoading = _a.isLoading;
    return isLoading;
};
function withLoadingIndicator(test, loadingComponent) {
    if (test === void 0) { test = exports.defaultShowLoadingIndicator; }
    return (recompose_1.branch(test, recompose_1.renderComponent(loadingComponent || Configure_1.getConfiguration().loadingComponent || "Loading...")));
}
exports.withLoadingIndicator = withLoadingIndicator;
