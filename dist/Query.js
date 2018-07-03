"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var recompose_1 = require("recompose");
var WithModelQuery_1 = require("./WithModelQuery");
exports.Query = recompose_1.withRenderProps(WithModelQuery_1.withModelQuery());
