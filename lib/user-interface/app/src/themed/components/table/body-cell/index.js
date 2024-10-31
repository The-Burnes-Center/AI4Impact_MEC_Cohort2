import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { useInternalI18n } from '../../i18n/context';
import Icon from '../../icon/internal';
import { useSingleTabStopNavigation } from '../../internal/context/single-tab-stop-navigation-context.js';
import { usePrevious } from '../../internal/hooks/use-previous';
import InternalLiveRegion from '../../live-region/internal';
import { DisabledInlineEditor } from './disabled-inline-editor';
import { InlineEditor } from './inline-editor';
import { TableTdElement } from './td-element';
import styles from './styles.css.js';
const submitHandlerFallback = () => {
    throw new Error('The function `handleSubmit` is required for editable columns');
};
function TableCellEditable(_a) {
    var _b, _c, _d;
    var { className, item, column, isEditing, onEditStart, onEditEnd, submitEdit, ariaLabels, isVisualRefresh, resizableColumns = false, successfulEdit = false, interactiveCell = true } = _a, rest = __rest(_a, ["className", "item", "column", "isEditing", "onEditStart", "onEditEnd", "submitEdit", "ariaLabels", "isVisualRefresh", "resizableColumns", "successfulEdit", "interactiveCell"]);
    const i18n = useInternalI18n('table');
    const editActivateRef = useRef(null);
    const tdNativeAttributes = {
        'data-inline-editing-active': isEditing.toString(),
    };
    const isFocusMoveNeededRef = useRef(false);
    useEffect(() => {
        if (!isEditing && editActivateRef.current && isFocusMoveNeededRef.current) {
            isFocusMoveNeededRef.current = false;
            editActivateRef.current.focus();
        }
    }, [isEditing]);
    // To improve the initial page render performance we only show the edit icon when necessary.
    const [hasHover, setHasHover] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    // When a cell is both expandable and editable the icon is always shown.
    const showIcon = hasHover || hasFocus || !interactiveCell;
    const prevSuccessfulEdit = usePrevious(successfulEdit);
    const prevHasFocus = usePrevious(hasFocus);
    const [showSuccessIcon, setShowSuccessIcon] = useState(false);
    useEffect(() => {
        // Hide the success icon after a successful edit, when cell loses focus.
        if (successfulEdit && prevSuccessfulEdit && !hasFocus && prevHasFocus) {
            setShowSuccessIcon(false);
        }
        // Show success icon right after a successful edit, when `successfulEdit` switches to true.
        if (successfulEdit && !prevSuccessfulEdit) {
            setShowSuccessIcon(true);
        }
    }, [hasFocus, successfulEdit, prevHasFocus, prevSuccessfulEdit]);
    const { tabIndex: editActivateTabIndex } = useSingleTabStopNavigation(editActivateRef);
    return (React.createElement(TableTdElement, Object.assign({}, rest, { nativeAttributes: tdNativeAttributes, className: clsx(className, styles['body-cell-editable'], interactiveCell && styles['body-cell-interactive'], resizableColumns && styles['resizable-columns'], isEditing && styles['body-cell-edit-active'], showSuccessIcon && showIcon && styles['body-cell-has-success'], isVisualRefresh && styles['is-visual-refresh']), onClick: interactiveCell && !isEditing ? onEditStart : undefined, onMouseEnter: () => setHasHover(true), onMouseLeave: () => setHasHover(false) }), isEditing ? (React.createElement(InlineEditor, { ariaLabels: ariaLabels, column: column, item: item, onEditEnd: options => {
            setShowSuccessIcon(false);
            isFocusMoveNeededRef.current = options.refocusCell;
            onEditEnd(options.cancelled);
        }, submitEdit: submitEdit !== null && submitEdit !== void 0 ? submitEdit : submitHandlerFallback })) : (React.createElement(React.Fragment, null,
        column.cell(item),
        showSuccessIcon && showIcon && (React.createElement(React.Fragment, null,
            React.createElement("span", { className: styles['body-cell-success'], "aria-label": (_b = ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.successfulEditLabel) === null || _b === void 0 ? void 0 : _b.call(ariaLabels, column), role: "img", onMouseDown: e => {
                    // Prevent the editor's Button blur event to be fired when clicking the success icon.
                    // This prevents unfocusing the button and triggers the `TableTdElement` onClick event which initiates the edit mode.
                    e.preventDefault();
                } },
                React.createElement(Icon, { name: "status-positive", variant: "success" })),
            React.createElement(InternalLiveRegion, { tagName: "span", hidden: true }, i18n('ariaLabels.successfulEditLabel', (_c = ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.successfulEditLabel) === null || _c === void 0 ? void 0 : _c.call(ariaLabels, column))))),
        React.createElement("div", { className: styles['body-cell-editor-wrapper'] },
            React.createElement("button", { className: styles['body-cell-editor'], "aria-label": (_d = ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.activateEditLabel) === null || _d === void 0 ? void 0 : _d.call(ariaLabels, column, item), ref: editActivateRef, onClick: !interactiveCell && !isEditing ? onEditStart : undefined, onFocus: () => setHasFocus(true), onBlur: () => setHasFocus(false), tabIndex: editActivateTabIndex }, showIcon && React.createElement(Icon, { name: "edit" })))))));
}
export function TableBodyCell(_a) {
    var _b, _c;
    var { isEditable } = _a, rest = __rest(_a, ["isEditable"]);
    const isExpandableColumnCell = rest.level !== undefined;
    const editDisabledReason = (_c = (_b = rest.column.editConfig) === null || _b === void 0 ? void 0 : _b.disabledReason) === null || _c === void 0 ? void 0 : _c.call(_b, rest.item);
    // Inline editing is deactivated for expandable column because editable cells are interactive
    // and cannot include interactive content such as expand toggles.
    if (editDisabledReason && !isExpandableColumnCell) {
        return React.createElement(DisabledInlineEditor, Object.assign({ editDisabledReason: editDisabledReason }, rest));
    }
    if ((isEditable || rest.isEditing) && !isExpandableColumnCell) {
        return React.createElement(TableCellEditable, Object.assign({}, rest));
    }
    const { column, item } = rest;
    return React.createElement(TableTdElement, Object.assign({}, rest), column.cell(item));
}
//# sourceMappingURL=index.js.map