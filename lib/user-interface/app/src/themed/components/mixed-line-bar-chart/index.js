import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import InternalMixedLineBarChart from './internal';
function MixedLineBarChart(_a) {
    var { series = [], height = 500, xScaleType = 'linear', yScaleType = 'linear', stackedBars = false, horizontalBars = false, statusType = 'finished', detailPopoverSize = 'medium', emphasizeBaselineAxis = true } = _a, props = __rest(_a, ["series", "height", "xScaleType", "yScaleType", "stackedBars", "horizontalBars", "statusType", "detailPopoverSize", "emphasizeBaselineAxis"]);
    const baseComponentProps = useBaseComponent('MixedLineBarChart', {
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
    return (React.createElement(InternalMixedLineBarChart, Object.assign({ series: series, height: height, xScaleType: xScaleType, yScaleType: yScaleType, stackedBars: stackedBars, horizontalBars: horizontalBars, statusType: statusType, detailPopoverSize: detailPopoverSize, emphasizeBaselineAxis: emphasizeBaselineAxis }, props, baseComponentProps)));
}
applyDisplayName(MixedLineBarChart, 'MixedLineBarChart');
export default MixedLineBarChart;
//# sourceMappingURL=index.js.map