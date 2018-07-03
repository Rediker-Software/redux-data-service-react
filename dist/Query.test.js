"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var redux_data_service_1 = require("redux-data-service");
var faker_1 = require("faker");
var TestUtils_1 = require("./TestUtils");
var Query_1 = require("./Query");
var _a = intern.getPlugin("interface.bdd"), describe = _a.describe, it = _a.it, beforeEach = _a.beforeEach;
var expect = intern.getPlugin("chai").expect;
describe("<Query />", function () {
    var items;
    var query;
    var Component;
    var numItems = 5;
    beforeEach(function () {
        redux_data_service_1.initializeTestServices(redux_data_service_1.fakeModelModule);
        query = { organizationId: faker_1.random.number().toString() };
        items = redux_data_service_1.seedServiceList("fakeModel", numItems, query);
        Component = (React.createElement(Query_1.Query, { modelName: "fakeModel", query: query }, function (props) { return React.createElement("ul", null, props.items.map(function (item) { return React.createElement("li", { key: item.id }, item.fullText); })); }));
    });
    it("renders the component with the correct number of items", function () {
        TestUtils_1.usingMount(Component, function (wrapper) {
            expect(wrapper.find("li").length).to.equal(numItems);
        });
    });
    it("returns a component with the correct list of items", function () {
        TestUtils_1.usingMount(Component, function (wrapper) {
            var texts = wrapper.find("li").map(function (node) { return node.text(); });
            expect(texts).to.deep.equal(items.map(function (item) { return item.fullText; }));
        });
    });
});
