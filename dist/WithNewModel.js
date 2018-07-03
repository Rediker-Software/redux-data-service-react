"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var recompose_1 = require("recompose");
var redux_data_service_1 = require("redux-data-service");
var WithModel_1 = require("./WithModel");
function withNewModel(dataServiceName, idPropKey, modelPropKey) {
    if (idPropKey === void 0) { idPropKey = dataServiceName + "Id"; }
    if (modelPropKey === void 0) { modelPropKey = dataServiceName; }
    return recompose_1.compose(recompose_1.lifecycle({
        componentDidMount: function () {
            var _a;
            if (!this.props[idPropKey] && !this.props[modelPropKey]) {
                var model = redux_data_service_1.getDataService(dataServiceName).createNew();
                this.setState((_a = {}, _a[idPropKey] = model.id, _a));
            }
        },
        componentWillUnmount: function () {
            var model = this.props[modelPropKey];
            if (model && model.isNew) {
                model.unload();
            }
        },
    }), WithModel_1.withModel(dataServiceName, idPropKey, modelPropKey));
}
exports.withNewModel = withNewModel;
