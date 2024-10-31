import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { InternalButton } from '../button/internal';
import { getBaseProps } from '../internal/base-component';
import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id/index';
import { joinStrings } from '../internal/utils/strings';
import InternalSpaceBetween from '../space-between/internal';
import { SearchResults } from '../text-filter/search-results';
import { getAllowedOperators, getAutosuggestOptions, getQueryActions, parseText } from './controller';
import { usePropertyFilterI18n } from './i18n-utils';
import { PropertyEditorContentCustom, PropertyEditorContentEnum, PropertyEditorFooter } from './property-editor';
import PropertyFilterAutosuggest from './property-filter-autosuggest';
import { TokenButton } from './token';
import { useLoadItems } from './use-load-items';
import tokenListStyles from '../internal/components/token-list/styles.css.js';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
const PropertyFilterInternal = React.forwardRef((_a, ref) => {
    var _b;
    var { disabled, countText, query, hideOperations, onChange, filteringProperties, filteringOptions, customGroupsText, disableFreeTextFiltering, freeTextFiltering, onLoadItems, virtualScroll, customControl, customFilterActions, filteringPlaceholder, filteringAriaLabel, filteringEmpty, filteringLoadingText, filteringFinishedText, filteringErrorText, filteringRecoveryText, filteringConstraintText, filteringStatusType, asyncProperties, tokenLimit, expandToViewport, tokenLimitShowFewerAriaLabel, tokenLimitShowMoreAriaLabel, enableTokenGroups, __internalRootRef } = _a, rest = __rest(_a, ["disabled", "countText", "query", "hideOperations", "onChange", "filteringProperties", "filteringOptions", "customGroupsText", "disableFreeTextFiltering", "freeTextFiltering", "onLoadItems", "virtualScroll", "customControl", "customFilterActions", "filteringPlaceholder", "filteringAriaLabel", "filteringEmpty", "filteringLoadingText", "filteringFinishedText", "filteringErrorText", "filteringRecoveryText", "filteringConstraintText", "filteringStatusType", "asyncProperties", "tokenLimit", "expandToViewport", "tokenLimitShowFewerAriaLabel", "tokenLimitShowMoreAriaLabel", "enableTokenGroups", "__internalRootRef"]);
    const [nextFocusIndex, setNextFocusIndex] = useState(null);
    const tokenListRef = useListFocusController({
        nextFocusIndex,
        onFocusMoved: (target, targetType) => {
            var _a;
            if (targetType === 'fallback') {
                (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus({ preventDropdown: true });
            }
            else {
                target.focus();
            }
            setNextFocusIndex(null);
        },
        listItemSelector: `.${tokenListStyles['list-item']}`,
        showMoreSelector: `.${tokenListStyles.toggle}`,
        fallbackSelector: `.${styles.input}`,
    });
    const mergedRef = useMergeRefs(tokenListRef, __internalRootRef);
    const inputRef = useRef(null);
    const baseProps = getBaseProps(rest);
    const i18nStrings = usePropertyFilterI18n(rest.i18nStrings);
    useImperativeHandle(ref, () => ({ focus: () => { var _a; return (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus(); } }), []);
    const [filteringText, setFilteringText] = useState('');
    const { internalProperties, internalOptions, internalQuery, internalFreeText } = (() => {
        var _a, _b;
        const propertyByKey = filteringProperties.reduce((acc, property) => {
            var _a, _b, _c, _d, _e;
            const extendedOperators = ((_a = property === null || property === void 0 ? void 0 : property.operators) !== null && _a !== void 0 ? _a : []).reduce((acc, operator) => (typeof operator === 'object' ? acc.set(operator.operator, operator) : acc), new Map());
            acc.set(property.key, {
                propertyKey: property.key,
                propertyLabel: (_b = property === null || property === void 0 ? void 0 : property.propertyLabel) !== null && _b !== void 0 ? _b : '',
                groupValuesLabel: (_c = property === null || property === void 0 ? void 0 : property.groupValuesLabel) !== null && _c !== void 0 ? _c : '',
                propertyGroup: property === null || property === void 0 ? void 0 : property.group,
                operators: ((_d = property === null || property === void 0 ? void 0 : property.operators) !== null && _d !== void 0 ? _d : []).map(op => (typeof op === 'string' ? op : op.operator)),
                defaultOperator: (_e = property === null || property === void 0 ? void 0 : property.defaultOperator) !== null && _e !== void 0 ? _e : '=',
                getTokenType: operator => { var _a, _b; return (operator ? (_b = (_a = extendedOperators.get(operator)) === null || _a === void 0 ? void 0 : _a.tokenType) !== null && _b !== void 0 ? _b : 'value' : 'value'); },
                getValueFormatter: operator => { var _a, _b; return (operator ? (_b = (_a = extendedOperators.get(operator)) === null || _a === void 0 ? void 0 : _a.format) !== null && _b !== void 0 ? _b : null : null); },
                getValueFormRenderer: operator => { var _a, _b; return (operator ? (_b = (_a = extendedOperators.get(operator)) === null || _a === void 0 ? void 0 : _a.form) !== null && _b !== void 0 ? _b : null : null); },
                externalProperty: property,
            });
            return acc;
        }, new Map());
        const getProperty = (propertyKey) => { var _a; return (_a = propertyByKey.get(propertyKey)) !== null && _a !== void 0 ? _a : null; };
        const internalOptions = filteringOptions.map(option => {
            var _a, _b;
            return ({
                property: getProperty(option.propertyKey),
                value: option.value,
                label: (_b = (_a = option.label) !== null && _a !== void 0 ? _a : option.value) !== null && _b !== void 0 ? _b : '',
            });
        });
        function transformToken(tokenOrGroup, standaloneIndex) {
            return 'operation' in tokenOrGroup
                ? {
                    operation: tokenOrGroup.operation,
                    tokens: tokenOrGroup.tokens.map(token => transformToken(token)),
                }
                : {
                    standaloneIndex,
                    property: tokenOrGroup.propertyKey ? getProperty(tokenOrGroup.propertyKey) : null,
                    operator: tokenOrGroup.operator,
                    value: tokenOrGroup.value,
                };
        }
        const internalQuery = {
            operation: query.operation,
            tokens: (enableTokenGroups && query.tokenGroups ? query.tokenGroups : query.tokens).map(transformToken),
        };
        const internalFreeText = {
            disabled: disableFreeTextFiltering,
            operators: (_a = freeTextFiltering === null || freeTextFiltering === void 0 ? void 0 : freeTextFiltering.operators) !== null && _a !== void 0 ? _a : [':', '!:'],
            defaultOperator: (_b = freeTextFiltering === null || freeTextFiltering === void 0 ? void 0 : freeTextFiltering.defaultOperator) !== null && _b !== void 0 ? _b : ':',
        };
        return { internalProperties: [...propertyByKey.values()], internalOptions, internalQuery, internalFreeText };
    })();
    const { addToken, updateToken, updateOperation, removeToken, removeAllTokens } = getQueryActions({
        query: internalQuery,
        filteringOptions: internalOptions,
        onChange,
        enableTokenGroups,
    });
    const parsedText = parseText(filteringText, internalProperties, internalFreeText);
    const autosuggestOptions = getAutosuggestOptions(parsedText, internalProperties, internalOptions, customGroupsText, i18nStrings);
    const createToken = (currentText) => {
        const parsedText = parseText(currentText, internalProperties, internalFreeText);
        let newToken;
        switch (parsedText.step) {
            case 'property': {
                newToken = {
                    property: parsedText.property,
                    operator: parsedText.operator,
                    value: parsedText.value,
                };
                break;
            }
            case 'free-text': {
                newToken = {
                    property: null,
                    operator: parsedText.operator || internalFreeText.defaultOperator,
                    value: parsedText.value,
                };
                break;
            }
            case 'operator': {
                newToken = {
                    property: null,
                    operator: internalFreeText.defaultOperator,
                    value: currentText,
                };
                break;
            }
        }
        if (internalFreeText.disabled && !newToken.property) {
            return;
        }
        addToken(newToken);
        setFilteringText('');
    };
    const getLoadMoreDetail = (parsedText, filteringText) => {
        const loadMoreDetail = {
            filteringProperty: undefined,
            filteringText,
            filteringOperator: undefined,
        };
        if (parsedText.step === 'property') {
            loadMoreDetail.filteringProperty = parsedText.property.externalProperty;
            loadMoreDetail.filteringText = parsedText.value;
            loadMoreDetail.filteringOperator = parsedText.operator;
        }
        return loadMoreDetail;
    };
    const loadMoreDetail = getLoadMoreDetail(parsedText, filteringText);
    const inputLoadItemsHandlers = useLoadItems(onLoadItems, loadMoreDetail.filteringText, loadMoreDetail.filteringProperty, loadMoreDetail.filteringText, loadMoreDetail.filteringOperator);
    const asyncProps = {
        empty: filteringEmpty,
        loadingText: filteringLoadingText,
        finishedText: filteringFinishedText,
        errorText: filteringErrorText,
        recoveryText: filteringRecoveryText,
        statusType: filteringStatusType,
    };
    const asyncAutosuggestProps = !!filteringText.length || asyncProperties
        ? Object.assign(Object.assign({}, inputLoadItemsHandlers), asyncProps) : {};
    const handleSelected = event => {
        var _a;
        const { detail: option } = event;
        const value = option.value || '';
        if (!value) {
            return;
        }
        if (!('keepOpenOnSelect' in option)) {
            createToken(value);
            return;
        }
        // stop dropdown from closing
        event.preventDefault();
        const parsedText = parseText(value, internalProperties, internalFreeText);
        const loadMoreDetail = getLoadMoreDetail(parsedText, value);
        // Insert operator automatically if only one operator is defined for the given property.
        if (parsedText.step === 'operator') {
            const operators = getAllowedOperators(parsedText.property);
            if (value.trim() === parsedText.property.propertyLabel && operators.length === 1) {
                loadMoreDetail.filteringProperty = (_a = parsedText.property.externalProperty) !== null && _a !== void 0 ? _a : undefined;
                loadMoreDetail.filteringOperator = operators[0];
                loadMoreDetail.filteringText = '';
                setFilteringText(parsedText.property.propertyLabel + ' ' + operators[0] + ' ');
            }
        }
        fireNonCancelableEvent(onLoadItems, Object.assign(Object.assign({}, loadMoreDetail), { firstPage: true, samePage: false }));
    };
    const propertyStep = parsedText.step === 'property' ? parsedText : null;
    const customValueKey = propertyStep ? propertyStep.property.propertyKey + ':' + propertyStep.operator : '';
    const [customFormValueRecord, setCustomFormValueRecord] = useState({});
    const customFormValue = customValueKey in customFormValueRecord ? customFormValueRecord[customValueKey] : null;
    const setCustomFormValue = (value) => setCustomFormValueRecord({ [customValueKey]: value });
    const operatorForm = propertyStep && propertyStep.property.getValueFormRenderer(propertyStep.operator);
    const isEnumValue = (propertyStep === null || propertyStep === void 0 ? void 0 : propertyStep.property.getTokenType(propertyStep.operator)) === 'enum';
    const searchResultsId = useUniqueId('property-filter-search-results');
    const constraintTextId = useUniqueId('property-filter-constraint');
    const textboxAriaDescribedBy = filteringConstraintText
        ? joinStrings(rest.ariaDescribedby, constraintTextId)
        : rest.ariaDescribedby;
    const showResults = !!((_b = internalQuery.tokens) === null || _b === void 0 ? void 0 : _b.length) && !disabled && !!countText;
    return (React.createElement("div", Object.assign({}, baseProps, { className: clsx(baseProps.className, styles.root), ref: mergedRef }),
        React.createElement("div", { className: clsx(styles['search-field'], analyticsSelectors['search-field']) },
            customControl && React.createElement("div", { className: styles['custom-control'] }, customControl),
            React.createElement("div", { className: styles['input-wrapper'] },
                React.createElement(PropertyFilterAutosuggest, Object.assign({ ref: inputRef, virtualScroll: virtualScroll, enteredTextLabel: i18nStrings.enteredTextLabel, ariaLabel: filteringAriaLabel !== null && filteringAriaLabel !== void 0 ? filteringAriaLabel : i18nStrings.filteringAriaLabel, placeholder: filteringPlaceholder !== null && filteringPlaceholder !== void 0 ? filteringPlaceholder : i18nStrings.filteringPlaceholder, ariaLabelledby: rest.ariaLabelledby, ariaDescribedby: textboxAriaDescribedBy, controlId: rest.controlId, value: filteringText, disabled: disabled }, autosuggestOptions, { onChange: event => setFilteringText(event.detail.value), empty: filteringEmpty }, asyncAutosuggestProps, { expandToViewport: expandToViewport, onOptionClick: handleSelected, customForm: operatorForm || isEnumValue
                        ? {
                            content: operatorForm ? (React.createElement(PropertyEditorContentCustom, { key: customValueKey, property: propertyStep.property, operator: propertyStep.operator, filter: propertyStep.value, operatorForm: operatorForm, value: customFormValue, onChange: setCustomFormValue })) : (React.createElement(PropertyEditorContentEnum, { key: customValueKey, property: propertyStep.property, filter: propertyStep.value, value: customFormValue, onChange: setCustomFormValue, asyncProps: asyncProps, filteringOptions: internalOptions, onLoadItems: inputLoadItemsHandlers.onLoadItems })),
                            footer: (React.createElement(PropertyEditorFooter, { key: customValueKey, property: propertyStep.property, operator: propertyStep.operator, value: customFormValue, i18nStrings: i18nStrings, onCancel: () => {
                                    var _a, _b;
                                    setFilteringText('');
                                    (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.close();
                                    (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.focus({ preventDropdown: true });
                                }, onSubmit: token => {
                                    var _a, _b;
                                    addToken(token);
                                    setFilteringText('');
                                    (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus({ preventDropdown: true });
                                    (_b = inputRef.current) === null || _b === void 0 ? void 0 : _b.close();
                                } })),
                        }
                        : undefined, onCloseDropdown: () => setCustomFormValueRecord({}), hideEnteredTextOption: internalFreeText.disabled && parsedText.step !== 'property', clearAriaLabel: i18nStrings.clearAriaLabel, searchResultsId: showResults ? searchResultsId : undefined })),
                showResults ? (React.createElement("div", { className: styles.results },
                    React.createElement(SearchResults, { id: searchResultsId }, countText))) : null)),
        filteringConstraintText && (React.createElement("div", { id: constraintTextId, className: styles.constraint }, filteringConstraintText)),
        internalQuery.tokens && internalQuery.tokens.length > 0 && (React.createElement("div", { className: styles.tokens },
            React.createElement(InternalSpaceBetween, { size: "xs", direction: "horizontal" },
                React.createElement(TokenList, { alignment: "inline", limit: tokenLimit, items: internalQuery.tokens, limitShowFewerAriaLabel: tokenLimitShowFewerAriaLabel, limitShowMoreAriaLabel: tokenLimitShowMoreAriaLabel, renderItem: (_, tokenIndex) => (React.createElement(TokenButton, { query: internalQuery, tokenIndex: tokenIndex, onUpdateToken: (token, releasedTokens) => {
                            updateToken(tokenIndex, token, releasedTokens);
                        }, onUpdateOperation: updateOperation, onRemoveToken: () => {
                            removeToken(tokenIndex);
                            setNextFocusIndex(tokenIndex);
                        }, filteringProperties: internalProperties, filteringOptions: internalOptions, asyncProps: asyncProps, onLoadItems: onLoadItems, i18nStrings: i18nStrings, asyncProperties: asyncProperties, hideOperations: hideOperations, customGroupsText: customGroupsText, freeTextFiltering: internalFreeText, disabled: disabled, expandToViewport: expandToViewport, enableTokenGroups: enableTokenGroups })), i18nStrings: {
                        limitShowFewer: i18nStrings.tokenLimitShowFewer,
                        limitShowMore: i18nStrings.tokenLimitShowMore,
                    }, after: customFilterActions ? (React.createElement("div", { className: styles['custom-filter-actions'] }, customFilterActions)) : (React.createElement("span", Object.assign({}, getAnalyticsMetadataAttribute({
                        action: 'clearFilters',
                    })),
                        React.createElement(InternalButton, { formAction: "none", onClick: () => {
                                var _a;
                                removeAllTokens();
                                (_a = inputRef.current) === null || _a === void 0 ? void 0 : _a.focus({ preventDropdown: true });
                            }, className: styles['remove-all'], disabled: disabled }, i18nStrings.clearFiltersText))) }))))));
});
export default PropertyFilterInternal;
//# sourceMappingURL=internal.js.map