// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import customCssProps from '../internal/generated/custom-css-properties/index.js';
import { getStepArray } from './utils.js';
import styles from './styles.css.js';
function TickMark(props) {
    const { hideFillLine, value, isActive, invalid, warning, disabled, type, min, max, step, readOnly } = props;
    const showWarning = warning && !invalid;
    const getType = () => {
        if (type === 'min') {
            return min;
        }
        if (type === 'max') {
            return max;
        }
        return step;
    };
    return (React.createElement("div", { className: clsx(styles.tick, {
            [styles.filled]: !hideFillLine && value > getType(),
            [styles.active]: !hideFillLine && isActive && value > getType(),
            [styles.error]: invalid && !hideFillLine && value > getType(),
            [styles.warning]: showWarning && !hideFillLine && value > getType(),
            [styles['error-active']]: invalid && isActive && !hideFillLine && value > getType(),
            [styles['warning-active']]: showWarning && isActive && !hideFillLine && value > getType(),
            [styles.disabled]: disabled,
            [styles.readonly]: readOnly,
            [styles.middle]: type === 'step',
        }) }));
}
export default function SliderTickMarks(props) {
    const { min, max, step } = props;
    return (React.createElement("div", { className: styles['ticks-wrapper'] },
        React.createElement(TickMark, Object.assign({}, props, { type: "min" })),
        React.createElement("div", { className: styles.ticks, style: {
                [customCssProps.sliderTickCount]: Math.round((max - min) / step),
            } }, getStepArray(step, [min, max]).map((step, index) => (React.createElement(TickMark, Object.assign({}, props, { type: "step", step: step, key: `step-${index}` }))))),
        React.createElement(TickMark, Object.assign({}, props, { type: "max" }))));
}
//# sourceMappingURL=tick-marks.js.map