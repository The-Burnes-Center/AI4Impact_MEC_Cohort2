// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { __rest } from "tslib";
import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { addMonths, addYears, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { getBaseProps } from '../internal/base-component';
import { fireNonCancelableEvent } from '../internal/events/index.js';
import checkControlled from '../internal/hooks/check-controlled/index.js';
import { useDateCache } from '../internal/hooks/use-date-cache/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { formatDate, parseDate } from '../internal/utils/date-time';
import { normalizeLocale } from '../internal/utils/locale';
import Grid from './grid';
import CalendarGridHeader from './grid/calendar-grid-header';
import useCalendarGridKeyboardNavigation from './grid/use-calendar-grid-keyboard-navigation';
import useCalendarGridRows from './grid/use-calendar-grid-rows';
import CalendarHeader from './header';
import useCalendarLabels from './use-calendar-labels';
import { getBaseDay, getBaseMonth } from './utils/navigation';
import styles from './styles.css.js';
export default function Calendar(_a) {
    var { value, locale = '', startOfWeek, isDateEnabled = () => true, dateDisabledReason = () => '', ariaLabel, ariaLabelledby, ariaDescribedby, onChange, __internalRootRef, i18nStrings, granularity = 'day', previousMonthAriaLabel, nextMonthAriaLabel, todayAriaLabel } = _a, rest = __rest(_a, ["value", "locale", "startOfWeek", "isDateEnabled", "dateDisabledReason", "ariaLabel", "ariaLabelledby", "ariaDescribedby", "onChange", "__internalRootRef", "i18nStrings", "granularity", "previousMonthAriaLabel", "nextMonthAriaLabel", "todayAriaLabel"]);
    checkControlled('Calendar', 'value', value, 'onChange', onChange);
    const baseProps = getBaseProps(rest);
    const normalizedLocale = normalizeLocale('Calendar', locale);
    const gridWrapperRef = useRef(null);
    const [focusedDate, setFocusedDate] = useState(null);
    const valueDateCache = useDateCache();
    const focusedDateCache = useDateCache();
    // Set displayed date to value if defined or to current date otherwise.
    const parsedValue = value && value.length >= 4 ? parseDate(value) : null;
    const memoizedValue = parsedValue ? valueDateCache(parsedValue) : null;
    const defaultDisplayedDate = memoizedValue !== null && memoizedValue !== void 0 ? memoizedValue : new Date();
    const [displayedDate, setDisplayedDate] = useState(defaultDisplayedDate);
    const headingId = useUniqueId('calendar-heading');
    const isMonthPicker = granularity === 'month';
    const isDateFocusable = (date) => isDateEnabled(date) || (!isDateEnabled(date) && !!dateDisabledReason(date));
    const baseDate = isMonthPicker
        ? getBaseMonth(displayedDate, isDateEnabled)
        : getBaseDay(displayedDate, isDateEnabled);
    const isSameDate = isMonthPicker ? isSameMonth : isSameDay;
    const isSamePage = isMonthPicker ? isSameYear : isSameMonth;
    const isCurrentPage = (date) => isMonthPicker || isSameMonth(date, baseDate);
    const { previousButtonLabel, nextButtonLabel, renderDate, renderDateAnnouncement, renderHeaderText } = useCalendarLabels({
        granularity,
        i18nStrings,
        locale: normalizedLocale,
        previousMonthAriaLabel,
        nextMonthAriaLabel,
        todayAriaLabel,
    });
    const gridRows = useCalendarGridRows({ baseDate, granularity, startOfWeek, locale: normalizedLocale });
    // Update displayed date if value changes.
    useEffect(() => {
        memoizedValue && setDisplayedDate(prev => (prev.getTime() !== memoizedValue.getTime() ? memoizedValue : prev));
    }, [memoizedValue]);
    const selectFocusedDate = (selected, baseDate) => {
        if (selected && isDateFocusable(selected) && isSamePage(selected, baseDate)) {
            return selected;
        }
        const today = new Date();
        if (isDateFocusable(today) && isSamePage(today, baseDate)) {
            return today;
        }
        if (isDateFocusable(baseDate)) {
            return baseDate;
        }
        return null;
    };
    const focusableDate = focusedDate || selectFocusedDate(memoizedValue, baseDate);
    const onHeaderChangePageHandler = (amount) => {
        const movePage = isMonthPicker ? addYears : addMonths;
        const newDate = movePage(baseDate, amount);
        onChangePageHandler(newDate);
    };
    const onChangePageHandler = (newDate) => {
        setDisplayedDate(newDate);
        setFocusedDate(null);
    };
    const onGridFocusDateHandler = (date) => {
        if (date) {
            setFocusedDate(date ? focusedDateCache(date) : null);
        }
    };
    const onGridSelectDateHandler = (date) => {
        fireNonCancelableEvent(onChange, { value: formatDate(date, granularity) });
        setFocusedDate(null);
    };
    const onGridBlur = (event) => {
        var _a;
        const newFocusTargetIsInGrid = event.relatedTarget && ((_a = gridWrapperRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.relatedTarget));
        if (!newFocusTargetIsInGrid) {
            setFocusedDate(null);
        }
    };
    const onGridKeyDownHandler = useCalendarGridKeyboardNavigation({
        baseDate,
        focusableDate,
        granularity,
        isDateEnabled,
        isDateFocusable,
        onChangePage: onChangePageHandler,
        onFocusDate: onGridFocusDateHandler,
        onSelectDate: onGridSelectDateHandler,
    });
    const headerText = renderHeaderText(baseDate);
    return (React.createElement("div", Object.assign({ ref: __internalRootRef }, baseProps, { role: "group", "aria-label": ariaLabel, "aria-labelledby": ariaLabelledby, "aria-describedby": ariaDescribedby, className: clsx(styles.root, styles.calendar, baseProps.className) }),
        React.createElement("div", { className: styles['calendar-inner'] },
            React.createElement(CalendarHeader, { formattedDate: headerText, onChange: onHeaderChangePageHandler, previousLabel: previousButtonLabel, nextLabel: nextButtonLabel, headingId: headingId }),
            React.createElement("div", { onBlur: onGridBlur, ref: gridWrapperRef },
                React.createElement(Grid, { isDateEnabled: isDateEnabled, dateDisabledReason: dateDisabledReason, focusedDate: focusedDate, focusableDate: focusableDate, onSelectDate: onGridSelectDateHandler, onFocusDate: onGridFocusDateHandler, onChangePage: onChangePageHandler, selectedDate: memoizedValue, ariaLabelledby: headingId, header: isMonthPicker ? null : React.createElement(CalendarGridHeader, { locale: normalizedLocale, rows: gridRows }), rows: gridRows, isCurrentPage: isCurrentPage, renderDate: renderDate, renderDateAnnouncement: renderDateAnnouncement, isSameDate: isSameDate, onGridKeyDownHandler: onGridKeyDownHandler })))));
}
//# sourceMappingURL=internal.js.map