// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { InternalButton } from '../../button/internal';
import customCssProps from '../../internal/generated/custom-css-properties';
import { getLimitedValue } from '../../split-panel/utils/size-utils';
import { splitItems } from '../drawer/drawers-helpers';
import OverflowMenu from '../drawer/overflow-menu';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';
import { useAppLayoutInternals } from './context';
import SplitPanel from './split-panel';
import TriggerButton from './trigger-button';
import splitPanelTestUtilStyles from '../../split-panel/test-classes/styles.css.js';
import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
/**
 * The VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT is used to reduce the number
 * of triggers that are initially visible on the mobile toolbar, the rest
 * are then placed into an overflow menu
 *
 * Note if one of the triggers is for a split-panel, it would not count that
 */
export const VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT = 2;
/**
 * The Drawers root component is mounted in the AppLayout index file. It will only
 * render if the drawers are defined, and it will take over the mounting of and
 * rendering of the Tools and SplitPanel (side position) if they exist. If drawers
 * do not exist then the Tools and SplitPanel will be handled by the Tools component.
 */
export default function Drawers() {
    const { disableBodyScroll, drawers, drawersTriggerCount, hasDrawerViewportOverlay, hasOpenDrawer, navigationOpen, navigationHide, isMobile, } = useAppLayoutInternals();
    const isUnfocusable = hasDrawerViewportOverlay && navigationOpen && !navigationHide;
    if (!drawers || drawersTriggerCount === 0) {
        return null;
    }
    return (React.createElement("div", { className: clsx(styles['drawers-container'], {
            [styles['disable-body-scroll']]: disableBodyScroll,
            [styles['has-open-drawer']]: hasOpenDrawer,
            [styles.unfocusable]: isUnfocusable,
        }) },
        React.createElement(SplitPanel.Side, null),
        React.createElement(ActiveDrawer, null),
        !isMobile && React.createElement(DesktopTriggers, null)));
}
function ActiveDrawer() {
    var _a, _b, _c, _d;
    const { activeDrawerId, ariaLabels, drawers, drawersRefs, handleDrawersClick, handleToolsClick, hasDrawerViewportOverlay, isMobile, navigationOpen, navigationHide, loseDrawersFocus, resizeHandle, drawerSize, drawersMinWidth, drawersMaxWidth, drawerRef, } = useAppLayoutInternals();
    const activeDrawer = (_a = drawers === null || drawers === void 0 ? void 0 : drawers.find(item => item.id === activeDrawerId)) !== null && _a !== void 0 ? _a : null;
    const computedAriaLabels = {
        closeButton: activeDrawerId ? (_b = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.ariaLabels) === null || _b === void 0 ? void 0 : _b.closeButton : ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.toolsClose,
        content: activeDrawerId ? (_c = activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.ariaLabels) === null || _c === void 0 ? void 0 : _c.drawerName : ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.tools,
    };
    const isHidden = !activeDrawerId;
    const isUnfocusable = isHidden || (hasDrawerViewportOverlay && navigationOpen && !navigationHide);
    const isToolsDrawer = activeDrawerId === TOOLS_DRAWER_ID;
    const toolsContent = (_d = drawers === null || drawers === void 0 ? void 0 : drawers.find(drawer => drawer.id === TOOLS_DRAWER_ID)) === null || _d === void 0 ? void 0 : _d.content;
    const size = getLimitedValue(drawersMinWidth, drawerSize, drawersMaxWidth);
    return (React.createElement("aside", { id: activeDrawerId !== null && activeDrawerId !== void 0 ? activeDrawerId : undefined, "aria-hidden": isHidden, "aria-label": computedAriaLabels.content, className: clsx(styles.drawer, {
            [styles['is-drawer-open']]: activeDrawerId,
            [styles.unfocusable]: isUnfocusable,
            [testutilStyles['active-drawer']]: activeDrawerId,
            [testutilStyles.tools]: isToolsDrawer,
        }), style: Object.assign({}, (!isMobile && drawerSize && { [customCssProps.drawerSize]: `${size}px` })), ref: drawerRef, onBlur: e => {
            if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                loseDrawersFocus();
            }
        } },
        !isMobile && (activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.resizable) && React.createElement("div", { className: styles['drawer-slider'] }, resizeHandle),
        React.createElement("div", { className: styles['drawer-content-container'] },
            React.createElement("div", { className: styles['drawer-close-button'] },
                React.createElement(InternalButton, { ariaLabel: computedAriaLabels.closeButton, className: clsx({
                        [testutilStyles['active-drawer-close-button']]: activeDrawerId,
                        [testutilStyles['tools-close']]: isToolsDrawer,
                    }), formAction: "none", iconName: isMobile ? 'close' : 'angle-right', onClick: () => {
                        handleDrawersClick(activeDrawerId);
                        handleToolsClick(false);
                    }, ref: drawersRefs.close, variant: "icon" })),
            toolsContent && (React.createElement("div", { className: clsx(styles['drawer-content'], activeDrawerId !== TOOLS_DRAWER_ID && styles['drawer-content-hidden']) }, toolsContent)),
            activeDrawerId !== TOOLS_DRAWER_ID && (React.createElement("div", { className: styles['drawer-content'] }, activeDrawerId && (activeDrawer === null || activeDrawer === void 0 ? void 0 : activeDrawer.content))))));
}
/**
 * The DesktopTriggers will render the trigger buttons for Tools, Drawers, and the
 * SplitPanel in non mobile viewports. Changes to the activeDrawerId need to be
 * tracked by the previousActiveDrawerId property in order to appropriately apply
 * the ref required to manage focus control.
 */
