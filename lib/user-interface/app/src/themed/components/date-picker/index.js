import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useRef, useState } from 'react';
import clsx from 'clsx';
import { InternalButton } from '../button/internal';
import InternalCalendar from '../calendar/internal';
import { useFormFieldContext } from '../contexts/form-field.js';
import InternalDateInput from '../date-input/internal';
import { useLocale } from '../i18n/context.js';
import { getBaseProps } from '../internal/base-component';
import Dropdown from '../internal/components/dropdown';
import FocusLock from '../internal/components/focus-lock';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import useForwardFocus from '../internal/hooks/forward-focus';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useFocusTracker } from '../internal/hooks/use-focus-tracker.js';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { KeyCode } from '../internal/keycode';
import { applyDisplayName } from '../internal/utils/apply-display-name.js';
import { parseDate } from '../internal/utils/date-time';
import { normalizeLocale } from '../internal/utils/locale';
import InternalLiveRegion from '../live-region/internal';
import { getBaseDateLabel, getSelectedDateLabel, isValidFullDate } from './utils';
import styles from './styles.css.js';
const DatePicker = React.forwardRef((_a, ref) => {
    var _b, _c, _d;
    var { locale = '', startOfWeek, isDateEnabled, dateDisabledReason, nextMonthAriaLabel, previousMonthAriaLabel, todayAriaLabel, i18nStrings, placeholder = '', value = '', readOnly = false, disabled = false, onBlur, autoFocus = false, onChange, onFocus, name, ariaLabel, ariaRequired, controlId, invalid, warning, openCalendarAriaLabel, expandToViewport, granularity = 'day' } = _a, restProps = __rest(_a, ["locale", "startOfWeek", "isDateEnabled", "dateDisabledReason", "nextMonthAriaLabel", "previousMonthAriaLabel", "todayAriaLabel", "i18nStrings", "placeholder", "value", "readOnly", "disabled", "onBlur", "autoFocus", "onChange", "onFocus", "name", "ariaLabel", "ariaRequired", "controlId", "invalid", "warning", "openCalendarAriaLabel", "expandToViewport", "granularity"]);
    const { __internalRootRef } = useBaseComponent('DatePicker', {
        props: { autoFocus, expandToViewport, granularity, readOnly },
    });
    checkControlled('DatePicker', 'value', value, 'onChange', onChange);
    const contextLocale = useLocale();
    const normalizedLocale = normalizeLocale('DatePicker', locale || contextLocale);
    const baseProps = getBaseProps(restProps);
    const [isDropDownOpen, setIsDropDownOpen] = useState(false);
    const { ariaLabelledby, ariaDescribedby } = useFormFieldContext(restProps);
    const internalInputRef = useRef(null);
    const buttonRef = useRef(null);
    useForwardFocus(ref, internalInputRef);
    const rootRef = useRef(null);
    const dropdownId = useUniqueId('calender');
    const calendarDescriptionId = useUniqueId('calendar-description-');
    const mergedRef = useMergeRefs(rootRef, __internalRootRef);
    useFocusTracker({ rootRef, onBlur, onFocus });
    const onDropdownCloseHandler = useCallback(() => setIsDropDownOpen(false), [setIsDropDownOpen]);
    const onButtonClickHandler = () => {
        if (!isDropDownOpen) {
            setIsDropDownOpen(true);
        }
    };
    const onWrapperKeyDownHandler = (event) => {
        var _a;
        if (event.keyCode === KeyCode.escape && isDropDownOpen) {
            event.stopPropagation();
            (_a = buttonRef.current) === null || _a === void 0 ? void 0 : _a.focus();
            setIsDropDownOpen(false);
        }
    };
    const onInputChangeHandler = event => {
        fireNonCancelableEvent(onChange, { value: event.detail.value });
    };
    const onInputBlurHandler = () => {
        if (!isDropDownOpen) {
            setIsDropDownOpen(false);
        }
    };
    // Set displayed date to value if defined or to current date otherwise.
    const parsedValue = value && value.length >= 4 ? parseDate(value) : null;
    const baseDate = parsedValue || new Date();
    const hasFullValue = isValidFullDate({ date: value, granularity });
    const buttonAriaLabel = openCalendarAriaLabel &&
        openCalendarAriaLabel(hasFullValue && parsedValue
            ? getSelectedDateLabel({ date: parsedValue, granularity, locale: normalizedLocale })
            : null);
    const trigger = (React.createElement("div", { className: styles['date-picker-trigger'] },
        React.createElement("div", { className: styles['date-picker-input'] },
            React.createElement(InternalDateInput, { name: name, invalid: invalid, warning: warning, controlId: controlId, ariaLabelledby: ariaLabelledby, ariaDescribedby: ariaDescribedby, ariaLabel: ariaLabel, ariaRequired: ariaRequired, value: value, disabled: disabled, readOnly: readOnly, onChange: onInputChangeHandler, onBlur: onInputBlurHandler, placeholder: placeholder, ref: internalInputRef, autoFocus: autoFocus, onFocus: onDropdownCloseHandler, granularity: granularity })),
        React.createElement("div", null,
            React.createElement(InternalButton, { iconName: "calendar", className: styles['open-calendar-button'], onClick: onButtonClickHandler, ref: buttonRef, ariaLabel: buttonAriaLabel, disabled: disabled || readOnly, formAction: "none" }))));
    baseProps.className = clsx(baseProps.className, styles.root, styles['date-picker-container']);
    const handleMouseDown = (event) => {
        // prevent currently focused element from losing it
        event.preventDefault();
    };
    return (React.createElement("div", Object.assign({}, baseProps, { ref: mergedRef, onKeyDown: !disabled && !readOnly ? onWrapperKeyDownHandler : undefined }), disabled || readOnly ? (trigger) : (React.createElement(Dropdown, { stretchWidth: true, stretchHeight: true, open: isDropDownOpen, onDropdownClose: onDropdownCloseHandler, onMouseDown: handleMouseDown, trigger: trigger, expandToViewport: expandToViewport, scrollable: false, dropdownId: dropdownId }, isDropDownOpen && (React.createElement(FocusLock, { className: styles['focus-lock'], autoFocus: true },
        React.createElement("div", { tabIndex: 0, className: styles.calendar, role: "dialog", "aria-modal": "true" },
            React.createElement(InternalCalendar, { value: value, onChange: e => {
                    var _a;
                    fireNonCancelableEvent(onChange, e.detail);
                    (_a = buttonRef === null || buttonRef === void 0 ? void 0 : buttonRef.current) === null || _a === void 0 ? void 0 : _a.focus();
                    setIsDropDownOpen(false);
                }, locale: normalizedLocale, startOfWeek: startOfWeek, ariaDescribedby: calendarDescriptionId, ariaLabel: ariaLabel, ariaLabelledby: ariaLabelledby, granularity: granularity, isDateEnabled: isDateEnabled, dateDisabledReason: dateDisabledReason, i18nStrings: Object.assign(Object.assign({}, i18nStrings), { todayAriaLabel: (_b = i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.todayAriaLabel) !== null && _b !== void 0 ? _b : todayAriaLabel, nextMonthAriaLabel: (_c = i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.nextMonthAriaLabel) !== null && _c !== void 0 ? _c : nextMonthAriaLabel, previousMonthAriaLabel: (_d = i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.previousMonthAriaLabel) !== null && _d !== void 0 ? _d : previousMonthAriaLabel }) }),
            React.createElement(InternalLiveRegion, { id: calendarDescriptionId, hidden: true, tagName: "span" }, getBaseDateLabel({ date: baseDate, granularity, locale: normalizedLocale })))))))));
});
applyDisplayName(DatePicker, 'DatePicker');
export default DatePicker;
//# sourceMappingURL=index.js.map