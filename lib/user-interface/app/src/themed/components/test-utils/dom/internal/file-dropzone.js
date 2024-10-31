"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const dom_1 = require("@cloudscape-design/test-utils-core/dom");
const styles_selectors_js_1 = require("../../../internal/components/file-dropzone/styles.selectors.js");
class FileDropzoneWrapper extends dom_1.ComponentWrapper {
    findContent() {
        return this.findByClassName(styles_selectors_js_1.default.content);
    }
}
exports.default = FileDropzoneWrapper;
FileDropzoneWrapper.rootSelector = styles_selectors_js_1.default.root;
//# sourceMappingURL=file-dropzone.js.map