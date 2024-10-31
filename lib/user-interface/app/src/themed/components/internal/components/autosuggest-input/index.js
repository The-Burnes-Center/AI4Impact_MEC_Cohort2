// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { __rest } from "tslib";
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';
import InternalInput from '../../../input/internal';
import { getBaseProps } from '../../base-component';
import { useFormFieldContext } from '../../context/form-field-context';
import { fireCancelableEvent, fireNonCancelableEvent } from '../../events';
import { KeyCode } from '../../keycode';
import { nodeBelongs } from '../../utils/node-belongs';
import Dropdown from '../dropdown';
import styles from './styles.css.js';
const AutosuggestInput = React.forwardRef((_a, ref) => {
    var { value, onChange, onBlur, onFocus, onKeyUp, onKeyDown, name, placeholder, disabled, readOnly, autoFocus, ariaLabel, ariaRequired, disableBrowserAutocorrect = false, expandToViewport, ariaControls, ariaActivedescendant, clearAriaLabel, dropdownExpanded = true, dropdownContentKey, dropdownContentFocusable = false, dropdownContent = null, dropdownFooter = null, dropdownWidth, loopFocus, onCloseDropdown, onDelayedInput, onPressArrowDown, onPressArrowUp, onPressEnter, __internalRootRef } = _a, restProps = __rest(_a, ["value", "onChange", "onBlur", "onFocus", "onKeyUp", "onKeyDown", "name", "placeholder", "disabled", "readOnly", "autoFocus", "ariaLabel", "ariaRequired", "disableBrowserAutocorrect", "expandToViewport", "ariaControls", "ariaActivedescendant", "clearAriaLabel", "dropdownExpanded", "dropdownContentKey", "dropdownContentFocusable", "dropdownContent", "dropdownFooter", "dropdownWidth", "loopFocus", "onCloseDropdown", "onDelayedInput", "onPressArrowDown", "onPressArrowUp", "onPressEnter", "__internalRootRef"]);
    const baseProps = getBaseProps(restProps);
    const formFieldContext = useFormFieldContext(restProps);
    const inputRef = useRef(null);
    const dropdownContentRef = useRef(null);
    const dropdownFooterRef = useRef(null);
    const preventOpenOnFocusRef = useRef(false);
    const preventCloseOnBlurRef = useRef(false);
    const [open, setOpen] = useState(false);
    const openDropdown = () => !readOnly && setOpen(true);
    const closeDropdown = () => {
        setOpen(false);
        fireNonCancelableEvent(onCloseDropdown, null);
    };
    useImperativeHandle(ref, () => ({
        focus(options) {
            var _a;
            if (options === null || options === void 0 ? void 0 : options.preventDropdown) {
                preventOpenOnFocusRef.current = true;
            }
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        },
        select() {
            var _a;
            (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.select();
        },
        open: openDropdown,
        close: closeDropdown,
    }));
    const handleBlur = () => {
        if (!preventCloseOnBlurRef.current) {
            closeDropdown();
            fireNonCancelableEvent(onBlur, null);
        }
    };
    const handleFocus = () => {
        if (!preventOpenOnFocusRef.current) {
            openDropdown();
            fireNonCancelableEvent(onFocus, null);
        }
        preventOpenOnFocusRef.current = false;
    };
    const fireKeydown = (event) => fireCancelableEvent(onKeyDown, event.detail, event);
    const handleKeyDown = (event) => {
        switch (event.detail.keyCode) {
            case KeyCode.down: {
                onPressArrowDown === null || onPressArrowDown === void 0 ? void 0 : onPressArrowDown();
                openDropdown();
                event.preventDefault();
                break;
            }
            case KeyCode.up: {
                onPressArrowUp === null || onPressArrowUp === void 0 ? void 0 : onPressArrowUp();
                openDropdown();
                event.preventDefault();
                break;
            }
            case KeyCode.enter: {
                if (open) {
                    if (!(onPressEnter === null || onPressEnter === void 0 ? void 0 : onPressEnter())) {
                        closeDropdown();
                    }
                    event.preventDefault();
                }
                fireKeydown(event);
                break;
            }
            case KeyCode.escape: {
                if (open) {
                    event.stopPropagation();
                    closeDropdown();
                }
                else if (value) {
                    event.stopPropagation();
                    fireNonCancelableEvent(onChange, { value: '' });
                }
                event.preventDefault();
                fireKeydown(event);
                break;
            }
            default: {
                fireKeydown(event);
            }
        }
    };
    const handleChange = (value) => {
        openDropdown();
        fireNonCancelableEvent(onChange, { value });
    };
    const handleDelayedInput = (value) => {
        fireNonCancelableEvent(onDelayedInput, { value });
    };
    const handleDropdownMouseDown = event => {
        // Prevent currently focused element from losing focus.
        if (!dropdownContentFocusable) {
            event.preventDefault();
        }
        // Prevent closing dropdown on click inside.
        else {
            preventCloseOnBlurRef.current = true;
            requestAnimationFrame(() => {
                preventCloseOnBlurRef.current = false;
            });
        }
    };
    const expanded = open && dropdownExpanded;
    const nativeAttributes = {
        name,
        placeholder,
        autoFocus,
        onClick: openDropdown,
        role: 'combobox',
        'aria-autocomplete': 'list',
        'aria-expanded': expanded,
        'aria-controls': open ? ariaControls : undefined,
        // 'aria-owns' needed for safari+vo to announce activedescendant content
        'aria-owns': open ? ariaControls : undefined,
        'aria-label': ariaLabel,
        'aria-activedescendant': ariaActivedescendant,
    };
    // Closes dropdown when outside click is detected.
    // Similar to the internal dropdown implementation but includes the target as well.
    useEffect(() => {
        if (!open) {
            return;
        }
        const clickListener = (event) => {
            if (!nodeBelongs(inputRef.current, event.target) &&
                !nodeBelongs(dropdownContentRef.current, event.target) &&
                !nodeBelongs(dropdownFooterRef.current, event.target)) {
                closeDropdown();
            }
        };
        window.addEventListener('mousedown', clickListener);
        return () => {
            window.removeEventListener('mousedown', clickListener);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    return (React.createElement("div", Object.assign({}, baseProps, { className: clsx(baseProps.className, styles.root), ref: __internalRootRef }),
        React.createElement(Dropdown, { minWidth: dropdownWidth, stretchWidth: !dropdownWidth, stretchBeyondTriggerWidth: true, contentKey: dropdownContentKey, onFocus: handleFocus, onBlur: handleBlur, trigger: React.createElement(InternalInput, Object.assign({ type: "visualSearch", value: value, onChange: event => handleChange(event.detail.value), __onDelayedInput: event => handleDelayedInput(event.detail.value), onKeyDown: handleKeyDown, onKeyUp: onKeyUp, disabled: disabled, disableBrowserAutocorrect: disableBrowserAutocorrect, readOnly: readOnly, ariaRequired: ariaRequired, clearAriaLabel: clearAriaLabel, ref: inputRef, autoComplete: false, __nativeAttributes: nativeAttributes }, formFieldContext)), onMouseDown: handleDropdownMouseDown, open: open && (!!dropdownContent || !!dropdownFooter), footer: dropdownFooterRef && (React.createElement("div", { ref: dropdownFooterRef, className: styles['dropdown-footer'] }, dropdownFooter)), expandToViewport: expandToViewport, loopFocus: loopFocus }, open && dropdownContent ? (React.createElement("div", { ref: dropdownContentRef, className: styles['dropdown-content'] }, dropdownContent)) : null)));
});
export default AutosuggestInput;
//# sourceMappingURL=index.js.map