function DesktopTriggers() {
    const { activeDrawerId, drawers, drawersAriaLabel, drawersOverflowAriaLabel, drawersOverflowWithBadgeAriaLabel, drawersRefs, drawersTriggerCount, handleDrawersClick, handleSplitPanelClick, hasOpenDrawer, isSplitPanelOpen, splitPanel, splitPanelControlId, splitPanelDisplayed, splitPanelPosition, splitPanelRefs, splitPanelToggle, splitPanelReportedHeaderHeight, splitPanelReportedSize, headerVariant, } = useAppLayoutInternals();
    const hasMultipleTriggers = drawersTriggerCount > 1;
    const hasSplitPanel = splitPanel && splitPanelDisplayed && splitPanelPosition === 'side';
    const previousActiveDrawerId = useRef(activeDrawerId);
    const [containerHeight, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxHeight);
    if (activeDrawerId) {
        previousActiveDrawerId.current = activeDrawerId;
    }
    const splitPanelHeight = isSplitPanelOpen && splitPanelPosition === 'bottom' ? splitPanelReportedSize : splitPanelReportedHeaderHeight;
    const getIndexOfOverflowItem = () => {
        if (containerHeight) {
            const ITEM_HEIGHT = 48;
            const overflowSpot = activeDrawerId && isSplitPanelOpen
                ? (containerHeight - splitPanelReportedHeaderHeight) / 1.5
                : (containerHeight - splitPanelHeight) / 1.5;
            const index = Math.floor(overflowSpot / ITEM_HEIGHT);
            let splitPanelItem = 0;
            if (hasSplitPanel && splitPanelToggle.displayed) {
                splitPanelItem = 1;
            }
            return index - splitPanelItem;
        }
        return 0;
    };
    const { visibleItems, overflowItems } = splitItems(drawers !== null && drawers !== void 0 ? drawers : undefined, getIndexOfOverflowItem(), activeDrawerId);
    const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);
    return (React.createElement("aside", { className: clsx(styles['drawers-desktop-triggers-container'], {
            [styles['has-multiple-triggers']]: hasMultipleTriggers,
            [styles['has-open-drawer']]: hasOpenDrawer,
        }), "aria-label": drawersAriaLabel, ref: triggersContainerRef, role: "region" },
        React.createElement("div", { className: clsx(styles['drawers-trigger-content'], {
                [styles['has-multiple-triggers']]: hasMultipleTriggers,
                [styles['has-open-drawer']]: hasOpenDrawer,
            }), role: "toolbar", "aria-orientation": "vertical" },
            visibleItems.map(item => {
                var _a, _b, _c;
                const isForPreviousActiveDrawer = (previousActiveDrawerId === null || previousActiveDrawerId === void 0 ? void 0 : previousActiveDrawerId.current) === item.id;
                return (React.createElement(TriggerButton, { ariaLabel: (_a = item.ariaLabels) === null || _a === void 0 ? void 0 : _a.triggerButton, ariaExpanded: item.id === activeDrawerId, ariaControls: activeDrawerId === item.id ? item.id : undefined, className: clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'], {
                        [testutilStyles['drawers-trigger-with-badge']]: item.badge,
                        [testutilStyles['tools-toggle']]: item.id === TOOLS_DRAWER_ID,
                    }), iconName: (_b = item === null || item === void 0 ? void 0 : item.trigger) === null || _b === void 0 ? void 0 : _b.iconName, iconSvg: (_c = item === null || item === void 0 ? void 0 : item.trigger) === null || _c === void 0 ? void 0 : _c.iconSvg, key: item.id, onClick: () => handleDrawersClick(item.id), ref: isForPreviousActiveDrawer ? drawersRefs.toggle : undefined, badge: item.badge, testId: `awsui-app-layout-trigger-${item.id}`, highContrastHeader: headerVariant === 'high-contrast', selected: item.id === activeDrawerId }));
            }),
            overflowItems.length > 0 && (React.createElement(OverflowMenu, { items: overflowItems, ariaLabel: overflowMenuHasBadge ? drawersOverflowWithBadgeAriaLabel : drawersOverflowAriaLabel, customTriggerBuilder: ({ onClick, triggerRef, ariaLabel, ariaExpanded, testUtilsClass }) => (React.createElement(TriggerButton, { ref: triggerRef, ariaLabel: ariaLabel, ariaExpanded: ariaExpanded, badge: overflowMenuHasBadge, className: clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'], testUtilsClass), iconName: "ellipsis", onClick: onClick, highContrastHeader: headerVariant === 'high-contrast' })), onItemClick: ({ detail }) => {
                    handleDrawersClick(detail.id);
                } })),
            hasSplitPanel && splitPanelToggle.displayed && (React.createElement(TriggerButton, { ariaLabel: splitPanelToggle.ariaLabel, ariaControls: splitPanelControlId, ariaExpanded: !!isSplitPanelOpen, className: clsx(styles['drawers-trigger'], splitPanelTestUtilStyles['open-button']), iconName: "view-vertical", onClick: () => handleSplitPanelClick(), selected: hasSplitPanel && isSplitPanelOpen, ref: splitPanelRefs.toggle, highContrastHeader: headerVariant === 'high-contrast' })))));
}
/**
 * The MobileTriggers will be mounted inside of the AppBar component and
 * only rendered when Drawers are defined in mobile viewports. The same logic
 * will in the AppBar component will suppress the rendering of the legacy
 * trigger button for the Tools drawer.
 */
