// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { fireNonCancelableEvent } from '../internal/events';
import { KeyCode } from '../internal/keycode';
import handleKey from '../internal/utils/handle-key';
import { Segment } from './segment';
import styles from './styles.css.js';
export default function InternalSegmentedControl({ selectedId, options, label, ariaLabelledby, onChange, }) {
    const segmentByIdRef = useRef({});
    const selectedOptions = (options || []).filter(option => {
        return option.id === selectedId;
    });
    const currentSelectedOption = selectedOptions.length ? selectedOptions[0] : null;
    const focusableSegments = (options || []).filter(option => !option.disabled || (option.disabled && !!option.disabledReason));
    const moveHighlight = (event, activeIndex) => {
        var _a;
        if (event.keyCode !== KeyCode.right && event.keyCode !== KeyCode.left) {
            return;
        }
        let nextIndex = activeIndex;
        handleKey(event, {
            onInlineStart: () => (nextIndex = activeIndex === 0 ? focusableSegments.length - 1 : activeIndex - 1),
            onInlineEnd: () => (nextIndex = activeIndex + 1 === focusableSegments.length ? 0 : activeIndex + 1),
        });
        const nextSegmentId = focusableSegments[nextIndex].id;
        (_a = segmentByIdRef.current[nextSegmentId]) === null || _a === void 0 ? void 0 : _a.focus();
    };
    return (React.createElement("div", { className: clsx(styles['segment-part'], styles[`segment-count-${options === null || options === void 0 ? void 0 : options.length}`]), "aria-label": label, "aria-labelledby": ariaLabelledby, role: "toolbar" }, options &&
        options.map((option, index) => {
            const isActive = selectedId === option.id;
            const focusableSegmentIndex = focusableSegments.indexOf(option);
            let tabIndex = isActive ? 0 : -1;
            if (currentSelectedOption === null && focusableSegmentIndex === 0) {
                tabIndex = 0;
            }
            return (React.createElement(Segment, { key: index, id: option.id, disabled: !!option.disabled, disabledReason: option.disabledReason, iconName: option.iconName, iconAlt: option.iconAlt, iconUrl: option.iconUrl, iconSvg: option.iconSvg, text: option.text, isActive: isActive, tabIndex: tabIndex, ref: node => {
                    if (node) {
                        segmentByIdRef.current[option.id] = node;
                    }
                    else {
                        delete segmentByIdRef.current[option.id];
                    }
                }, onClick: () => {
                    if (option.disabled) {
                        return;
                    }
                    if (selectedId !== option.id) {
                        fireNonCancelableEvent(onChange, { selectedId: option.id });
                    }
                }, onKeyDown: event => moveHighlight(event, focusableSegmentIndex) }));
        })));
}
//# sourceMappingURL=internal-segmented-control.js.map