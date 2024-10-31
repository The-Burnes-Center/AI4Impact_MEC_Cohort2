// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import InternalButton from '../button/internal';
import InternalCheckbox from '../checkbox/internal';
import { FormFieldContext } from '../internal/context/form-field-context';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import EmbeddedMultiselect from '../multiselect/embedded';
import { filterOptions } from './filter-options';
import { useLoadItems } from './use-load-items';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
export function PropertyEditorContentCustom({ property, operator, filter, value, onChange, operatorForm, }) {
    const labelId = useUniqueId();
    return (React.createElement("div", { className: styles['property-editor'] },
        React.createElement("div", { className: styles['property-editor-header'], id: labelId }, property.groupValuesLabel),
        React.createElement("div", { className: styles['property-editor-form'] },
            React.createElement(FormFieldContext.Provider, { value: { ariaLabelledby: labelId } }, operatorForm({ value, onChange, operator, filter })))));
}
export function PropertyEditorContentEnum({ property, filter, value: unknownValue, onChange, asyncProps, filteringOptions, onLoadItems, }) {
    const valueOptions = filteringOptions
        .filter(option => { var _a; return ((_a = option.property) === null || _a === void 0 ? void 0 : _a.propertyKey) === property.propertyKey; })
        .map(({ label, value }) => ({ label, value }));
    const valueHandlers = useLoadItems(onLoadItems, '', property.externalProperty);
    const value = !unknownValue ? [] : Array.isArray(unknownValue) ? unknownValue : [unknownValue];
    const selectedOptions = valueOptions.filter(option => value.includes(option.value));
    const filteredOptions = filterOptions(valueOptions, filter);
    return (React.createElement("div", { className: clsx(styles['property-editor'], styles['property-editor-enum']) },
        filteredOptions.length === 0 && (React.createElement("div", { className: styles['property-editor-header-enum'] },
            React.createElement(InternalCheckbox, { checked: false, readOnly: true }),
            property.groupValuesLabel)),
        React.createElement(EmbeddedMultiselect, Object.assign({ filteringType: "manual", selectedOptions: selectedOptions, onChange: e => onChange(e.detail.selectedOptions.map(o => o.value)), options: filteredOptions.length > 0 ? [{ options: filteredOptions, label: property.groupValuesLabel }] : [], filteringText: filter, ariaLabel: property.groupValuesLabel, statusType: "finished", noMatch: asyncProps.empty }, valueHandlers, asyncProps))));
}
export function PropertyEditorFooter({ property, operator, value, onCancel, onSubmit, i18nStrings, }) {
    const submitToken = () => onSubmit({ property, operator, value });
    return (React.createElement("div", { className: styles['property-editor-actions'] },
        React.createElement(InternalButton, { variant: "link", className: clsx(styles['property-editor-cancel'], testUtilStyles['property-editor-cancel']), onClick: onCancel }, i18nStrings.cancelActionText),
        React.createElement(InternalButton, { className: testUtilStyles['property-editor-submit'], onClick: submitToken }, i18nStrings.applyActionText)));
}
//# sourceMappingURL=property-editor.js.map