// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useLayoutEffect, useState } from 'react';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { awsuiPluginsInternal } from '../../internal/plugins/api';
function checkAlreadyExists(value, propName) {
    if (value) {
        warnOnce('AppLayout', `Another app layout instance on this page already defines ${propName} property. This instance will be ignored.`);
        return true;
    }
    return false;
}
function mergeProps(ownProps, additionalProps) {
    var _a;
    const toolbar = {};
    for (const props of [ownProps, ...additionalProps]) {
        toolbar.ariaLabels = Object.assign((_a = toolbar.ariaLabels) !== null && _a !== void 0 ? _a : {}, props.ariaLabels);
        if (props.drawers && !checkAlreadyExists(!!toolbar.drawers, 'tools or drawers')) {
            toolbar.drawers = props.drawers;
            toolbar.activeDrawerId = props.activeDrawerId;
            toolbar.drawersFocusRef = props.drawersFocusRef;
            toolbar.onActiveDrawerChange = props.onActiveDrawerChange;
        }
        if (props.navigation && !checkAlreadyExists(!!toolbar.hasNavigation, 'navigation')) {
            toolbar.hasNavigation = true;
            toolbar.navigationOpen = props.navigationOpen;
            toolbar.navigationFocusRef = props.navigationFocusRef;
            toolbar.onNavigationToggle = props.onNavigationToggle;
        }
        if (props.splitPanel && !checkAlreadyExists(!!toolbar.hasSplitPanel, 'splitPanel')) {
            toolbar.hasSplitPanel = true;
            toolbar.splitPanelFocusRef = props.splitPanelFocusRef;
            toolbar.splitPanelToggleProps = props.splitPanelToggleProps;
            toolbar.onSplitPanelToggle = props.onSplitPanelToggle;
        }
        if (props.breadcrumbs && !checkAlreadyExists(!!toolbar.hasBreadcrumbsPortal, 'hasBreadcrumbsPortal')) {
            toolbar.hasBreadcrumbsPortal = true;
        }
    }
    // do not render toolbar if no fields are defined, except ariaLabels, which are always there
    return Object.keys(toolbar).filter(key => key !== 'ariaLabels').length > 0 ? toolbar : null;
}
export function useMultiAppLayout(props, isEnabled) {
    const [registration, setRegistration] = useState(null);
    const { forceDeduplicationType } = props;
    useLayoutEffect(() => {
        if (!isEnabled || forceDeduplicationType === 'suspended') {
            return;
        }
        if (forceDeduplicationType === 'off') {
            setRegistration({ type: 'primary', discoveredProps: [] });
            return;
        }
        return awsuiPluginsInternal.appLayoutWidget.register(forceDeduplicationType, props => setRegistration(props));
    }, [forceDeduplicationType, isEnabled]);
    useLayoutEffect(() => {
        if ((registration === null || registration === void 0 ? void 0 : registration.type) === 'secondary') {
            registration.update(props);
        }
    });
    return {
        registered: !!(registration === null || registration === void 0 ? void 0 : registration.type),
        toolbarProps: (registration === null || registration === void 0 ? void 0 : registration.type) === 'primary' ? mergeProps(props, registration.discoveredProps) : null,
    };
}
//# sourceMappingURL=multi-layout.js.map