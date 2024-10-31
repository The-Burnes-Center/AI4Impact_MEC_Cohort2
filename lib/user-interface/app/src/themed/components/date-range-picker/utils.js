// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { joinDateTime, splitDateTime } from '../internal/utils/date-time';
import { normalizeTimeString } from '../internal/utils/date-time/join-date-time';
import { setTimeOffset } from './time-offset';
export function formatValue(value, { timeOffset, dateOnly }) {
    if (!value || value.type === 'relative') {
        return value;
    }
    if (dateOnly) {
        return {
            type: 'absolute',
            startDate: value.startDate.split('T')[0],
            endDate: value.endDate.split('T')[0],
        };
    }
    return setTimeOffset(value, timeOffset);
}
export function getDefaultMode(value, relativeOptions, rangeSelectorMode) {
    if (value && value.type) {
        return value.type;
    }
    if (rangeSelectorMode === 'relative-only') {
        return 'relative';
    }
    if (rangeSelectorMode === 'absolute-only') {
        return 'absolute';
    }
    return relativeOptions.length > 0 ? 'relative' : 'absolute';
}
export function splitAbsoluteValue(value) {
    if (!value) {
        return {
            start: { date: '', time: '' },
            end: { date: '', time: '' },
        };
    }
    return { start: splitDateTime(value.startDate), end: splitDateTime(value.endDate) };
}
export function joinAbsoluteValue(value) {
    const startTime = normalizeTimeString(value.start.time || '00:00:00');
    const endTime = normalizeTimeString(value.end.time || '23:59:59');
    return {
        type: 'absolute',
        startDate: joinDateTime(value.start.date, startTime),
        endDate: joinDateTime(value.end.date, endTime),
    };
}
//# sourceMappingURL=utils.js.map