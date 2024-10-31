// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useRef } from 'react';
import clsx from 'clsx';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { useDensityMode } from '@cloudscape-design/component-toolkit/internal';
import { getVisualContextClassname } from '../../internal/components/visual-context';
import { CloseButton, ToggleButton, togglesConfig } from '../toggles';
import { TOOLS_DRAWER_ID } from '../utils/use-drawers';
import { splitItems } from './drawers-helpers';
import OverflowMenu from './overflow-menu';
import testutilStyles from '../test-classes/styles.css.js';
import styles from './styles.css.js';
// We are using two landmarks per drawer, i.e. two NAVs and two ASIDEs, because of several
// known bugs in NVDA that cause focus changes within a container to sometimes not be
// announced. As a result, we use one region for the open button and one region for the
// actual drawer content, always hiding the other one when it's not visible.
// An alternative solution to follow a more classic implementation here to only have one
// button that triggers the opening/closing of the drawer also did not work due to another
// series of bugs in NVDA (together with Firefox) which prevent the changed expanded state
// from being announced.
// Even with this workaround in place, the announcement of the close button when opening a
// panel in NVDA is not working correctly. The suspected root cause is one of the bugs below
// as well.
// Relevant tickets:
// * https://github.com/nvaccess/nvda/issues/6606
// * https://github.com/nvaccess/nvda/issues/5825
// * https://github.com/nvaccess/nvda/issues/5247
// * https://github.com/nvaccess/nvda/pull/8869 (reverted PR that was going to fix it)
export const Drawer = React.forwardRef(({ id, contentClassName, toggleClassName, closeClassName, width, type, toggleRefs, topOffset, bottomOffset, ariaLabels, children, hideOpenButton, isOpen, isHidden, isMobile, onToggle, onClick, onLoseFocus, resizeHandle, }, ref) => {
    const openButtonWrapperRef = useRef(null);
    const { TagName, iconName } = togglesConfig[type];
    const { mainLabel, closeLabel, openLabel } = ariaLabels;
    const drawerContentWidthOpen = isMobile ? undefined : width;
    const drawerContentWidth = isOpen ? drawerContentWidthOpen : undefined;
    const regularOpenButton = (React.createElement(TagName, { ref: openButtonWrapperRef, "aria-label": mainLabel, className: styles.toggle, "aria-hidden": isOpen },
        React.createElement(ToggleButton, { ref: toggleRefs.toggle, className: toggleClassName, iconName: iconName, ariaLabel: openLabel, onClick: () => onToggle(true), ariaExpanded: isOpen ? undefined : false })));
    return (React.createElement("div", { ref: ref, className: clsx(styles.drawer, {
            [styles.hide]: isHidden,
            [styles['drawer-closed']]: !isOpen,
            [styles['drawer-mobile']]: isMobile,
        }), style: { width: drawerContentWidth }, onBlur: onLoseFocus
            ? e => {
                if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) {
                    onLoseFocus(e);
                }
            }
            : undefined, onClick: event => {
            var _a;
            if (onClick) {
                onClick(event);
            }
            if (!isOpen) {
                // to prevent calling onToggle from the drawer when it's called from the toggle button
                if (openButtonWrapperRef.current === event.target ||
                    !((_a = openButtonWrapperRef.current) === null || _a === void 0 ? void 0 : _a.contains(event.target))) {
                    onToggle(true);
                }
            }
        } },
        React.createElement("div", { id: id, style: { width: drawerContentWidth, top: topOffset, bottom: bottomOffset }, className: clsx(styles['drawer-content'], styles['drawer-content-clickable'], contentClassName, {
                [testutilStyles['drawer-closed']]: !isOpen,
            }) },
            !isMobile && !hideOpenButton && regularOpenButton,
            React.createElement(TagName, { className: clsx(resizeHandle && styles['drawer-resize-content']), "aria-label": mainLabel, "aria-hidden": !isOpen },
                !isMobile && isOpen && React.createElement("div", { className: styles['resize-handle-wrapper'] }, resizeHandle),
                React.createElement(CloseButton, { ref: toggleRefs.close, className: closeClassName, ariaLabel: closeLabel, onClick: () => {
                        onToggle(false);
                    } }),
                children))));
});
const DrawerTrigger = React.forwardRef(({ testUtilsClassName, ariaLabel, ariaExpanded, ariaControls, badge, itemId, isActive, trigger, onClick, }, ref) => (React.createElement("div", { className: clsx(styles['drawer-trigger'], isActive && styles['drawer-trigger-active'], isActive && getVisualContextClassname('app-layout-tools-drawer-trigger')), onClick: onClick },
    React.createElement(ToggleButton, { ref: ref, className: testUtilsClassName, iconName: trigger.iconName, iconSvg: trigger.iconSvg, ariaLabel: ariaLabel, ariaExpanded: ariaExpanded, ariaControls: ariaControls, badge: badge, testId: itemId && `awsui-app-layout-trigger-${itemId}` }))));
