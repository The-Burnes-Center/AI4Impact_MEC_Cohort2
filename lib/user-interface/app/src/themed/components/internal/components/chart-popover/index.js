import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { nodeContains } from '@cloudscape-design/component-toolkit/dom';
import PopoverBody from '../../../popover/body';
import PopoverContainer from '../../../popover/container';
import { getBaseProps } from '../../base-component';
import { useMergeRefs } from '../../hooks/use-merge-refs';
import { nodeBelongs } from '../../utils/node-belongs';
import popoverStyles from '../../../popover/styles.css.js';
import styles from './styles.css.js';
export default React.forwardRef(ChartPopover);
function ChartPopover(_a, ref) {
    var { position = 'right', size = 'medium', fixedWidth = false, dismissButton = false, dismissAriaLabel, children, title, trackRef, trackKey, onDismiss, container, onMouseEnter, onMouseLeave, onBlur } = _a, restProps = __rest(_a, ["position", "size", "fixedWidth", "dismissButton", "dismissAriaLabel", "children", "title", "trackRef", "trackKey", "onDismiss", "container", "onMouseEnter", "onMouseLeave", "onBlur"]);
    const baseProps = getBaseProps(restProps);
    const popoverObjectRef = useRef(null);
    const popoverRef = useMergeRefs(popoverObjectRef, ref);
    useEffect(() => {
        const onDocumentClick = (event) => {
            if (event.target &&
                !nodeBelongs(popoverObjectRef.current, event.target) && // click not in popover
                !nodeContains(container, event.target) // click not in segment
            ) {
                onDismiss(true);
            }
        };
        document.addEventListener('mousedown', onDocumentClick, { capture: true });
        return () => {
            document.removeEventListener('mousedown', onDocumentClick, { capture: true });
        };
    }, [container, onDismiss]);
    // In chart popovers, dismiss button is present when they are pinned, so both values are equivalent.
    const isPinned = dismissButton;
    return (React.createElement("div", Object.assign({}, baseProps, { className: clsx(popoverStyles.root, styles.root, baseProps.className), ref: popoverRef, onMouseEnter: onMouseEnter, onMouseLeave: onMouseLeave, onBlur: onBlur, 
        // The tabIndex makes it so that clicking inside popover assigns this element as blur target.
        // That is necessary in charts to ensure the blur target is within the chart and no cleanup is needed.
        tabIndex: -1 }),
        React.createElement(PopoverContainer, { size: size, fixedWidth: fixedWidth, position: position, trackRef: trackRef, trackKey: trackKey, arrow: position => (React.createElement("div", { className: clsx(popoverStyles.arrow, popoverStyles[`arrow-position-${position}`]) },
                React.createElement("div", { className: popoverStyles['arrow-outer'] }),
                React.createElement("div", { className: popoverStyles['arrow-inner'] }))), keepPosition: true, allowVerticalOverflow: true, allowScrollToFit: isPinned },
            React.createElement("div", { className: styles['hover-area'] },
                React.createElement(PopoverBody, { dismissButton: dismissButton, dismissAriaLabel: dismissAriaLabel, header: title, onDismiss: onDismiss, overflowVisible: "content", className: styles['popover-body'] }, children)))));
}
//# sourceMappingURL=index.js.map