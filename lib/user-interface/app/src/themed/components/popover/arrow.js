// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import styles from './styles.css.js';
const Arrow = (props) => {
    const isVisualRefresh = useVisualRefresh();
    return (React.createElement("div", { className: clsx(styles.arrow, props.position && styles[`arrow-position-${props.position}`]) },
        React.createElement("div", { className: styles['arrow-outer'] }),
        React.createElement("div", { className: clsx(styles['arrow-inner'], isVisualRefresh && styles.refresh) })));
};
export default React.memo(Arrow);
//# sourceMappingURL=arrow.js.map