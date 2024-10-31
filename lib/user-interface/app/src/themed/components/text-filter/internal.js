import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import InternalInput from '../input/internal';
import { getBaseProps } from '../internal/base-component';
import { useTableComponentsContext } from '../internal/context/table-component-context';
import { fireNonCancelableEvent } from '../internal/events';
import useForwardFocus from '../internal/hooks/forward-focus';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';
import { SearchResults } from './search-results';
import styles from './styles.css.js';
const InternalTextFilter = React.forwardRef((_a, ref) => {
    var _b;
    var { filteringText, filteringAriaLabel, filteringPlaceholder, filteringClearAriaLabel, controlId, ariaLabelledby, ariaDescribedby, disabled, countText, disableBrowserAutocorrect, onChange, onDelayedChange, __internalRootRef } = _a, rest = __rest(_a, ["filteringText", "filteringAriaLabel", "filteringPlaceholder", "filteringClearAriaLabel", "controlId", "ariaLabelledby", "ariaDescribedby", "disabled", "countText", "disableBrowserAutocorrect", "onChange", "onDelayedChange", "__internalRootRef"]);
    const baseProps = getBaseProps(rest);
    const inputRef = useRef(null);
    useForwardFocus(ref, inputRef);
    const searchResultsId = useUniqueId('text-filter-search-results');
    const showResults = filteringText && countText && !disabled;
    const tableComponentContext = useTableComponentsContext();
    if ((_b = tableComponentContext === null || tableComponentContext === void 0 ? void 0 : tableComponentContext.filterRef) === null || _b === void 0 ? void 0 : _b.current) {
        tableComponentContext.filterRef.current.filterText = filteringText;
    }
    return (React.createElement("div", Object.assign({}, baseProps, { className: clsx(baseProps.className, styles.root), ref: __internalRootRef }),
        React.createElement(InternalInput, { __inheritFormFieldProps: true, disableBrowserAutocorrect: disableBrowserAutocorrect, ref: inputRef, className: styles.input, type: "search", ariaLabel: filteringAriaLabel, placeholder: filteringPlaceholder, value: filteringText, disabled: disabled, controlId: controlId, ariaLabelledby: ariaLabelledby, ariaDescribedby: joinStrings(showResults ? searchResultsId : undefined, ariaDescribedby), autoComplete: false, clearAriaLabel: filteringClearAriaLabel, onChange: event => fireNonCancelableEvent(onChange, { filteringText: event.detail.value }), __onDelayedInput: event => fireNonCancelableEvent(onDelayedChange, { filteringText: event.detail.value }) }),
        showResults ? React.createElement(SearchResults, { id: searchResultsId }, countText) : null));
});
export default InternalTextFilter;
//# sourceMappingURL=internal.js.map