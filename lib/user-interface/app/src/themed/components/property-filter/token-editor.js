// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import clsx from 'clsx';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import InternalButton from '../button/internal.js';
import InternalButtonDropdown from '../button-dropdown/internal.js';
import InternalFormField from '../form-field/internal.js';
import { FormFieldContext } from '../internal/context/form-field-context.js';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller.js';
import { useMobile } from '../internal/hooks/use-mobile/index.js';
import { useUniqueId } from '../internal/hooks/use-unique-id/index.js';
import { getAllowedOperators } from './controller.js';
import { OperatorInput, PropertyInput, ValueInput } from './token-editor-inputs.js';
import styles from './styles.css.js';
import testUtilStyles from './test-classes/styles.css.js';
export function TokenEditor({ supportsGroups, asyncProperties, asyncProps, customGroupsText, freeTextFiltering, filteringProperties, filteringOptions, i18nStrings, onLoadItems, onSubmit, onDismiss, tokensToCapture, onTokenCapture, onTokenRelease, tempGroup, onChangeTempGroup, }) {
    var _a;
    const [nextFocusIndex, setNextFocusIndex] = useState(null);
    const tokenListRef = useListFocusController({
        nextFocusIndex,
        onFocusMoved: target => {
            target.focus();
            setNextFocusIndex(null);
        },
        listItemSelector: `.${styles['token-editor-field-property']}`,
        fallbackSelector: `.${styles['token-editor-add-token']}`,
    });
    const groups = tempGroup.map((temporaryToken, index) => {
        const setTemporaryToken = (newToken) => {
            var _a;
            const copy = [...tempGroup];
            copy[index] = newToken;
            if (((_a = newToken.property) === null || _a === void 0 ? void 0 : _a.getTokenType(newToken.operator)) === 'enum' && newToken.value === null) {
                newToken.value = [];
            }
            onChangeTempGroup(copy);
        };
        const property = temporaryToken.property;
        const onChangePropertyKey = (newPropertyKey) => {
            var _a;
            const filteringProperty = filteringProperties.reduce((acc, property) => (property.propertyKey === newPropertyKey ? property : acc), undefined);
            const allowedOperators = filteringProperty ? getAllowedOperators(filteringProperty) : freeTextFiltering.operators;
            const operator = temporaryToken.operator && allowedOperators.indexOf(temporaryToken.operator) !== -1
                ? temporaryToken.operator
                : allowedOperators[0];
            const matchedProperty = (_a = filteringProperties.find(property => property.propertyKey === newPropertyKey)) !== null && _a !== void 0 ? _a : null;
            setTemporaryToken(Object.assign(Object.assign({}, temporaryToken), { property: matchedProperty, operator, value: null }));
        };
        const operator = temporaryToken.operator;
        const onChangeOperator = (newOperator) => {
            const currentOperatorTokenType = property === null || property === void 0 ? void 0 : property.getTokenType(operator);
            const newOperatorTokenType = property === null || property === void 0 ? void 0 : property.getTokenType(newOperator);
            const shouldClearValue = currentOperatorTokenType !== newOperatorTokenType;
            const value = shouldClearValue ? null : temporaryToken.value;
            setTemporaryToken(Object.assign(Object.assign({}, temporaryToken), { operator: newOperator, value }));
        };
        const value = temporaryToken.value;
        const onChangeValue = (newValue) => {
            setTemporaryToken(Object.assign(Object.assign({}, temporaryToken), { value: newValue }));
        };
        return { token: temporaryToken, property, onChangePropertyKey, operator, onChangeOperator, value, onChangeValue };
    });
    return (React.createElement("div", { className: styles['token-editor'], ref: tokenListRef },
        React.createElement(TokenEditorFields, { supportsGroups: supportsGroups, tokens: groups.map(group => group.token), onRemove: index => {
                const updated = tempGroup.filter((_, existingIndex) => existingIndex !== index);
                onChangeTempGroup(updated);
                setNextFocusIndex(index);
            }, onRemoveFromGroup: index => {
                const releasedToken = tempGroup[index];
                const updated = tempGroup.filter((_, existingIndex) => existingIndex !== index);
                onChangeTempGroup(updated);
                onTokenRelease(releasedToken);
                setNextFocusIndex(index);
            }, onSubmit: onSubmit, renderProperty: index => (React.createElement(PropertyInput, { property: groups[index].property, onChangePropertyKey: groups[index].onChangePropertyKey, asyncProps: asyncProperties ? asyncProps : null, filteringProperties: filteringProperties, onLoadItems: onLoadItems, customGroupsText: customGroupsText, i18nStrings: i18nStrings, freeTextFiltering: freeTextFiltering })), renderOperator: index => (React.createElement(OperatorInput, { property: groups[index].property, operator: groups[index].operator, onChangeOperator: groups[index].onChangeOperator, i18nStrings: i18nStrings, freeTextFiltering: freeTextFiltering, triggerVariant: supportsGroups ? 'label' : 'option' })), renderValue: index => (React.createElement(ValueInput, { property: groups[index].property, operator: groups[index].operator, value: groups[index].value, onChangeValue: groups[index].onChangeValue, asyncProps: asyncProps, filteringOptions: filteringOptions, onLoadItems: onLoadItems, i18nStrings: i18nStrings })), i18nStrings: i18nStrings }),
        supportsGroups && (React.createElement("div", { className: clsx(styles['token-editor-add-token'], testUtilStyles['token-editor-token-add-actions']) },
            React.createElement(InternalButtonDropdown, { variant: "normal", ariaLabel: i18nStrings.tokenEditorAddTokenActionsAriaLabel, items: tokensToCapture.map((token, index) => {
                    var _a, _b, _c, _d;
                    return {
                        id: index.toString(),
                        text: (_b = (_a = i18nStrings.tokenEditorAddExistingTokenLabel) === null || _a === void 0 ? void 0 : _a.call(i18nStrings, token)) !== null && _b !== void 0 ? _b : '',
                        ariaLabel: (_d = (_c = i18nStrings.tokenEditorAddExistingTokenAriaLabel) === null || _c === void 0 ? void 0 : _c.call(i18nStrings, token)) !== null && _d !== void 0 ? _d : '',
                    };
                }), onItemClick: ({ detail }) => {
                    const index = parseInt(detail.id);
                    if (!isNaN(index) && tokensToCapture[index]) {
                        onChangeTempGroup([...tempGroup, Object.assign({}, tokensToCapture[index])]);
                        setNextFocusIndex(groups.length);
                        onTokenCapture(tokensToCapture[index]);
                    }
                }, disabled: tokensToCapture.length === 0, showMainActionOnly: tokensToCapture.length === 0, mainAction: {
                    text: (_a = i18nStrings.tokenEditorAddNewTokenLabel) !== null && _a !== void 0 ? _a : '',
                    onClick: () => {
                        var _a;
                        const lastTokenInGroup = tempGroup[tempGroup.length - 1];
                        const property = lastTokenInGroup ? lastTokenInGroup.property : null;
                        const operator = (_a = property === null || property === void 0 ? void 0 : property.defaultOperator) !== null && _a !== void 0 ? _a : ':';
                        onChangeTempGroup([...tempGroup, { property, operator, value: null }]);
                        setNextFocusIndex(groups.length);
                    },
                } }))),
        React.createElement("div", { className: styles['token-editor-actions'] },
            React.createElement("span", Object.assign({}, getAnalyticsMetadataAttribute({
                action: 'editCancel',
            })),
                React.createElement(InternalButton, { formAction: "none", variant: "link", className: clsx(styles['token-editor-cancel'], testUtilStyles['token-editor-cancel']), onClick: onDismiss }, i18nStrings.cancelActionText)),
            React.createElement("span", Object.assign({}, getAnalyticsMetadataAttribute({
                action: 'editConfirm',
            })),
                React.createElement(InternalButton, { className: clsx(styles['token-editor-submit'], testUtilStyles['token-editor-submit']), formAction: "none", onClick: onSubmit }, i18nStrings.applyActionText)))));
}
function TokenEditorFields({ tokens, supportsGroups, onRemove, onRemoveFromGroup, onSubmit, renderProperty, renderOperator, renderValue, i18nStrings, }) {
    const isMobile = useMobile();
    const isNarrow = isMobile || !supportsGroups;
    const propertyLabelId = useUniqueId();
    const operatorLabelId = useUniqueId();
    const valueLabelId = useUniqueId();
    const headers = (React.createElement("div", { className: styles['token-editor-grid-group'] },
        React.createElement("div", { id: propertyLabelId, className: styles['token-editor-grid-header'] }, i18nStrings.propertyText),
        React.createElement("div", { id: operatorLabelId, className: styles['token-editor-grid-header'] }, i18nStrings.operatorText),
        React.createElement("div", { id: valueLabelId, className: styles['token-editor-grid-header'] }, i18nStrings.valueText),
        React.createElement("div", { className: styles['token-editor-grid-header'] })));
    return (React.createElement("form", { className: clsx(styles['token-editor-grid'], isNarrow && styles['token-editor-narrow'], styles['token-editor-form']), onSubmit: event => {
            event.preventDefault();
            onSubmit();
        } },
        !isNarrow && headers,
        tokens.map((token, index) => {
            var _a, _b, _c, _d, _e, _f;
            return (React.createElement("div", { key: index, role: "group", "aria-label": i18nStrings.formatToken(token).formattedText, className: clsx(styles['token-editor-grid-group'], supportsGroups && styles['token-editor-supports-groups']) },
                React.createElement("div", { className: clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow']) },
                    React.createElement(TokenEditorField, { isNarrow: isNarrow, label: i18nStrings.propertyText, labelId: propertyLabelId, className: clsx(styles['token-editor-field-property'], testUtilStyles['token-editor-field-property']), index: index }, renderProperty(index))),
                React.createElement("div", { className: clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow']) },
                    React.createElement(TokenEditorField, { isNarrow: isNarrow, label: i18nStrings.operatorText, labelId: operatorLabelId, className: clsx(styles['token-editor-field-operator'], testUtilStyles['token-editor-field-operator']), index: index }, renderOperator(index))),
                React.createElement("div", { className: clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow']) },
                    React.createElement(TokenEditorField, { isNarrow: isNarrow, label: i18nStrings.valueText, labelId: valueLabelId, className: clsx(styles['token-editor-field-value'], testUtilStyles['token-editor-field-value']), index: index }, renderValue(index))),
                supportsGroups && (React.createElement("div", { className: clsx(styles['token-editor-grid-cell'], isNarrow && styles['token-editor-narrow']) },
                    React.createElement("div", { className: styles['token-editor-remove-token'] },
                        React.createElement(TokenEditorRemoveActions, { isNarrow: isNarrow, ariaLabel: (_b = (_a = i18nStrings.tokenEditorTokenActionsAriaLabel) === null || _a === void 0 ? void 0 : _a.call(i18nStrings, token)) !== null && _b !== void 0 ? _b : '', mainActionAriaLabel: (_d = (_c = i18nStrings.tokenEditorTokenRemoveAriaLabel) === null || _c === void 0 ? void 0 : _c.call(i18nStrings, token)) !== null && _d !== void 0 ? _d : '', disabled: tokens.length === 1, items: [
                                {
                                    id: 'remove',
                                    text: (_e = i18nStrings.tokenEditorTokenRemoveLabel) !== null && _e !== void 0 ? _e : '',
                                    disabled: token.standaloneIndex !== undefined,
                                },
                                { id: 'remove-from-group', text: (_f = i18nStrings.tokenEditorTokenRemoveFromGroupLabel) !== null && _f !== void 0 ? _f : '' },
                            ], onItemClick: itemId => {
                                switch (itemId) {
                                    case 'remove':
                                        return onRemove(index);
                                    case 'remove-from-group':
                                        return onRemoveFromGroup(index);
                                }
                            }, index: index }))))));
        })));
}
function TokenEditorField({ isNarrow, label, labelId, children, className, index, }) {
    return isNarrow ? (React.createElement(InternalFormField, { label: label, className: className, stretch: true, "data-testindex": index }, children)) : (React.createElement(FormFieldContext.Provider, { value: { ariaLabelledby: labelId } },
        React.createElement(InternalFormField, { className: className, "data-testindex": index }, children)));
}
function TokenEditorRemoveActions({ isNarrow, ariaLabel, mainActionAriaLabel, disabled, items, onItemClick, index, }) {
    return isNarrow ? (React.createElement(InternalButtonDropdown, { variant: "normal", ariaLabel: ariaLabel, items: items.slice(1), onItemClick: ({ detail }) => onItemClick(detail.id), disabled: disabled, mainAction: {
            text: items[0].text,
            onClick: () => onItemClick(items[0].id),
            disabled,
            ariaLabel: mainActionAriaLabel,
        }, className: testUtilStyles['token-editor-token-remove-actions'], "data-testindex": index })) : (React.createElement(InternalButtonDropdown, { variant: "icon", ariaLabel: ariaLabel, items: items, onItemClick: ({ detail }) => onItemClick(detail.id), disabled: disabled, className: testUtilStyles['token-editor-token-remove-actions'], "data-testindex": index }));
}
//# sourceMappingURL=token-editor.js.map