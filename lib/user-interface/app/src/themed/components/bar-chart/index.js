import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalMixedLineBarChart from '../mixed-line-bar-chart/internal';
import styles from './styles.css.js';
function BarChart(_a) {
    var { series = [], height = 500, xScaleType = 'categorical', yScaleType = 'linear', stackedBars = false, horizontalBars = false, detailPopoverSize = 'medium', statusType = 'finished', emphasizeBaselineAxis = true, detailPopoverSeriesContent } = _a, props = __rest(_a, ["series", "height", "xScaleType", "yScaleType", "stackedBars", "horizontalBars", "detailPopoverSize", "statusType", "emphasizeBaselineAxis", "detailPopoverSeriesContent"]);
    const baseComponentProps = useBaseComponent('BarChart', {
        props: {
            detailPopoverSize,
            emphasizeBaselineAxis,
            fitHeight: props.fitHeight,
            hideFilter: props.hideFilter,
            hideLegend: props.hideLegend,
            horizontalBars,
            stackedBars,
            xScaleType,
            yScaleType,
        },
    });
    const baseProps = getBaseProps(props);
    const className = clsx(baseProps.className, styles.root);
    return (React.createElement(InternalMixedLineBarChart, Object.assign({}, props, baseComponentProps, { className: className, height: height, xScaleType: xScaleType, yScaleType: yScaleType, stackedBars: stackedBars, horizontalBars: horizontalBars, series: series, detailPopoverSize: detailPopoverSize, statusType: statusType, emphasizeBaselineAxis: emphasizeBaselineAxis, detailPopoverSeriesContent: detailPopoverSeriesContent })));
}
applyDisplayName(BarChart, 'BarChart');
export default BarChart;
//# sourceMappingURL=index.js.map