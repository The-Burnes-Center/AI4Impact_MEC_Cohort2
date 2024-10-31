// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import expandabeleSectionHeaderStyles from '../../../expandable-section/styles.css.js';
import styles from './styles.css.js';
export default function getSeriesDetailsText(element) {
    const elementsWithText = Array.from(element.querySelectorAll(`.${styles.announced},.${expandabeleSectionHeaderStyles.header}`));
    return elementsWithText
        .map(element => {
        var _a;
        if (element instanceof HTMLElement) {
            return (_a = element.innerText) === null || _a === void 0 ? void 0 : _a.split('\n').map(s => s.trim()).join(' ').trim();
        }
    })
        .filter(Boolean)
        .join(', ');
}
//# sourceMappingURL=series-details-text.js.map