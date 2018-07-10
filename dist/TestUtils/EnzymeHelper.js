"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
function usingMount(component, whileMounted, mountOptions) {
    if (mountOptions === void 0) { mountOptions = {}; }
    var wrapper;
    try {
        wrapper = enzyme_1.mount(component, mountOptions);
        whileMounted(wrapper);
    }
    finally {
        if (wrapper) {
            wrapper.unmount();
        }
    }
}
exports.usingMount = usingMount;
