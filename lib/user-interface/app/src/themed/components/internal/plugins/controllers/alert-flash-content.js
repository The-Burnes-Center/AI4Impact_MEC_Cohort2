// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
var _AlertFlashContentController_listeners, _AlertFlashContentController_cleanups, _AlertFlashContentController_provider, _AlertFlashContentController_scheduleUpdate;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import debounce from '../../debounce';
export class AlertFlashContentController {
    constructor() {
        _AlertFlashContentController_listeners.set(this, []);
        _AlertFlashContentController_cleanups.set(this, new Map());
        _AlertFlashContentController_provider.set(this, void 0);
        _AlertFlashContentController_scheduleUpdate.set(this, debounce(() => __classPrivateFieldGet(this, _AlertFlashContentController_listeners, "f").forEach(listener => {
            if (__classPrivateFieldGet(this, _AlertFlashContentController_provider, "f")) {
                const cleanup = listener(__classPrivateFieldGet(this, _AlertFlashContentController_provider, "f"));
                __classPrivateFieldGet(this, _AlertFlashContentController_cleanups, "f").set(listener, cleanup);
            }
        }), 0));
        this.registerContentReplacer = (content) => {
            if (__classPrivateFieldGet(this, _AlertFlashContentController_provider, "f")) {
                console.warn(`Cannot call \`registerContentReplacer\` with new provider: provider with id "${__classPrivateFieldGet(this, _AlertFlashContentController_provider, "f").id}" already registered.`);
                return;
            }
            __classPrivateFieldSet(this, _AlertFlashContentController_provider, content, "f");
            // Notify existing components if registration happens after the components are rendered.
            __classPrivateFieldGet(this, _AlertFlashContentController_scheduleUpdate, "f").call(this);
        };
        this.clearRegisteredReplacer = () => {
            __classPrivateFieldSet(this, _AlertFlashContentController_provider, undefined, "f");
        };
        this.initialCheck = (context) => {
            var _a;
            if ((_a = __classPrivateFieldGet(this, _AlertFlashContentController_provider, "f")) === null || _a === void 0 ? void 0 : _a.initialCheck) {
                return __classPrivateFieldGet(this, _AlertFlashContentController_provider, "f").initialCheck(context);
            }
            return false;
        };
        this.onContentRegistered = (listener) => {
            if (__classPrivateFieldGet(this, _AlertFlashContentController_provider, "f")) {
                const cleanup = listener(__classPrivateFieldGet(this, _AlertFlashContentController_provider, "f"));
                __classPrivateFieldGet(this, _AlertFlashContentController_listeners, "f").push(listener);
                __classPrivateFieldGet(this, _AlertFlashContentController_cleanups, "f").set(listener, cleanup);
            }
            else {
                __classPrivateFieldGet(this, _AlertFlashContentController_listeners, "f").push(listener);
            }
            return () => {
                var _a;
                (_a = __classPrivateFieldGet(this, _AlertFlashContentController_cleanups, "f").get(listener)) === null || _a === void 0 ? void 0 : _a();
                __classPrivateFieldSet(this, _AlertFlashContentController_listeners, __classPrivateFieldGet(this, _AlertFlashContentController_listeners, "f").filter(item => item !== listener), "f");
                __classPrivateFieldGet(this, _AlertFlashContentController_cleanups, "f").delete(listener);
            };
        };
    }
    installPublic(api = {}) {
        var _a;
        (_a = api.registerContentReplacer) !== null && _a !== void 0 ? _a : (api.registerContentReplacer = this.registerContentReplacer);
        return api;
    }
    installInternal(internalApi = {}) {
        var _a, _b, _c;
        (_a = internalApi.clearRegisteredReplacer) !== null && _a !== void 0 ? _a : (internalApi.clearRegisteredReplacer = this.clearRegisteredReplacer);
        (_b = internalApi.onContentRegistered) !== null && _b !== void 0 ? _b : (internalApi.onContentRegistered = this.onContentRegistered);
        (_c = internalApi.initialCheck) !== null && _c !== void 0 ? _c : (internalApi.initialCheck = this.initialCheck);
        return internalApi;
    }
}
_AlertFlashContentController_listeners = new WeakMap(), _AlertFlashContentController_cleanups = new WeakMap(), _AlertFlashContentController_provider = new WeakMap(), _AlertFlashContentController_scheduleUpdate = new WeakMap();
//# sourceMappingURL=alert-flash-content.js.map