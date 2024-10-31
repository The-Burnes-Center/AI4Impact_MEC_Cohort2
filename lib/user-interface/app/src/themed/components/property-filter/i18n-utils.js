// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useInternalI18n } from '../i18n/context';
import { tokenGroupToTokens } from './utils';
export function usePropertyFilterI18n(def = {}) {
    var _a;
    const i18n = useInternalI18n('property-filter');
    const allPropertiesLabel = i18n('i18nStrings.allPropertiesLabel', def === null || def === void 0 ? void 0 : def.allPropertiesLabel);
    const operationAndText = i18n('i18nStrings.operationAndText', def === null || def === void 0 ? void 0 : def.operationAndText);
    const operationOrText = i18n('i18nStrings.operationOrText', def === null || def === void 0 ? void 0 : def.operationOrText);
    const formatToken = (_a = i18n('i18nStrings.formatToken', def.formatToken, format => token => format({
        token__propertyLabel: token.propertyLabel,
        token__operator: getOperatorI18nString(token.operator),
        token__value: token.value,
    }))) !== null && _a !== void 0 ? _a : (token => `${token.propertyLabel} ${token.operator} ${token.value}`);
    function toFormatted(token) {
        var _a, _b, _c;
        let valueFormatter = (_a = token.property) === null || _a === void 0 ? void 0 : _a.getValueFormatter(token.operator);
        if (!valueFormatter && ((_b = token.property) === null || _b === void 0 ? void 0 : _b.getTokenType(token.operator)) === 'enum') {
            valueFormatter = value => (Array.isArray(value) ? value.join(', ') : value);
        }
        const propertyLabel = token.property ? token.property.propertyLabel : allPropertiesLabel !== null && allPropertiesLabel !== void 0 ? allPropertiesLabel : '';
        const tokenValue = valueFormatter ? valueFormatter(token.value) : token.value;
        return { propertyKey: (_c = token.property) === null || _c === void 0 ? void 0 : _c.propertyKey, propertyLabel, operator: token.operator, value: tokenValue };
    }
    return Object.assign(Object.assign({}, def), { allPropertiesLabel,
        operationAndText,
        operationOrText, applyActionText: i18n('i18nStrings.applyActionText', def === null || def === void 0 ? void 0 : def.applyActionText), cancelActionText: i18n('i18nStrings.cancelActionText', def === null || def === void 0 ? void 0 : def.cancelActionText), clearFiltersText: i18n('i18nStrings.clearFiltersText', def === null || def === void 0 ? void 0 : def.clearFiltersText), editTokenHeader: i18n('i18nStrings.editTokenHeader', def === null || def === void 0 ? void 0 : def.editTokenHeader), groupPropertiesText: i18n('i18nStrings.groupPropertiesText', def === null || def === void 0 ? void 0 : def.groupPropertiesText), groupValuesText: i18n('i18nStrings.groupValuesText', def === null || def === void 0 ? void 0 : def.groupValuesText), operatorContainsText: i18n('i18nStrings.operatorContainsText', def === null || def === void 0 ? void 0 : def.operatorContainsText), operatorDoesNotContainText: i18n('i18nStrings.operatorDoesNotContainText', def === null || def === void 0 ? void 0 : def.operatorDoesNotContainText), operatorDoesNotEqualText: i18n('i18nStrings.operatorDoesNotEqualText', def === null || def === void 0 ? void 0 : def.operatorDoesNotEqualText), operatorEqualsText: i18n('i18nStrings.operatorEqualsText', def === null || def === void 0 ? void 0 : def.operatorEqualsText), operatorGreaterOrEqualText: i18n('i18nStrings.operatorGreaterOrEqualText', def === null || def === void 0 ? void 0 : def.operatorGreaterOrEqualText), operatorGreaterText: i18n('i18nStrings.operatorGreaterText', def === null || def === void 0 ? void 0 : def.operatorGreaterText), operatorLessOrEqualText: i18n('i18nStrings.operatorLessOrEqualText', def === null || def === void 0 ? void 0 : def.operatorLessOrEqualText), operatorLessText: i18n('i18nStrings.operatorLessText', def === null || def === void 0 ? void 0 : def.operatorLessText), operatorStartsWithText: i18n('i18nStrings.operatorStartsWithText', def === null || def === void 0 ? void 0 : def.operatorStartsWithText), operatorDoesNotStartWithText: i18n('i18nStrings.operatorDoesNotStartWithText', def === null || def === void 0 ? void 0 : def.operatorDoesNotStartWithText), operatorText: i18n('i18nStrings.operatorText', def === null || def === void 0 ? void 0 : def.operatorText), operatorsText: i18n('i18nStrings.operatorsText', def === null || def === void 0 ? void 0 : def.operatorsText), propertyText: i18n('i18nStrings.propertyText', def === null || def === void 0 ? void 0 : def.propertyText), tokenLimitShowFewer: i18n('i18nStrings.tokenLimitShowFewer', def === null || def === void 0 ? void 0 : def.tokenLimitShowFewer), tokenLimitShowMore: i18n('i18nStrings.tokenLimitShowMore', def === null || def === void 0 ? void 0 : def.tokenLimitShowMore), valueText: i18n('i18nStrings.valueText', def === null || def === void 0 ? void 0 : def.valueText), tokenEditorTokenRemoveLabel: i18n('i18nStrings.tokenEditorTokenRemoveLabel', def === null || def === void 0 ? void 0 : def.tokenEditorTokenRemoveLabel), tokenEditorTokenRemoveFromGroupLabel: i18n('i18nStrings.tokenEditorTokenRemoveFromGroupLabel', def === null || def === void 0 ? void 0 : def.tokenEditorTokenRemoveFromGroupLabel), tokenEditorAddNewTokenLabel: i18n('i18nStrings.tokenEditorAddNewTokenLabel', def === null || def === void 0 ? void 0 : def.tokenEditorAddNewTokenLabel), tokenEditorAddTokenActionsAriaLabel: i18n('i18nStrings.tokenEditorAddTokenActionsAriaLabel', def === null || def === void 0 ? void 0 : def.tokenEditorAddTokenActionsAriaLabel), formatToken: token => {
            const formattedToken = toFormatted(token);
            return Object.assign(Object.assign({}, formattedToken), { formattedText: formatToken(toFormatted(token)) });
        }, groupAriaLabel: group => {
            var _a;
            const tokens = tokenGroupToTokens(group.tokens).map(toFormatted);
            const groupOperationLabel = (_a = (group.operation === 'and' ? operationAndText : operationOrText)) !== null && _a !== void 0 ? _a : '';
            return tokens.map(token => formatToken(token)).join(` ${groupOperationLabel} `);
        }, groupEditAriaLabel: group => {
            var _a, _b;
            const tokens = tokenGroupToTokens(group.tokens).map(token => toFormatted(token));
            const operation = group.operation;
            const operationLabel = (_a = (operation === 'and' ? operationAndText : operationOrText)) !== null && _a !== void 0 ? _a : '';
            const formatter = i18n('i18nStrings.groupEditAriaLabel', def.groupEditAriaLabel, format => () => format({
                group__operationLabel: operationLabel,
                group__formattedTokens__length: tokens.length.toString(),
                group__formattedTokens0__formattedText: tokens[0] ? formatToken(tokens[0]) : '',
                group__formattedTokens1__formattedText: tokens[1] ? formatToken(tokens[1]) : '',
                group__formattedTokens2__formattedText: tokens[2] ? formatToken(tokens[2]) : '',
                group__formattedTokens3__formattedText: tokens[3] ? formatToken(tokens[3]) : '',
            }));
            return (_b = formatter === null || formatter === void 0 ? void 0 : formatter({ operation, operationLabel, tokens })) !== null && _b !== void 0 ? _b : '';
        }, removeTokenButtonAriaLabel: token => {
            var _a;
            const formatter = i18n('i18nStrings.removeTokenButtonAriaLabel', def.removeTokenButtonAriaLabel, format => () => format({ token__formattedText: formatToken(toFormatted(token)) }));
            return (_a = formatter === null || formatter === void 0 ? void 0 : formatter(toFormatted(token))) !== null && _a !== void 0 ? _a : '';
        }, tokenEditorTokenActionsAriaLabel: (token) => {
            var _a;
            const formatter = i18n('i18nStrings.tokenEditorTokenActionsAriaLabel', def.tokenEditorTokenActionsAriaLabel, format => () => format({ token__formattedText: formatToken(toFormatted(token)) }));
            return (_a = formatter === null || formatter === void 0 ? void 0 : formatter(toFormatted(token))) !== null && _a !== void 0 ? _a : '';
        }, tokenEditorTokenRemoveAriaLabel: token => {
            var _a;
            const formatter = i18n('i18nStrings.tokenEditorTokenRemoveAriaLabel', def.tokenEditorTokenRemoveAriaLabel, format => () => format({ token__formattedText: formatToken(toFormatted(token)) }));
            return (_a = formatter === null || formatter === void 0 ? void 0 : formatter(toFormatted(token))) !== null && _a !== void 0 ? _a : '';
        }, tokenEditorAddExistingTokenAriaLabel: token => {
            var _a;
            const formatter = i18n('i18nStrings.tokenEditorAddExistingTokenAriaLabel', def.tokenEditorAddExistingTokenAriaLabel, format => () => format({ token__formattedText: formatToken(toFormatted(token)) }));
            return (_a = formatter === null || formatter === void 0 ? void 0 : formatter(toFormatted(token))) !== null && _a !== void 0 ? _a : '';
        }, tokenEditorAddExistingTokenLabel: token => {
            var _a;
            const formattedToken = toFormatted(token);
            const formatter = i18n('i18nStrings.tokenEditorAddExistingTokenLabel', def.tokenEditorAddExistingTokenLabel, format => () => format({
                token__propertyLabel: formattedToken.propertyLabel,
                token__operator: formattedToken.operator,
                token__value: formattedToken.value,
            }));
            return (_a = formatter === null || formatter === void 0 ? void 0 : formatter(toFormatted(token))) !== null && _a !== void 0 ? _a : '';
        } });
}
export function operatorToDescription(operator, i18nStrings) {
    switch (operator) {
        case '<':
            return i18nStrings.operatorLessText;
        case '<=':
            return i18nStrings.operatorLessOrEqualText;
        case '>':
            return i18nStrings.operatorGreaterText;
        case '>=':
            return i18nStrings.operatorGreaterOrEqualText;
        case ':':
            return i18nStrings.operatorContainsText;
        case '!:':
            return i18nStrings.operatorDoesNotContainText;
        case '=':
            return i18nStrings.operatorEqualsText;
        case '!=':
            return i18nStrings.operatorDoesNotEqualText;
        case '^':
            return i18nStrings.operatorStartsWithText;
        case '!^':
            return i18nStrings.operatorDoesNotStartWithText;
        // The line is ignored from coverage because it is not reachable.
        // The purpose of it is to prevent TS errors if ComparisonOperator type gets extended.
        /* istanbul ignore next */
        default:
            return '';
    }
}
function getOperatorI18nString(operator) {
    switch (operator) {
        case '=':
            return 'equals';
        case '!=':
            return 'not_equals';
        case '>':
            return 'greater_than';
        case '>=':
            return 'greater_than_equal';
        case '<':
            return 'less_than';
        case '<=':
            return 'less_than_equal';
        case ':':
            return 'contains';
        case '!:':
            return 'not_contains';
        case '^':
            return 'starts_with';
        case '!^':
            return 'not_starts_with';
        // The line is ignored from coverage because it is not reachable.
        // The purpose of it is to prevent TS errors if ComparisonOperator type gets extended.
        /* istanbul ignore next */
        default:
            return operator;
    }
}
//# sourceMappingURL=i18n-utils.js.map