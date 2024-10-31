// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { memo, useRef } from 'react';
import clsx from 'clsx';
import { getIsRtl } from '@cloudscape-design/component-toolkit/internal';
import { useInternalI18n } from '../../../i18n/context';
import ResponsiveText from '../responsive-text';
import { TICK_LENGTH, TICK_LINE_HEIGHT, TICK_MARGIN } from './constants';
import { formatTicks, getSVGTextSize, getVisibleTicks } from './label-utils';
import styles from './styles.css.js';
const OFFSET_PX = 12;
export default memo(InlineStartLabels);
// Renders the visible tick labels on the value axis, as well as their grid lines.
function InlineStartLabels({ axis = 'y', plotWidth, plotHeight, maxLabelsWidth = Number.POSITIVE_INFINITY, scale, ticks, tickFormatter, title, ariaRoleDescription, }) {
    const i18n = useInternalI18n('[charts]');
    const virtualTextRef = useRef(null);
    const yOffset = axis === 'x' && scale.isCategorical() ? Math.max(0, scale.d3Scale.bandwidth() - 1) / 2 : 0;
    const labelToBoxCache = useRef({});
    const getLabelSpace = (label) => {
        var _a, _b, _c, _d;
        if (labelToBoxCache.current[label] !== undefined) {
            return (_b = (_a = labelToBoxCache.current[label]) === null || _a === void 0 ? void 0 : _a.height) !== null && _b !== void 0 ? _b : 0;
        }
        if (virtualTextRef.current) {
            virtualTextRef.current.textContent = label;
        }
        labelToBoxCache.current[label] = getSVGTextSize(virtualTextRef.current);
        return (_d = (_c = labelToBoxCache.current[label]) === null || _c === void 0 ? void 0 : _c.height) !== null && _d !== void 0 ? _d : 0;
    };
    const formattedTicks = formatTicks({ ticks, scale, getLabelSpace, tickFormatter });
    if (virtualTextRef.current) {
        virtualTextRef.current.textContent = '';
    }
    const from = 0 - OFFSET_PX - yOffset;
    const until = plotHeight + OFFSET_PX - yOffset;
    const visibleTicks = getVisibleTicks(formattedTicks, from, until);
    const isRtl = virtualTextRef.current ? getIsRtl(virtualTextRef.current) : false;
    return (React.createElement("g", { className: styles['labels-inline-start'], "aria-label": title, role: "list", "aria-roledescription": i18n('i18nStrings.chartAriaRoleDescription', ariaRoleDescription), "aria-hidden": true },
        visibleTicks.map(({ position, lines }, index) => isFinite(position) && (React.createElement("g", { key: index, role: "listitem", transform: `translate(0,${position + yOffset})`, className: clsx(styles.ticks, axis === 'x' ? styles['ticks--x'] : styles['ticks--y']) },
            axis === 'y' && (React.createElement("line", { className: clsx(styles.grid, styles.ticks_line), x1: -TICK_LENGTH, y1: 0, x2: plotWidth, y2: 0, "aria-hidden": "true" })),
            lines.map((line, lineIndex) => {
                var _a, _b;
                const x = -(TICK_LENGTH + TICK_MARGIN);
                const lineTextProps = {
                    x: !isRtl ? x : plotWidth - x,
                    y: (lineIndex - (lines.length - 1) * 0.5) * TICK_LINE_HEIGHT,
                    className: styles.ticks__text,
                    children: line,
                };
                return ((_b = (_a = labelToBoxCache.current[lines[0]]) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : 0) > maxLabelsWidth ? (React.createElement(ResponsiveText, Object.assign({ key: lineIndex }, lineTextProps, { maxWidth: maxLabelsWidth }))) : (React.createElement("text", Object.assign({ key: lineIndex }, lineTextProps)));
            })))),
        React.createElement("text", { ref: virtualTextRef, x: 0, y: 0, style: { visibility: 'hidden' }, "aria-hidden": "true" })));
}
//# sourceMappingURL=inline-start-labels.js.map