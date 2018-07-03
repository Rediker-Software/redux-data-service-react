"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var configuration = {};
function getConfiguration() {
    return configuration;
}
exports.getConfiguration = getConfiguration;
function configure(config, configureStore) {
    configuration = config;
}
exports.configure = configure;
