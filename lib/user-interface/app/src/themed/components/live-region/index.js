// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { __rest } from "tslib";
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalLiveRegion from './internal';
function LiveRegion(_a) {
    var { assertive = false, hidden = false, tagName = 'div' } = _a, restProps = __rest(_a, ["assertive", "hidden", "tagName"]);
    const baseComponentProps = useBaseComponent('LiveRegion', { props: { assertive, hidden } });
    return (React.createElement(InternalLiveRegion, Object.assign({ assertive: assertive, hidden: hidden, tagName: tagName }, baseComponentProps, restProps)));
}
applyDisplayName(LiveRegion, 'LiveRegion');
export default LiveRegion;
//# sourceMappingURL=index.js.map