// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { HeaderNextButton, HeaderPrevButton } from './header-button';
import styles from '../styles.css.js';
const CalendarHeader = ({ formattedDate, onChange, previousLabel, nextLabel, headingId }) => {
    return (React.createElement("div", { className: styles['calendar-header'] },
        React.createElement(HeaderPrevButton, { ariaLabel: previousLabel, onChange: onChange }),
        React.createElement("h2", { className: styles['calendar-header-title'], id: headingId }, formattedDate),
        React.createElement(HeaderNextButton, { ariaLabel: nextLabel, onChange: onChange })));
};
export default CalendarHeader;
//# sourceMappingURL=index.js.map