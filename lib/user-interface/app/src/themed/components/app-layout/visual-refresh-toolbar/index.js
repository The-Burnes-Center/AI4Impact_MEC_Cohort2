import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useImperativeHandle, useState } from 'react';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import ScreenreaderOnly from '../../internal/components/screenreader-only';
import { fireNonCancelableEvent } from '../../internal/events';
import { useControllable } from '../../internal/hooks/use-controllable';
import { useIntersectionObserver } from '../../internal/hooks/use-intersection-observer';
import { useMobile } from '../../internal/hooks/use-mobile';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { useGetGlobalBreadcrumbs } from '../../internal/plugins/helpers/use-global-breadcrumbs';
import globalVars from '../../internal/styles/global-vars';
import { getSplitPanelDefaultSize } from '../../split-panel/utils/size-utils';
import { MIN_DRAWER_SIZE, useDrawers } from '../utils/use-drawers';
import { useFocusControl, useMultipleFocusControl } from '../utils/use-focus-control';
import { useSplitPanelFocusControl } from '../utils/use-split-panel-focus-control';
import { ActiveDrawersContext } from '../utils/visibility-context';
import { computeHorizontalLayout, computeVerticalLayout, CONTENT_PADDING } from './compute-layout';
import { AppLayoutDrawer, AppLayoutGlobalDrawers, AppLayoutNavigation, AppLayoutNotifications, AppLayoutSplitPanelBottom, AppLayoutSplitPanelSide, AppLayoutToolbar, } from './internal';
import { useMultiAppLayout } from './multi-layout';
import { SkeletonLayout } from './skeleton';
const AppLayoutVisualRefreshToolbar = React.forwardRef((_a, forwardRef) => {
    var _b, _c;
    var { ariaLabels, contentHeader, content, navigationOpen, navigationWidth, navigation, navigationHide, onNavigationChange, tools, toolsOpen: controlledToolsOpen, onToolsChange, toolsHide, toolsWidth, contentType, headerVariant, breadcrumbs, notifications, stickyNotifications, splitPanelPreferences: controlledSplitPanelPreferences, splitPanelOpen: controlledSplitPanelOpen, splitPanel, splitPanelSize: controlledSplitPanelSize, onSplitPanelToggle, onSplitPanelResize, onSplitPanelPreferencesChange, disableContentPaddings, minContentWidth, maxContentWidth, placement } = _a, rest = __rest(_a, ["ariaLabels", "contentHeader", "content", "navigationOpen", "navigationWidth", "navigation", "navigationHide", "onNavigationChange", "tools", "toolsOpen", "onToolsChange", "toolsHide", "toolsWidth", "contentType", "headerVariant", "breadcrumbs", "notifications", "stickyNotifications", "splitPanelPreferences", "splitPanelOpen", "splitPanel", "splitPanelSize", "onSplitPanelToggle", "onSplitPanelResize", "onSplitPanelPreferencesChange", "disableContentPaddings", "minContentWidth", "maxContentWidth", "placement"]);
    const isMobile = useMobile();
    const { __embeddedViewMode: embeddedViewMode, __forceDeduplicationType: forceDeduplicationType } = rest;
    const splitPanelControlId = useUniqueId('split-panel');
    const [toolbarState, setToolbarState] = useState('show');
    const [toolbarHeight, setToolbarHeight] = useState(0);
    const [notificationsHeight, setNotificationsHeight] = useState(0);
    const [toolsOpen = false, setToolsOpen] = useControllable(controlledToolsOpen, onToolsChange, false, {
        componentName: 'AppLayout',
        controlledProp: 'toolsOpen',
        changeHandler: 'onToolsChange',
    });
    const onToolsToggle = (open) => {
        setToolsOpen(open);
        drawersFocusControl.setFocus();
        fireNonCancelableEvent(onToolsChange, { open });
    };
    const onGlobalDrawerFocus = (drawerId, open) => {
        globalDrawersFocusControl.setFocus({ force: true, drawerId, open });
    };
    const onAddNewActiveDrawer = (drawerId) => {
        var _a, _b;
        // If a local drawer is already open, and we attempt to open a new one,
        // it will replace the existing one instead of opening an additional drawer,
        // since only one local drawer is supported. Therefore, layout calculations are not necessary.
        if (activeDrawer && (drawers === null || drawers === void 0 ? void 0 : drawers.find(drawer => drawer.id === drawerId))) {
            return;
        }
        // get the size of drawerId. it could be either local or global drawer
        const combinedDrawers = [...(drawers || []), ...globalDrawers];
        const newDrawer = combinedDrawers.find(drawer => drawer.id === drawerId);
        if (!newDrawer) {
            return;
        }
        const newDrawerSize = Math.min((_b = (_a = newDrawer.defaultSize) !== null && _a !== void 0 ? _a : drawerSizes[drawerId]) !== null && _b !== void 0 ? _b : MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
        //   check if the active drawers could be resized to fit the new drawers
        //   to do this, we need to take all active drawers, sum up their min sizes, truncate it from resizableSpaceAvailable
        //   and compare a given number with the new drawer id min size
        // the total size of all global drawers resized to their min size
        const availableSpaceForNewDrawer = resizableSpaceAvailable - totalActiveDrawersMinSize;
        if (availableSpaceForNewDrawer >= newDrawerSize) {
            return;
        }
        // now we made sure we cannot accommodate the new drawer with existing ones
        closeFirstDrawer();
    };
    const { drawers, activeDrawer, minDrawerSize, minGlobalDrawersSizes, activeDrawerSize, ariaLabelsWithDrawers, globalDrawers, activeGlobalDrawers, activeGlobalDrawersIds, activeGlobalDrawersSizes, drawerSizes, drawersOpenQueue, onActiveDrawerChange, onActiveDrawerResize, onActiveGlobalDrawersChange, } = useDrawers(Object.assign(Object.assign({}, rest), { onGlobalDrawerFocus, onAddNewActiveDrawer }), ariaLabels, {
        ariaLabels,
        toolsHide,
        toolsOpen,
        tools,
        toolsWidth,
        onToolsToggle,
    });
    const onActiveDrawerChangeHandler = (drawerId) => {
        onActiveDrawerChange(drawerId);
        drawersFocusControl.setFocus();
    };
    const [splitPanelOpen = false, setSplitPanelOpen] = useControllable(controlledSplitPanelOpen, onSplitPanelToggle, false, {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelOpen',
        changeHandler: 'onSplitPanelToggle',
    });
    const onSplitPanelToggleHandler = () => {
        setSplitPanelOpen(!splitPanelOpen);
        splitPanelFocusControl.setLastInteraction({ type: splitPanelOpen ? 'close' : 'open' });
        fireNonCancelableEvent(onSplitPanelToggle, { open: !splitPanelOpen });
    };
    const [splitPanelPreferences, setSplitPanelPreferences] = useControllable(controlledSplitPanelPreferences, onSplitPanelPreferencesChange, undefined, {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelPreferences',
        changeHandler: 'onSplitPanelPreferencesChange',
    });
    const onSplitPanelPreferencesChangeHandler = (detail) => {
        setSplitPanelPreferences(detail);
        splitPanelFocusControl.setLastInteraction({ type: 'position' });
        fireNonCancelableEvent(onSplitPanelPreferencesChange, detail);
    };
    const [splitPanelSize = 0, setSplitPanelSize] = useControllable(controlledSplitPanelSize, onSplitPanelResize, getSplitPanelDefaultSize((_b = splitPanelPreferences === null || splitPanelPreferences === void 0 ? void 0 : splitPanelPreferences.position) !== null && _b !== void 0 ? _b : 'bottom'), { componentName: 'AppLayout', controlledProp: 'splitPanelSize', changeHandler: 'onSplitPanelResize' });
    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);
    const onSplitPanelResizeHandler = (size) => {
        setSplitPanelSize(size);
        fireNonCancelableEvent(onSplitPanelResize, { size });
    };
    const [splitPanelToggleConfig, setSplitPanelToggleConfig] = useState({
        ariaLabel: undefined,
        displayed: false,
    });
    const globalDrawersFocusControl = useMultipleFocusControl(true, activeGlobalDrawersIds);
    const drawersFocusControl = useFocusControl(!!(activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id), true, activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id);
    const navigationFocusControl = useFocusControl(navigationOpen);
    const splitPanelFocusControl = useSplitPanelFocusControl([splitPanelPreferences, splitPanelOpen]);
    const onNavigationToggle = useStableCallback((open) => {
        navigationFocusControl.setFocus();
        fireNonCancelableEvent(onNavigationChange, { open });
    });
    useImperativeHandle(forwardRef, () => ({
        closeNavigationIfNecessary: () => isMobile && onNavigationToggle(false),
        openTools: () => onToolsToggle(true),
        focusToolsClose: () => drawersFocusControl.setFocus(true),
        focusActiveDrawer: () => drawersFocusControl.setFocus(true),
        focusSplitPanel: () => { var _a; return (_a = splitPanelFocusControl.refs.slider.current) === null || _a === void 0 ? void 0 : _a.focus(); },
    }));
    const resolvedNavigation = navigationHide ? null : navigation !== null && navigation !== void 0 ? navigation : React.createElement(React.Fragment, null);
    const resolvedStickyNotifications = !!stickyNotifications && !isMobile;
    const { maxDrawerSize, maxSplitPanelSize, splitPanelForcedPosition, splitPanelPosition, maxGlobalDrawersSizes, resizableSpaceAvailable, } = computeHorizontalLayout({
        activeDrawerSize: activeDrawer ? activeDrawerSize : 0,
        splitPanelSize,
        minContentWidth,
        navigationOpen: !!resolvedNavigation && navigationOpen,
        navigationWidth,
        placement,
        splitPanelOpen,
        splitPanelPosition: splitPanelPreferences === null || splitPanelPreferences === void 0 ? void 0 : splitPanelPreferences.position,
        isMobile,
        activeGlobalDrawersSizes,
    });
    const { ref: intersectionObserverRef, isIntersecting } = useIntersectionObserver({ initialState: true });
    const { registered, toolbarProps } = useMultiAppLayout({
        forceDeduplicationType,
        ariaLabels: ariaLabelsWithDrawers,
        navigation: resolvedNavigation,
        navigationOpen,
        onNavigationToggle,
        navigationFocusRef: navigationFocusControl.refs.toggle,
        breadcrumbs,
        activeDrawerId: (_c = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id) !== null && _c !== void 0 ? _c : null,
        // only pass it down if there are non-empty drawers or tools
        drawers: (drawers === null || drawers === void 0 ? void 0 : drawers.length) || !toolsHide ? drawers : undefined,
        onActiveDrawerChange: onActiveDrawerChangeHandler,
        drawersFocusRef: drawersFocusControl.refs.toggle,
        splitPanel,
        splitPanelToggleProps: Object.assign(Object.assign({}, splitPanelToggleConfig), { active: splitPanelOpen, controlId: splitPanelControlId, position: splitPanelPosition }),
        splitPanelFocusRef: splitPanelFocusControl.refs.toggle,
        onSplitPanelToggle: onSplitPanelToggleHandler,
    }, isIntersecting);
    const hasToolbar = !embeddedViewMode && !!toolbarProps;
    const discoveredBreadcrumbs = useGetGlobalBreadcrumbs(hasToolbar && !breadcrumbs);
    const verticalOffsets = computeVerticalLayout({
        topOffset: placement.insetBlockStart,
        hasVisibleToolbar: hasToolbar && toolbarState !== 'hide',
        notificationsHeight: notificationsHeight !== null && notificationsHeight !== void 0 ? notificationsHeight : 0,
        toolbarHeight: toolbarHeight !== null && toolbarHeight !== void 0 ? toolbarHeight : 0,
        stickyNotifications: resolvedStickyNotifications,
    });
    const appLayoutInternals = {
        ariaLabels: ariaLabelsWithDrawers,
        headerVariant,
        isMobile,
        breadcrumbs,
        discoveredBreadcrumbs,
        stickyNotifications: resolvedStickyNotifications,
        navigationOpen,
        navigation: resolvedNavigation,
        navigationFocusControl,
        activeDrawer,
        activeDrawerSize,
        minDrawerSize,
        maxDrawerSize,
        minGlobalDrawersSizes,
        maxGlobalDrawersSizes,
        drawers: drawers,
        globalDrawers,
        activeGlobalDrawers,
        activeGlobalDrawersIds,
        activeGlobalDrawersSizes,
        onActiveGlobalDrawersChange,
        drawersFocusControl,
        globalDrawersFocusControl,
        splitPanelPosition,
        splitPanelToggleConfig,
        splitPanelOpen,
        splitPanelControlId,
        splitPanelFocusControl,
        placement,
        toolbarState,
        setToolbarState,
        verticalOffsets,
        drawersOpenQueue,
        setToolbarHeight,
        setNotificationsHeight,
        onSplitPanelToggle: onSplitPanelToggleHandler,
        onNavigationToggle,
        onActiveDrawerChange: onActiveDrawerChangeHandler,
        onActiveDrawerResize,
    };
    const splitPanelInternals = {
        bottomOffset: 0,
        getMaxHeight: () => {
            const availableHeight = document.documentElement.clientHeight - placement.insetBlockStart - placement.insetBlockEnd;
            // If the page is likely zoomed in at 200%, allow the split panel to fill the content area.
            return availableHeight < 400 ? availableHeight - 40 : availableHeight - 250;
        },
        maxWidth: maxSplitPanelSize,
        isForcedPosition: splitPanelForcedPosition,
        isOpen: splitPanelOpen,
        leftOffset: 0,
        onPreferencesChange: onSplitPanelPreferencesChangeHandler,
        onResize: onSplitPanelResizeHandler,
        onToggle: onSplitPanelToggleHandler,
        position: splitPanelPosition,
        reportSize: size => setSplitPanelReportedSize(size),
        reportHeaderHeight: () => {
            /*unused in this design*/
        },
        rightOffset: 0,
        size: splitPanelSize,
        topOffset: 0,
        setSplitPanelToggle: setSplitPanelToggleConfig,
        refs: splitPanelFocusControl.refs,
    };
    const closeFirstDrawer = useStableCallback(() => {
        const drawerToClose = drawersOpenQueue[drawersOpenQueue.length - 1];
        if (activeDrawer && (activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.id) === drawerToClose) {
            onActiveDrawerChange(null);
        }
        else if (activeGlobalDrawersIds.includes(drawerToClose)) {
            onActiveGlobalDrawersChange(drawerToClose);
        }
    });
    useEffect(() => {
        // Close navigation drawer on mobile so that the main content is visible
        if (isMobile) {
            onNavigationToggle(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMobile]);
    const getTotalActiveDrawersMinSize = () => {
        var _a;
        const combinedDrawers = [...(drawers || []), ...globalDrawers];
        let result = activeGlobalDrawersIds
            .map(activeDrawerId => {
            var _a, _b;
            return Math.min((_b = (_a = combinedDrawers.find(drawer => drawer.id === activeDrawerId)) === null || _a === void 0 ? void 0 : _a.defaultSize) !== null && _b !== void 0 ? _b : MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
        })
            .reduce((acc, curr) => acc + curr, 0);
        if (activeDrawer) {
            result += Math.min((_a = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.defaultSize) !== null && _a !== void 0 ? _a : MIN_DRAWER_SIZE, MIN_DRAWER_SIZE);
        }
        return result;
    };
    const totalActiveDrawersMinSize = getTotalActiveDrawersMinSize();
    useEffect(() => {
        if (isMobile) {
            return;
        }
        const activeNavigationWidth = navigationOpen ? navigationWidth : 0;
        const scrollWidth = activeNavigationWidth + CONTENT_PADDING + totalActiveDrawersMinSize;
        const hasHorizontalScroll = scrollWidth > placement.inlineSize;
        if (hasHorizontalScroll) {
            if (navigationOpen) {
                onNavigationToggle(false);
                return;
            }
            closeFirstDrawer();
        }
    }, [
        totalActiveDrawersMinSize,
        closeFirstDrawer,
        isMobile,
        navigationOpen,
        navigationWidth,
        onNavigationToggle,
        placement.inlineSize,
    ]);
    return (React.createElement(React.Fragment, null,
        !hasToolbar && breadcrumbs ? React.createElement(ScreenreaderOnly, null, breadcrumbs) : null,
        React.createElement(SkeletonLayout, { ref: intersectionObserverRef, style: Object.assign({ [globalVars.stickyVerticalTopOffset]: `${verticalOffsets.header}px`, [globalVars.stickyVerticalBottomOffset]: `${placement.insetBlockEnd}px`, paddingBlockEnd: splitPanelOpen && splitPanelPosition === 'bottom' ? splitPanelReportedSize : '' }, (!isMobile ? { minWidth: `${minContentWidth}px` } : {})), toolbar: hasToolbar && React.createElement(AppLayoutToolbar, { appLayoutInternals: appLayoutInternals, toolbarProps: toolbarProps }), notifications: notifications && (React.createElement(AppLayoutNotifications, { appLayoutInternals: appLayoutInternals }, notifications)), headerVariant: headerVariant, contentHeader: contentHeader, 
            // delay rendering the content until registration of this instance is complete
            content: registered ? content : null, navigation: resolvedNavigation && React.createElement(AppLayoutNavigation, { appLayoutInternals: appLayoutInternals }), navigationOpen: navigationOpen, navigationWidth: navigationWidth, tools: drawers && drawers.length > 0 && React.createElement(AppLayoutDrawer, { appLayoutInternals: appLayoutInternals }), globalTools: React.createElement(ActiveDrawersContext.Provider, { value: activeGlobalDrawersIds },
                React.createElement(AppLayoutGlobalDrawers, { appLayoutInternals: appLayoutInternals })), globalToolsOpen: !!activeGlobalDrawersIds.length, toolsOpen: !!activeDrawer, toolsWidth: activeDrawerSize, sideSplitPanel: splitPanelPosition === 'side' && (React.createElement(AppLayoutSplitPanelSide, { appLayoutInternals: appLayoutInternals, splitPanelInternals: splitPanelInternals }, splitPanel)), bottomSplitPanel: splitPanelPosition === 'bottom' && (React.createElement(AppLayoutSplitPanelBottom, { appLayoutInternals: appLayoutInternals, splitPanelInternals: splitPanelInternals }, splitPanel)), splitPanelOpen: splitPanelOpen, placement: placement, contentType: contentType, maxContentWidth: maxContentWidth, disableContentPaddings: disableContentPaddings })));
});
export default AppLayoutVisualRefreshToolbar;
//# sourceMappingURL=index.js.map