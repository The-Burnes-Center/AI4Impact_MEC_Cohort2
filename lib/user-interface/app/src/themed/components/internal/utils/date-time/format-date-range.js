// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import formatDateIso from './format-date-iso';
import formatDateLocalized from './format-date-localized';
import { isIsoDateOnly } from './is-iso-date-only';
export function formatDateRange({ startDate, endDate, timeOffset, hideTimeOffset, format, locale, }) {
    const isDateOnly = isIsoDateOnly(startDate) && isIsoDateOnly(endDate);
    return (formatDate({
        date: startDate,
        format,
        hideTimeOffset,
        isDateOnly,
        timeOffset: timeOffset.startDate,
        locale,
    }) +
        ' — ' +
        formatDate({
            date: endDate,
            format,
            hideTimeOffset,
            isDateOnly,
            timeOffset: timeOffset.endDate,
            locale,
        }));
}
function formatDate({ date, format, hideTimeOffset, isDateOnly, timeOffset, locale, }) {
    switch (format) {
        case 'long-localized': {
            return formatDateLocalized({ date, hideTimeOffset, isDateOnly, locale, timeOffset });
        }
        default: {
            return formatDateIso({ date, hideTimeOffset, isDateOnly, timeOffset });
        }
    }
}
//# sourceMappingURL=format-date-range.js.map