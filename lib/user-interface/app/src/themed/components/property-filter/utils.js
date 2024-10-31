// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Finds the longest property the filtering text starts from.
export function matchFilteringProperty(filteringProperties, filteringText) {
    let maxLength = 0;
    let matchedProperty = null;
    for (const property of filteringProperties) {
        if ((property.propertyLabel.length >= maxLength && startsWith(filteringText, property.propertyLabel)) ||
            (property.propertyLabel.length > maxLength &&
                startsWith(filteringText.toLowerCase(), property.propertyLabel.toLowerCase()))) {
            maxLength = property.propertyLabel.length;
            matchedProperty = property;
        }
    }
    return matchedProperty;
}
// Finds the longest operator the filtering text starts from.
export function matchOperator(allowedOperators, filteringText) {
    filteringText = filteringText.toLowerCase();
    let maxLength = 0;
    let matchedOperator = null;
    for (const operator of allowedOperators) {
        if (operator.length > maxLength && startsWith(filteringText, operator.toLowerCase())) {
            maxLength = operator.length;
            matchedOperator = operator;
        }
    }
    return matchedOperator;
}
// Finds if the filtering text matches any operator prefix.
export function matchOperatorPrefix(allowedOperators, filteringText) {
    if (filteringText.trim().length === 0) {
        return '';
    }
    for (const operator of allowedOperators) {
        if (startsWith(operator.toLowerCase(), filteringText.toLowerCase())) {
            return filteringText;
        }
    }
    return null;
}
export function matchTokenValue({ property, operator, value }, filteringOptions) {
    var _a, _b;
    const tokenType = property === null || property === void 0 ? void 0 : property.getTokenType(operator);
    const propertyOptions = filteringOptions.filter(option => option.property === property);
    const castValue = (value) => {
        if (value === null) {
            return tokenType === 'enum' ? [] : null;
        }
        return tokenType === 'enum' && !Array.isArray(value) ? [value] : value;
    };
    const bestMatch = { propertyKey: property === null || property === void 0 ? void 0 : property.propertyKey, operator, value: castValue(value) };
    for (const option of propertyOptions) {
        if ((option.label && option.label === value) || (!option.label && option.value === value)) {
            // exact match found: return it
            return { propertyKey: property === null || property === void 0 ? void 0 : property.propertyKey, operator, value: castValue(option.value) };
        }
        // By default, the token value is a string, but when a custom property is used,
        // the token value can be any, therefore we need to check for its type before calling toLowerCase()
        if (typeof value === 'string' && value.toLowerCase() === ((_b = (_a = option.label) !== null && _a !== void 0 ? _a : option.value) !== null && _b !== void 0 ? _b : '').toLowerCase()) {
            // non-exact match: save and keep running in case exact match found later
            bestMatch.value = castValue(option.value);
        }
    }
    return bestMatch;
}
export function trimStart(source) {
    let spacesLength = 0;
    for (let i = 0; i < source.length; i++) {
        if (source[i] === ' ') {
            spacesLength++;
        }
        else {
            break;
        }
    }
    return source.slice(spacesLength);
}
export function trimFirstSpace(source) {
    return source[0] === ' ' ? source.slice(1) : source;
}
export function removeOperator(source, operator) {
    const operatorLastIndex = source.indexOf(operator) + operator.length;
    const textWithoutOperator = source.slice(operatorLastIndex);
    // We need to remove the first leading space in case the user presses space
    // after the operator, for example: Owner: admin, will result in value of ` admin`
    // and we need to remove the first space, if the user added any more spaces only the
    // first one will be removed.
    return trimFirstSpace(textWithoutOperator);
}
function startsWith(source, target) {
    return source.indexOf(target) === 0;
}
/**
 * Transforms query token groups to tokens (only taking 1 level of nesting).
 */
export function tokenGroupToTokens(tokenGroups) {
    const tokens = [];
    for (const tokenOrGroup of tokenGroups) {
        if ('operator' in tokenOrGroup) {
            tokens.push(tokenOrGroup);
        }
        else {
            for (const nestedTokenOrGroup of tokenOrGroup.tokens) {
                if ('operator' in nestedTokenOrGroup) {
                    tokens.push(nestedTokenOrGroup);
                }
                else {
                    // Ignore deeply nested tokens
                }
            }
        }
    }
    return tokens;
}
//# sourceMappingURL=utils.js.map