export const DrawerTriggersBar = ({ isMobile, topOffset, bottomOffset, activeDrawerId, ariaLabels, drawers, drawerRefs, onDrawerChange, }) => {
    const containerRef = React.useRef(null);
    const previousActiveDrawerId = useRef(activeDrawerId);
    const [containerHeight, triggersContainerRef] = useContainerQuery(rect => rect.contentBoxHeight);
    const isCompactMode = useDensityMode(containerRef) === 'compact';
    if (activeDrawerId) {
        previousActiveDrawerId.current = activeDrawerId;
    }
    const getIndexOfOverflowItem = () => {
        if (containerHeight) {
            const ITEM_HEIGHT = isCompactMode ? 34 : 38;
            const overflowSpot = containerHeight / 1.5;
            const index = Math.floor(overflowSpot / ITEM_HEIGHT);
            return index;
        }
        return 0;
    };
    const { visibleItems, overflowItems } = splitItems(drawers, getIndexOfOverflowItem(), activeDrawerId);
    const overflowMenuHasBadge = !!overflowItems.find(item => item.badge);
    return (React.createElement("div", { className: clsx(styles.drawer, styles['drawer-closed'], testutilStyles['drawer-closed'], {
            [styles['drawer-mobile']]: isMobile,
            [styles.hide]: drawers.length === 1 && !!activeDrawerId,
        }), ref: containerRef },
        React.createElement("div", { ref: triggersContainerRef, style: { top: topOffset, bottom: bottomOffset }, className: clsx(styles['drawer-content'], {
                [styles['drawer-content-clickable']]: drawers.length === 1,
            }), onClick: drawers.length === 1
                ? () => onDrawerChange(drawers[0].id !== activeDrawerId ? drawers[0].id : null)
                : undefined }, !isMobile && (React.createElement("aside", { "aria-label": ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.drawers, role: "region" },
            React.createElement("div", { className: styles['drawer-triggers-wrapper'], role: "toolbar", "aria-orientation": "vertical" },
                visibleItems.map((item, index) => {
                    var _a;
                    return (React.createElement(DrawerTrigger, { key: index, testUtilsClassName: clsx(testutilStyles['drawers-trigger'], item.id === TOOLS_DRAWER_ID && testutilStyles['tools-toggle']), ariaExpanded: activeDrawerId === item.id, ref: item.id === previousActiveDrawerId.current ? drawerRefs.toggle : undefined, ariaLabel: (_a = item.ariaLabels) === null || _a === void 0 ? void 0 : _a.triggerButton, ariaControls: activeDrawerId === item.id ? item.id : undefined, trigger: item.trigger, badge: item.badge, itemId: item.id, isActive: activeDrawerId === item.id, onClick: drawers.length !== 1
                            ? () => onDrawerChange(item.id !== activeDrawerId ? item.id : null)
                            : undefined }));
                }),
                overflowItems.length > 0 && (React.createElement("div", { className: styles['drawer-trigger'] },
                    React.createElement(OverflowMenu, { ariaLabel: overflowMenuHasBadge ? ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.drawersOverflowWithBadge : ariaLabels === null || ariaLabels === void 0 ? void 0 : ariaLabels.drawersOverflow, items: overflowItems, onItemClick: ({ detail }) => onDrawerChange(detail.id) })))))))));
};
//# sourceMappingURL=index.js.map