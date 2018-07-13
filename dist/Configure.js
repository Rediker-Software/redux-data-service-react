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
var DefaultLoadingComponent_1 = require("./DefaultLoadingComponent");
var configuration = {
    loadingComponent: DefaultLoadingComponent_1.DefaultLoadingComponent,
};
function getConfiguration() {
    return configuration;
}
exports.getConfiguration = getConfiguration;
function configure(config) {
    configuration = __assign({}, config);
    if (configuration.loadingComponent == null) {
        configuration.loadingComponent = DefaultLoadingComponent_1.DefaultLoadingComponent;
    }
}
exports.configure = configure;
