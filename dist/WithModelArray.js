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
var recompose_1 = require("recompose");
var redux_data_service_1 = require("redux-data-service");
var pluralize_1 = require("pluralize");
var rxjsObservableConfig_1 = require("recompose/rxjsObservableConfig");
function withModelArray(dataServiceName, idPropKey, modelPropKey) {
    if (idPropKey === void 0) { idPropKey = dataServiceName + "Ids"; }
    if (modelPropKey === void 0) { modelPropKey = pluralize_1.plural(dataServiceName); }
    return recompose_1.branch(function (props) { return props[modelPropKey] == null && props[idPropKey] != null; }, recompose_1.mapPropsStreamWithConfig(rxjsObservableConfig_1.default)(function (props$) {
        return props$.combineLatest(props$.switchMap(function (props) { return redux_data_service_1.getDataService(dataServiceName).getByIds(props[idPropKey]); }), function (props, model) {
            var _a;
            return (__assign((_a = {}, _a[modelPropKey] = model, _a), props));
        });
    }));
}
exports.withModelArray = withModelArray;
