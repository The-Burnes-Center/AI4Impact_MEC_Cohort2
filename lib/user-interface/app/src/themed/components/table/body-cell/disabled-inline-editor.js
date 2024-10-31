import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import Icon from '../../icon/internal';
import Portal from '../../internal/components/portal';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context';
import useHiddenDescription from '../../internal/hooks/use-hidden-description';
import { usePortalModeClasses } from '../../internal/hooks/use-portal-mode-classes';
import InternalLiveRegion from '../../live-region/internal';
import Arrow from '../../popover/arrow';
import PopoverBody from '../../popover/body';
import PopoverContainer from '../../popover/container';
import { useClickAway } from './click-away';
import { TableTdElement } from './td-element';
import styles from './styles.css.js';
export function DisabledInlineEditor(_a) {
    var _b;
    var { className, item, column, ariaLabels, isEditing, onEditStart, onEditEnd, editDisabledReason, isVisualRefresh, interactiveCell = true, resizableColumns = false } = _a, rest = __rest(_a, ["className", "item", "column", "ariaLabels", "isEditing", "onEditStart", "onEditEnd", "editDisabledReason", "isVisualRefresh", "interactiveCell", "resizableColumns"]);
    const clickAwayRef = useClickAway(() => {
        if (isEditing) {
            onEditEnd(true);
        }
    });
    const [hasHover, setHasHover] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    // When a cell is both expandable and editable the icon is always shown.
    const showIcon = hasHover || hasFocus || isEditing || !interactiveCell;
    const iconRef = useRef(null);
    const buttonRef = useRef(null);
    const portalRef = useRef(null);
    function handleEscape(event) {
        if (event.key === 'Escape') {
            onEditEnd(true);
        }
    }
    const onClick = () => {
        var _a;
        onEditStart();
        (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.focus();
    };
    const { targetProps, descriptionEl } = useHiddenDescription(editDisabledReason);
    const portalClasses = usePortalModeClasses(portalRef);
    const { tabIndex } = useSingleTabStopNavigation(buttonRef);
    return (React.createElement(TableTdElement, Object.assign({}, rest, { nativeAttributes: { 'data-inline-editing-active': isEditing.toString() }, className: clsx(className, styles['body-cell-editable'], interactiveCell && styles['body-cell-interactive'], resizableColumns && styles['resizable-columns'], isEditing && styles['body-cell-edit-disabled-popover'], isVisualRefresh && styles['is-visual-refresh']), onClick: interactiveCell && !isEditing ? onClick : undefined, onMouseEnter: () => setHasHover(true), onMouseLeave: () => setHasHover(false), ref: clickAwayRef }),
        column.cell(item),
        React.createElement("div", { className: styles['body-cell-editor-wrapper'] },
            React.createElement("button", Object.assign({ ref: buttonRef, tabIndex: tabIndex, className: clsx(styles['body-cell-editor'], styles['body-cell-editor-disabled']), "aria-label": (_b = ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.activateEditLabel) === null || _b === void 0 ? void 0 : _b.call(ariaLabels, column, item), "aria-haspopup": "dialog", "aria-disabled": "true", onClick: !interactiveCell && !isEditing ? onClick : undefined, onFocus: () => setHasFocus(true), onBlur: () => setHasFocus(false), onKeyDown: handleEscape }, targetProps),
                showIcon && React.createElement(Icon, { name: "lock-private", variant: "normal", __internalRootRef: iconRef }),
                descriptionEl)),
        isEditing && (React.createElement("span", { ref: portalRef },
            React.createElement(Portal, null,
                React.createElement("span", { className: portalClasses },
                    React.createElement(PopoverContainer, { size: "medium", fixedWidth: false, position: "top", trackRef: iconRef, arrow: position => React.createElement(Arrow, { position: position }), renderWithPortal: true, zIndex: 2000 },
                        React.createElement(PopoverBody, { dismissButton: false, dismissAriaLabel: undefined, header: null, onDismiss: () => { }, overflowVisible: "both" },
                            React.createElement(InternalLiveRegion, { tagName: "span" }, editDisabledReason)))))))));
}
//# sourceMappingURL=disabled-inline-editor.js.map