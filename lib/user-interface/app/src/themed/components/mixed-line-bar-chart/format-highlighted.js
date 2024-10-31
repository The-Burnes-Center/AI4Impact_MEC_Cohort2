// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { isDataSeries, isXThreshold, isYThreshold, matchesX } from './utils';
/** Formats provided x-position and its corresponding series values. */
export default function formatHighlighted({ position, series, xTickFormatter, detailPopoverSeriesContent, }) {
    const formattedPosition = xTickFormatter ? xTickFormatter(position) : position.toString();
    const details = [];
    series.forEach(s => {
        const detail = getSeriesDetail({ internalSeries: s, targetX: position, detailPopoverSeriesContent });
        if (detail) {
            details.push(detail);
        }
    });
    return { position: formattedPosition, details };
}
function getSeriesDetail({ internalSeries, targetX, detailPopoverSeriesContent, }) {
    var _a;
    const { series, color } = internalSeries;
    // X-thresholds are only shown when X matches.
    if (isXThreshold(series)) {
        return series.x === targetX
            ? {
                key: series.title,
                value: '',
                color,
                markerType: 'dashed',
            }
            : null;
    }
    if (isYThreshold(series)) {
        return {
            key: series.title,
            value: series.valueFormatter ? series.valueFormatter(series.y) : series.y,
            color,
            markerType: 'dashed',
        };
    }
    if (isDataSeries(series)) {
        for (const datum of series.data) {
            if (matchesX(targetX, datum.x)) {
                const customContent = detailPopoverSeriesContent
                    ? detailPopoverSeriesContent({ series, x: targetX, y: datum.y })
                    : undefined;
                const hasSubItems = !!((_a = customContent === null || customContent === void 0 ? void 0 : customContent.subItems) === null || _a === void 0 ? void 0 : _a.length);
                const isExpandable = (customContent === null || customContent === void 0 ? void 0 : customContent.expandable) && hasSubItems;
                const isKeyString = typeof (customContent === null || customContent === void 0 ? void 0 : customContent.key) === 'string';
                const key = (customContent === null || customContent === void 0 ? void 0 : customContent.key) && (!isExpandable || isKeyString) ? customContent.key : series.title;
                if ((customContent === null || customContent === void 0 ? void 0 : customContent.expandable) && !hasSubItems) {
                    warnOnce('MixedLineBarChart', '`expandable` was set to `true` for a series without sub-items. This property will be ignored.');
                }
                if (isExpandable && !isKeyString) {
                    warnOnce('MixedLineBarChart', 'A ReactNode was used for the key of an expandable series. The series title will be used instead because nested interactive elements can cause accessiblity issues.');
                }
                if (!isKeyString && !isExpandable && (customContent === null || customContent === void 0 ? void 0 : customContent.value) && typeof customContent.value !== 'string') {
                    warnOnce('MixedLineBarChart', 'Use a ReactNode for the key or the value of a series, but not for both. It is not recommended to use links for key and value at the same time.');
                }
                return {
                    key,
                    value: (customContent === null || customContent === void 0 ? void 0 : customContent.value) || (series.valueFormatter ? series.valueFormatter(datum.y, targetX) : datum.y),
                    color,
                    markerType: series.type === 'line' ? 'line' : 'rectangle',
                    subItems: customContent === null || customContent === void 0 ? void 0 : customContent.subItems,
                    expandableId: isExpandable ? series.title : undefined,
                };
            }
        }
    }
    return null;
}
//# sourceMappingURL=format-highlighted.js.map