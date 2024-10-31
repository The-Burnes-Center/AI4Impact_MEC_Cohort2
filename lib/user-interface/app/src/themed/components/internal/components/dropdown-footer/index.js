// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import InternalLiveRegion from '../../../live-region/internal.js';
import DropdownStatus from '../dropdown-status/index.js';
import styles from './styles.css.js';
const DropdownFooter = ({ content, id, hasItems = true }) => (React.createElement("div", { className: clsx(styles.root, { [styles.hidden]: content === null, [styles['no-items']]: !hasItems }) },
    React.createElement(InternalLiveRegion, { id: id }, content && React.createElement(DropdownStatus, null, content))));
export default DropdownFooter;
//# sourceMappingURL=index.js.map