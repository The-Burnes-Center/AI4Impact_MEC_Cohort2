import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import useBaseComponent from '../internal/hooks/use-base-component';
import { useControllable } from '../internal/hooks/use-controllable';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useMobile } from '../internal/hooks/use-mobile';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { isDevelopment } from '../internal/is-development';
import { applyDisplayName } from '../internal/utils/apply-display-name';
import { applyDefaults } from './defaults';
import { AppLayoutInternal } from './internal';
import { useAppLayoutPlacement } from './utils/use-app-layout-placement';
const AppLayout = React.forwardRef((_a, ref) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    var { contentType = 'default', headerSelector = '#b #h', footerSelector = '#b #f', navigationWidth = 280, toolsWidth = 290, maxContentWidth, minContentWidth, navigationOpen: controlledNavigationOpen, onNavigationChange: controlledOnNavigationChange, analyticsMetadata } = _a, rest = __rest(_a, ["contentType", "headerSelector", "footerSelector", "navigationWidth", "toolsWidth", "maxContentWidth", "minContentWidth", "navigationOpen", "onNavigationChange", "analyticsMetadata"]);
    if (isDevelopment) {
        if (rest.toolsOpen && rest.toolsHide) {
            warnOnce('AppLayout', `You have enabled both the \`toolsOpen\` prop and the \`toolsHide\` prop. This is not supported. Set \`toolsOpen\` to \`false\` when you set \`toolsHide\` to \`true\`.`);
        }
    }
    const { __internalRootRef } = useBaseComponent('AppLayout', {
        props: {
            contentType,
            disableContentPaddings: rest.disableContentPaddings,
            disableBodyScroll: rest.disableBodyScroll,
            navigationWidth,
            navigationHide: rest.navigationHide,
            toolsHide: rest.toolsHide,
            toolsWidth,
            maxContentWidth,
            minContentWidth,
            stickyNotifications: rest.stickyNotifications,
            disableContentHeaderOverlap: rest.disableContentHeaderOverlap,
        },
        metadata: {
            drawersCount: (_c = (_b = rest.drawers) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : null,
            hasContentHeader: !!rest.contentHeader,
        },
    }, analyticsMetadata);
    const isRefresh = useVisualRefresh();
    const isMobile = useMobile();
    const i18n = useInternalI18n('app-layout');
    const ariaLabels = {
        navigation: i18n('ariaLabels.navigation', (_d = rest.ariaLabels) === null || _d === void 0 ? void 0 : _d.navigation),
        navigationClose: i18n('ariaLabels.navigationClose', (_e = rest.ariaLabels) === null || _e === void 0 ? void 0 : _e.navigationClose),
        navigationToggle: i18n('ariaLabels.navigationToggle', (_f = rest.ariaLabels) === null || _f === void 0 ? void 0 : _f.navigationToggle),
        notifications: i18n('ariaLabels.notifications', (_g = rest.ariaLabels) === null || _g === void 0 ? void 0 : _g.notifications),
        tools: i18n('ariaLabels.tools', (_h = rest.ariaLabels) === null || _h === void 0 ? void 0 : _h.tools),
        toolsClose: i18n('ariaLabels.toolsClose', (_j = rest.ariaLabels) === null || _j === void 0 ? void 0 : _j.toolsClose),
        toolsToggle: i18n('ariaLabels.toolsToggle', (_k = rest.ariaLabels) === null || _k === void 0 ? void 0 : _k.toolsToggle),
        drawers: i18n('ariaLabels.drawers', (_l = rest.ariaLabels) === null || _l === void 0 ? void 0 : _l.drawers),
        drawersOverflow: i18n('ariaLabels.drawersOverflow', (_m = rest.ariaLabels) === null || _m === void 0 ? void 0 : _m.drawersOverflow),
        drawersOverflowWithBadge: i18n('ariaLabels.drawersOverflowWithBadge', (_o = rest.ariaLabels) === null || _o === void 0 ? void 0 : _o.drawersOverflowWithBadge),
    };
    const _p = applyDefaults(contentType, { maxContentWidth, minContentWidth }, isRefresh), { navigationOpen: defaultNavigationOpen } = _p, restDefaults = __rest(_p, ["navigationOpen"]);
    const [navigationOpen = false, setNavigationOpen] = useControllable(controlledNavigationOpen, controlledOnNavigationChange, isMobile ? false : defaultNavigationOpen, { componentName: 'AppLayout', controlledProp: 'navigationOpen', changeHandler: 'onNavigationChange' });
    const onNavigationChange = (event) => {
        setNavigationOpen(event.detail.open);
        controlledOnNavigationChange === null || controlledOnNavigationChange === void 0 ? void 0 : controlledOnNavigationChange(event);
    };
    const [rootRef, placement] = useAppLayoutPlacement(headerSelector, footerSelector);
    // This re-builds the props including the default values
    const props = Object.assign(Object.assign(Object.assign({ contentType,
        navigationWidth,
        toolsWidth,
        navigationOpen,
        onNavigationChange }, restDefaults), rest), { ariaLabels,
        placement });
    const baseProps = getBaseProps(rest);
    return (React.createElement("div", Object.assign({ ref: useMergeRefs(__internalRootRef, rootRef) }, baseProps),
        React.createElement(AppLayoutInternal, Object.assign({ ref: ref }, props))));
});
applyDisplayName(AppLayout, 'AppLayout');
export default AppLayout;
//# sourceMappingURL=index.js.map