export function MobileTriggers() {
    const { activeDrawerId, drawers, drawersAriaLabel, drawersOverflowAriaLabel, drawersOverflowWithBadgeAriaLabel, drawersRefs, handleDrawersClick, hasDrawerViewportOverlay, headerVariant, } = useAppLayoutInternals();
    const previousActiveDrawerId = useRef(activeDrawerId);
    if (!drawers) {
        return null;
    }
    if (activeDrawerId) {
        previousActiveDrawerId.current = activeDrawerId;
    }
    const { visibleItems, overflowItems } = splitItems(drawers, VISIBLE_MOBILE_TOOLBAR_TRIGGERS_LIMIT, activeDrawerId);
    const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);
    return (React.createElement("aside", { "aria-hidden": hasDrawerViewportOverlay, className: clsx({
            [styles.unfocusable]: hasDrawerViewportOverlay,
        }), "aria-label": drawersAriaLabel, role: "region" },
        React.createElement("div", { className: styles['drawers-mobile-triggers-container'], role: "toolbar", "aria-orientation": "horizontal" },
            visibleItems.map(item => {
                var _a, _b, _c;
                const isForPreviousActiveDrawer = (previousActiveDrawerId === null || previousActiveDrawerId === void 0 ? void 0 : previousActiveDrawerId.current) === item.id;
                return (React.createElement(TriggerButton, { ariaExpanded: item.id === activeDrawerId, ariaLabel: (_a = item.ariaLabels) === null || _a === void 0 ? void 0 : _a.triggerButton, ariaControls: activeDrawerId === item.id ? item.id : undefined, className: clsx(styles['drawers-trigger'], testutilStyles['drawers-trigger'], {
                        [testutilStyles['drawers-trigger-with-badge']]: item.badge,
                        [testutilStyles['tools-toggle']]: item.id === TOOLS_DRAWER_ID,
                    }), disabled: hasDrawerViewportOverlay, ref: isForPreviousActiveDrawer ? drawersRefs.toggle : undefined, iconName: (_b = item === null || item === void 0 ? void 0 : item.trigger) === null || _b === void 0 ? void 0 : _b.iconName, iconSvg: (_c = item === null || item === void 0 ? void 0 : item.trigger) === null || _c === void 0 ? void 0 : _c.iconSvg, badge: item.badge, key: item.id, onClick: () => handleDrawersClick(item.id), testId: `awsui-app-layout-trigger-${item.id}`, highContrastHeader: headerVariant === 'high-contrast', selected: item.id === activeDrawerId }));
            }),
            overflowItems.length > 0 && (React.createElement(OverflowMenu, { items: overflowItems, ariaLabel: overflowMenuHasBadge ? drawersOverflowWithBadgeAriaLabel : drawersOverflowAriaLabel, onItemClick: ({ detail }) => handleDrawersClick(detail.id) })))));
}
//# sourceMappingURL=drawers.js.map