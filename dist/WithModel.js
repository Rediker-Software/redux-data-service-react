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
require("rxjs/add/operator/switchMap");
require("rxjs/add/operator/combineLatest");
var rxjsObservableConfig_1 = require("recompose/rxjsObservableConfig");
var recompose_1 = require("recompose");
var redux_data_service_1 = require("redux-data-service");
var WithLoadingIndicator_1 = require("./WithLoadingIndicator");
function withModel(dataServiceName, idPropKey, modelPropKey) {
    if (idPropKey === void 0) { idPropKey = dataServiceName + "Id"; }
    if (modelPropKey === void 0) { modelPropKey = dataServiceName; }
    return recompose_1.compose(recompose_1.branch(function (props) { return props[modelPropKey] != null || props[idPropKey] != null; }, recompose_1.mapPropsStreamWithConfig(rxjsObservableConfig_1.default)(function (props$) {
        return props$.combineLatest(props$.switchMap(function (props) { return redux_data_service_1.getDataService(dataServiceName).getById(props[idPropKey] || props[modelPropKey].id); }), function (props, model) {
            var _a;
            return (__assign((_a = {}, _a[modelPropKey] = model, _a), props));
        });
    })), WithLoadingIndicator_1.withLoadingIndicator(function (props) { return props[modelPropKey] == null; }));
}
exports.withModel = withModel;
