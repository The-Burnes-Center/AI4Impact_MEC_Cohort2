import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import useBaseComponent from '../internal/hooks/use-base-component';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import PropertyFilterInternal from './internal';
import analyticsSelectors from './analytics-metadata/styles.css.js';
const PropertyFilter = React.forwardRef((_a, ref) => {
    var _b;
    var { filteringProperties, filteringOptions = [], customGroupsText = [], enableTokenGroups = false, disableFreeTextFiltering = false, asyncProperties, expandToViewport, hideOperations = false, tokenLimit, virtualScroll } = _a, rest = __rest(_a, ["filteringProperties", "filteringOptions", "customGroupsText", "enableTokenGroups", "disableFreeTextFiltering", "asyncProperties", "expandToViewport", "hideOperations", "tokenLimit", "virtualScroll"]);
    let hasCustomForms = false;
    let hasEnumTokens = false;
    let hasCustomFormatters = false;
    for (const property of filteringProperties) {
        for (const operator of (_b = property.operators) !== null && _b !== void 0 ? _b : []) {
            if (typeof operator === 'object') {
                hasCustomForms = hasCustomForms || !!operator.form;
                hasEnumTokens = hasEnumTokens || operator.tokenType === 'enum';
                hasCustomFormatters = hasCustomFormatters || !!operator.format;
            }
        }
    }
    const baseComponentProps = useBaseComponent('PropertyFilter', {
        props: {
            asyncProperties,
            disableFreeTextFiltering,
            enableTokenGroups,
            expandToViewport,
            hideOperations,
            tokenLimit,
            virtualScroll,
        },
        metadata: {
            hasCustomForms,
            hasEnumTokens,
            hasCustomFormatters,
        },
    });
    const componentAnalyticsMetadata = {
        name: 'awsui.PropertyFilter',
        label: `.${analyticsSelectors['search-field']} input`,
        properties: {
            disabled: `${!!rest.disabled}`,
            queryTokensCount: `${rest.query && rest.query.tokens ? rest.query.tokens.length : 0}`,
        },
    };
    if (hideOperations && enableTokenGroups) {
        warnOnce('PropertyFilter', 'Operations cannot be hidden when token groups are enabled.');
        hideOperations = false;
    }
    return (React.createElement(PropertyFilterInternal, Object.assign({ ref: ref }, baseComponentProps, { filteringProperties: filteringProperties, filteringOptions: filteringOptions, customGroupsText: customGroupsText, enableTokenGroups: enableTokenGroups, disableFreeTextFiltering: disableFreeTextFiltering, asyncProperties: asyncProperties, expandToViewport: expandToViewport, hideOperations: hideOperations, tokenLimit: tokenLimit, virtualScroll: virtualScroll }, getAnalyticsMetadataAttribute({ component: componentAnalyticsMetadata }), rest)));
});
applyDisplayName(PropertyFilter, 'PropertyFilter');
export default PropertyFilter;
//# sourceMappingURL=index.js.map