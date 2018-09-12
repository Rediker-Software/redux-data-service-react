"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enzyme_1 = require("enzyme");
function usingMount(component, whileMounted, mountOptions) {
    if (mountOptions === void 0) { mountOptions = {}; }
    var wrapper;
    var promise;
    try {
        wrapper = enzyme_1.mount(component, mountOptions);
        promise = whileMounted(wrapper);
    }
    finally {
        if (promise instanceof Promise) {
            promise
                .then(function () { return wrapper.unmount(); })
                .catch(function () { return wrapper.unmount(); });
        }
        else if (wrapper) {
            wrapper.unmount();
        }
    }
    return (promise instanceof Promise) ? promise : undefined;
}
exports.usingMount = usingMount;
