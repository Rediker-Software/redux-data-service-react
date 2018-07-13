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
require("rxjs/add/operator/combineLatest");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/map");
require("rxjs/add/operator/switchMap");
var recompose_1 = require("recompose");
var redux_data_service_1 = require("redux-data-service");
var lodash_1 = require("lodash");
var WithLoadingIndicator_1 = require("./WithLoadingIndicator");
var rxjsObservableConfig_1 = require("recompose/rxjsObservableConfig");
function withModelQuery(options) {
    return recompose_1.compose(recompose_1.defaultProps(options || {}), recompose_1.branch(function (_a) {
        var items = _a.items, modelName = _a.modelName;
        return modelName && items == null && modelName != null;
    }, recompose_1.mapPropsStreamWithConfig(rxjsObservableConfig_1.default)(function (props$) {
        return props$.combineLatest(props$.switchMap(function (_a) {
            var modelName = _a.modelName, query = _a.query;
            var service = redux_data_service_1.getDataService(modelName);
            return service
                .getDefaultQueryParams()
                .map(function (defaultQueryParams) { return lodash_1.defaultsDeep({}, query, defaultQueryParams); })
                .switchMap(function (queryParams) { return service.getByQuery(queryParams); });
        }), function (_a, items) {
            var modelName = _a.modelName, query = _a.query, props = __rest(_a, ["modelName", "query"]);
            return (__assign({ items: items }, props));
        });
    })), WithLoadingIndicator_1.withLoadingIndicator(function (_a) {
        var items = _a.items;
        return items == null;
    }));
}
exports.withModelQuery = withModelQuery;
