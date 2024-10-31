// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useSplitPanelContext } from '../../internal/context/split-panel-context';
import styles from './styles.css.js';
export function SideSplitPanelDrawer({ displayed, children }) {
    const { isOpen, size, topOffset, bottomOffset } = useSplitPanelContext();
    const width = isOpen && children ? size : undefined;
    return (React.createElement("div", { className: clsx(displayed && styles['drawer-displayed']), style: { width }, "data-testid": "side-split-panel-drawer" },
        React.createElement("div", { className: styles['drawer-content'], style: { width: width, top: topOffset, bottom: bottomOffset } }, children)));
}
//# sourceMappingURL=drawer.js.map