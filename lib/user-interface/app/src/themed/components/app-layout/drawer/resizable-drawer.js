import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import PanelResizeHandle from '../../internal/components/panel-resize-handle';
import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';
import { useKeyboardEvents } from '../utils/use-keyboard-events';
import { usePointerEvents } from '../utils/use-pointer-events';
import { Drawer } from './index';
import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
export const ResizableDrawer = (_a) => {
    var _b, _c, _d, _e;
    var { onResize, maxWidth, minWidth, refs, activeDrawer, toolsContent } = _a, props = __rest(_a, ["onResize", "maxWidth", "minWidth", "refs", "activeDrawer", "toolsContent"]);
    const { isOpen, children, width, isMobile } = props;
    const clampedWidth = getLimitedValue(minWidth, width, maxWidth);
    const relativeSize = ((clampedWidth - minWidth) / (maxWidth - minWidth)) * 100;
    const setSidePanelWidth = (newWidth) => {
        const size = getLimitedValue(minWidth, newWidth, maxWidth);
        const id = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id;
        if (isOpen && id && maxWidth >= minWidth) {
            onResize({ size, id });
        }
    };
    const drawerRefObject = useRef(null);
    const sizeControlProps = {
        position: 'side',
        panelRef: drawerRefObject,
        handleRef: refs.slider,
        onResize: setSidePanelWidth,
    };
    const onSliderPointerDown = usePointerEvents(sizeControlProps);
    const onKeyDown = useKeyboardEvents(sizeControlProps);
    return (React.createElement(Drawer, Object.assign({}, props, { id: activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id, width: clampedWidth, ref: drawerRefObject, isHidden: !activeDrawer, resizeHandle: !isMobile &&
            (activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.resizable) && (React.createElement(PanelResizeHandle, { ref: refs.slider, position: "side", className: testutilStyles['drawers-slider'], ariaLabel: (_b = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.ariaLabels) === null || _b === void 0 ? void 0 : _b.resizeHandle, ariaValuenow: relativeSize, onKeyDown: onKeyDown, onPointerDown: onSliderPointerDown })), ariaLabels: {
            openLabel: (_c = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.ariaLabels) === null || _c === void 0 ? void 0 : _c.triggerButton,
            mainLabel: (_d = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.ariaLabels) === null || _d === void 0 ? void 0 : _d.drawerName,
            closeLabel: (_e = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.ariaLabels) === null || _e === void 0 ? void 0 : _e.closeButton,
        } }),
        toolsContent && React.createElement("div", { className: clsx((activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id) !== TOOLS_DRAWER_ID && styles.hide) }, toolsContent),
        (activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id) !== TOOLS_DRAWER_ID ? children : null));
};
//# sourceMappingURL=resizable-drawer.js.map