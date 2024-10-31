import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { createContext, useCallback, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState, } from 'react';
import { useStableCallback } from '@cloudscape-design/component-toolkit/internal';
import { getOffsetInlineStart } from '@cloudscape-design/component-toolkit/internal';
import { DynamicOverlapContext } from '../../internal/context/dynamic-overlap-context';
import { fireNonCancelableEvent } from '../../internal/events';
import { useControllable } from '../../internal/hooks/use-controllable';
import { useMobile } from '../../internal/hooks/use-mobile';
import { useUniqueId } from '../../internal/hooks/use-unique-id';
import { getSplitPanelDefaultSize } from '../../split-panel/utils/size-utils';
import { SPLIT_PANEL_MIN_WIDTH } from '../split-panel';
import { checkSplitPanelForcedPosition } from '../split-panel/split-panel-utils';
import { useDrawers } from '../utils/use-drawers';
import { useFocusControl } from '../utils/use-focus-control';
import useResize from '../utils/use-resize';
import { useSplitPanelFocusControl } from '../utils/use-split-panel-focus-control';
import { getSplitPanelPosition } from './split-panel';
import useBackgroundOverlap from './use-background-overlap';
import styles from './styles.css.js';
/**
 * The default values are destructured in the context instantiation to
 * prevent downstream Typescript errors. This could likely be replaced
 * by a context interface definition that extends the AppLayout interface.
 */
const AppLayoutInternalsContext = createContext(null);
export function useAppLayoutInternals() {
    const ctx = useContext(AppLayoutInternalsContext);
    if (!ctx) {
        throw new Error('Invariant violation: this context is only available inside app layout');
    }
    return ctx;
}
export const AppLayoutInternalsProvider = React.forwardRef((props, forwardRef) => {
    var _a, _b, _c, _d, _e;
    const { toolsHide, toolsOpen: controlledToolsOpen, navigationHide, navigationOpen, contentType, placement, children, splitPanel, } = props;
    const isMobile = useMobile();
    // Private API for embedded view mode
    const __embeddedViewMode = Boolean(props.__embeddedViewMode);
    /**
     * Set the default values for minimum and maximum content width.
     */
    const geckoMaxCssLength = ((1 << 30) - 1) / 60;
    const halfGeckoMaxCssLength = geckoMaxCssLength / 2;
    // CSS lengths in Gecko are limited to at most (1<<30)-1 app units (Gecko uses 60 as app unit).
    // Limit the maxContentWidth to the half of the upper boundary (≈4230^2) to be on the safe side.
    const maxContentWidth = props.maxContentWidth && props.maxContentWidth > halfGeckoMaxCssLength
        ? halfGeckoMaxCssLength
        : (_a = props.maxContentWidth) !== null && _a !== void 0 ? _a : 0;
    const minContentWidth = (_b = props.minContentWidth) !== null && _b !== void 0 ? _b : 280;
    const { refs: navigationRefs, setFocus: focusNavButtons } = useFocusControl(navigationOpen);
    const handleNavigationClick = useStableCallback(function handleNavigationChange(isOpen) {
        focusNavButtons();
        fireNonCancelableEvent(props.onNavigationChange, { open: isOpen });
    });
    useEffect(() => {
        // Close navigation drawer on mobile so that the main content is visible
        if (isMobile) {
            handleNavigationClick(false);
        }
    }, [isMobile, handleNavigationClick]);
    const toolsWidth = props.toolsWidth;
    const [isToolsOpen = false, setIsToolsOpen] = useControllable(controlledToolsOpen, props.onToolsChange, false, {
        componentName: 'AppLayout',
        controlledProp: 'toolsOpen',
        changeHandler: 'onToolsChange',
    });
    const { refs: toolsRefs, setFocus: focusToolsButtons, loseFocus: loseToolsFocus, } = useFocusControl(isToolsOpen, true);
    const handleToolsClick = useCallback(function handleToolsChange(isOpen, skipFocusControl) {
        setIsToolsOpen(isOpen);
        !skipFocusControl && focusToolsButtons();
        fireNonCancelableEvent(props.onToolsChange, { open: isOpen });
    }, [props.onToolsChange, setIsToolsOpen, focusToolsButtons]);
    /**
     * Set the default values for the minimum and maximum Split Panel width when it is
     * in the side position. The useLayoutEffect will compute the available space in the
     * DOM for the Split Panel given the current state. The minimum and maximum
     * widths will potentially trigger a side effect that will put the Split Panel into
     * a forced position on the bottom.
     */
    const [splitPanelMaxWidth, setSplitPanelMaxWidth] = useState(SPLIT_PANEL_MIN_WIDTH);
    /**
     * The useControllable hook will set the default value and manage either
     * the controlled or uncontrolled state of the Split Panel. By default
     * the Split Panel should always be closed on page load.
     *
     * The callback that will be passed to the SplitPanel component
     * to handle the click events that will change the state of the SplitPanel
     * to open or closed given the current state. It will set the isSplitPanelOpen
     * controlled state and fire the onSplitPanelToggle event.
     */
    const [isSplitPanelOpen, setIsSplitPanelOpen] = useControllable(props.splitPanelOpen, props.onSplitPanelToggle, false, { componentName: 'AppLayout', controlledProp: 'splitPanelOpen', changeHandler: 'onSplitPanelToggle' });
    /**
     * The useControllable hook will manage the controlled or uncontrolled
     * state of the splitPanelPreferences. By default the splitPanelPreferences
     * is undefined. When set the object shape should have a single key to indicate
     * either bottom or side position.
     *
     * The callback that will handle changes to the splitPanelPreferences
     * object that will determine if the SplitPanel is rendered either on the
     * bottom of the viewport or within the Tools container.
     */
    const [splitPanelPreferences, setSplitPanelPreferences] = useControllable(props.splitPanelPreferences, props.onSplitPanelPreferencesChange, undefined, {
        componentName: 'AppLayout',
        controlledProp: 'splitPanelPreferences',
        changeHandler: 'onSplitPanelPreferencesChange',
    });
    const { refs: splitPanelRefs, setLastInteraction: setSplitPanelLastInteraction } = useSplitPanelFocusControl([
        splitPanelPreferences,
        isSplitPanelOpen,
    ]);
    const handleSplitPanelClick = useCallback(function handleSplitPanelChange() {
        setIsSplitPanelOpen(!isSplitPanelOpen);
        setSplitPanelLastInteraction({ type: isSplitPanelOpen ? 'close' : 'open' });
        fireNonCancelableEvent(props.onSplitPanelToggle, { open: !isSplitPanelOpen });
    }, [props.onSplitPanelToggle, isSplitPanelOpen, setIsSplitPanelOpen, setSplitPanelLastInteraction]);
    const isSplitPanelForcedPosition = checkSplitPanelForcedPosition({ isMobile, splitPanelMaxWidth });
    const splitPanelPosition = getSplitPanelPosition(isSplitPanelForcedPosition, splitPanelPreferences);
    /**
     * The useControllable hook will set the default size of the SplitPanel based
     * on the default position set in the splitPanelPreferences. The logic for the
     * default size is contained in the SplitPanel component. The splitPanelControlledSize
     * will be bound to the size property in the SplitPanel context for rendering.
     *
     * The callback that will be passed to the SplitPanel component
     * to handle the resize events that will change the size of the SplitPanel.
     * It will set the splitPanelControlledSize controlled state and fire the
     * onSplitPanelResize event.
     */
    const [splitPanelReportedSize, setSplitPanelReportedSize] = useState(0);
    const [splitPanelReportedHeaderHeight, setSplitPanelReportedHeaderHeight] = useState(0);
    const [splitPanelToggle, setSplitPanelToggle] = useState({
        displayed: false,
        ariaLabel: undefined,
    });
    const splitPanelDisplayed = !!(splitPanelToggle.displayed || isSplitPanelOpen) && !!splitPanel;
    const splitPanelControlId = useUniqueId('split-panel-');
    const toolsControlId = useUniqueId('tools-');
    const [splitPanelSize, setSplitPanelSize] = useControllable(props.splitPanelSize, props.onSplitPanelResize, getSplitPanelDefaultSize(splitPanelPosition), { componentName: 'AppLayout', controlledProp: 'splitPanelSize', changeHandler: 'onSplitPanelResize' });
    const handleSplitPanelResize = useCallback((size) => {
        setSplitPanelSize(size);
        fireNonCancelableEvent(props.onSplitPanelResize, { size });
    }, [props.onSplitPanelResize, setSplitPanelSize]);
    const handleSplitPanelPreferencesChange = useCallback(function handleSplitPanelChange(detail) {
        setSplitPanelPreferences(detail);
        setSplitPanelLastInteraction({ type: 'position' });
        fireNonCancelableEvent(props.onSplitPanelPreferencesChange, detail);
    }, [props.onSplitPanelPreferencesChange, setSplitPanelPreferences, setSplitPanelLastInteraction]);
    const _f = useDrawers(props, props.ariaLabels, {
        disableDrawersMerge: true,
        ariaLabels: props.ariaLabels,
        toolsHide,
        toolsOpen: isToolsOpen,
        tools: props.tools,
        toolsWidth,
        onToolsToggle: handleToolsClick,
    }), { drawers, activeDrawer, activeDrawerId, minDrawerSize: drawersMinWidth, onActiveDrawerChange, onActiveDrawerResize, activeDrawerSize } = _f, drawersProps = __rest(_f, ["drawers", "activeDrawer", "activeDrawerId", "minDrawerSize", "onActiveDrawerChange", "onActiveDrawerResize", "activeDrawerSize"]);
    const [drawersMaxWidth, setDrawersMaxWidth] = useState(toolsWidth);
    const hasDrawers = !!drawers && drawers.length > 0;
    const { refs: drawersRefs, setFocus: focusDrawersButtons, loseFocus: loseDrawersFocus, } = useFocusControl(!!activeDrawerId, true, activeDrawerId);
    const drawerRef = useRef(null);
    const { resizeHandle, drawerSize } = useResize(drawerRef, {
        onActiveDrawerResize,
        activeDrawerSize,
        activeDrawer,
        drawersRefs,
        isToolsOpen,
        drawersMaxWidth,
        drawersMinWidth,
    });
    const handleDrawersClick = (id, skipFocusControl) => {
        const newActiveDrawerId = id !== activeDrawerId ? id : null;
        onActiveDrawerChange(newActiveDrawerId);
        !skipFocusControl && focusDrawersButtons();
    };
    let drawersTriggerCount = drawers ? drawers.length : !toolsHide ? 1 : 0;
    if (splitPanelDisplayed && splitPanelPosition === 'side') {
        drawersTriggerCount++;
    }
    const hasOpenDrawer = !!activeDrawerId ||
        (!toolsHide && isToolsOpen) ||
        (splitPanelDisplayed && splitPanelPosition === 'side' && isSplitPanelOpen);
    const hasDrawerViewportOverlay = isMobile && (!!activeDrawerId || (!navigationHide && navigationOpen) || (!toolsHide && isToolsOpen));
    const layoutElement = useRef(null);
    const mainElement = useRef(null);
    const [mainOffsetLeft, setMainOffsetLeft] = useState(0);
    const { hasBackgroundOverlap, updateBackgroundOverlapHeight } = useBackgroundOverlap({
        contentHeader: props.contentHeader,
        disableContentHeaderOverlap: props.disableContentHeaderOverlap,
        layoutElement,
    });
    useLayoutEffect(function handleMainOffsetLeft() {
        const offsetInlineStart = (mainElement === null || mainElement === void 0 ? void 0 : mainElement.current) ? getOffsetInlineStart(mainElement === null || mainElement === void 0 ? void 0 : mainElement.current) : 0;
        setMainOffsetLeft(offsetInlineStart);
    }, [placement.inlineSize, navigationOpen, isToolsOpen, splitPanelReportedSize]);
    /**
     * On mobile viewports the navigation and tools drawers are adjusted to a fixed position
     * that consumes 100% of the viewport height and width. The body content could potentially
     * be scrollable underneath the drawer. In order to prevent this a CSS class needs to be
     * added to the document body that sets overflow to hidden.
     */
    useEffect(function handleBodyScroll() {
        if (isMobile && (navigationOpen || isToolsOpen || !!activeDrawer)) {
            document.body.classList.add(styles['block-body-scroll']);
        }
        else {
            document.body.classList.remove(styles['block-body-scroll']);
        }
        // Ensure the CSS class is removed from the body on side effect cleanup
        return function cleanup() {
            document.body.classList.remove(styles['block-body-scroll']);
        };
    }, [isMobile, navigationOpen, isToolsOpen, activeDrawer]);
    const [notificationsHeight, setNotificationsHeight] = useState(0);
    const hasNotificationsContent = notificationsHeight > 0;
    /**
     * Determine the offsetBottom value based on the presence of a footer element and
     * the SplitPanel component. Ignore the SplitPanel if it is not in the bottom
     * position. Use the size property if it is open and the header height if it is closed.
     */
    let offsetBottom = placement.insetBlockEnd;
    if (splitPanelDisplayed && splitPanelPosition === 'bottom') {
        if (isSplitPanelOpen) {
            offsetBottom += splitPanelReportedSize;
        }
        else {
            offsetBottom += splitPanelReportedHeaderHeight;
        }
    }
    /**
     * Warning! This is a hack! In order to accurately calculate if there is adequate
     * horizontal space for the Split Panel to be in the side position we need two values
     * that are not available in JavaScript.
     *
     * The first is the the content gap on the right which is stored in a design token
     * and applied in the Layout CSS:
     *
     * $contentGapRight: #{awsui.$space-layout-content-horizontal};
     *
     * The second is the width of the element that has the circular buttons for the
     * Tools and Split Panel. This could be suppressed given the state of the Tools
     * drawer returning a zero value. It would, however, be rendered if the Split Panel
     * were to move into the side position. This is calculated in the Tools CSS and
     * the Trigger button CSS with design tokens:
     *
     * padding: awsui.$space-scaled-s awsui.$space-layout-toggle-padding;
     * width: awsui.$space-layout-toggle-diameter;
     *
     * These values will be defined below as static integers that are rough approximations
     * of their computed width when rendered in the DOM, but doubled to ensure adequate
     * spacing for the Split Panel to be in side position.
     */
    useLayoutEffect(function handleSplitPanelMaxWidth() {
        const contentGapRight = 50; // Approximately 24px when rendered but doubled for safety
        const toolsFormOffsetWidth = 120; // Approximately 60px when rendered but doubled for safety
        const getPanelOffsetWidth = () => {
            if (drawers) {
                return activeDrawerId ? drawerSize : 0;
            }
            return isToolsOpen ? toolsWidth : 0;
        };
        setSplitPanelMaxWidth(placement.inlineSize -
            mainOffsetLeft -
            minContentWidth -
            contentGapRight -
            toolsFormOffsetWidth -
            getPanelOffsetWidth());
        setDrawersMaxWidth(placement.inlineSize - mainOffsetLeft - minContentWidth - contentGapRight - toolsFormOffsetWidth);
    }, [
        activeDrawerId,
        drawerSize,
        drawers,
        navigationOpen,
        isToolsOpen,
        placement.inlineSize,
        mainOffsetLeft,
        minContentWidth,
        toolsWidth,
    ]);
    /**
     * The useImperativeHandle hook in conjunction with the forwardRef function
     * in the AppLayout component definition expose the following callable
     * functions to component consumers when they put a ref as a property on
     * their component implementation.
     */
    useImperativeHandle(forwardRef, function createImperativeHandle() {
        return {
            closeNavigationIfNecessary: function () {
                isMobile && handleNavigationClick(false);
            },
            openTools: function () {
                handleToolsClick(true, hasDrawers);
                if (hasDrawers) {
                    focusDrawersButtons(true);
                }
            },
            focusToolsClose: () => {
                if (hasDrawers) {
                    focusDrawersButtons(true);
                }
                else {
                    focusToolsButtons(true);
                }
            },
            focusActiveDrawer: () => focusDrawersButtons(true),
            focusSplitPanel: () => { var _a; return (_a = splitPanelRefs.slider.current) === null || _a === void 0 ? void 0 : _a.focus(); },
        };
    }, [
        isMobile,
        handleNavigationClick,
        handleToolsClick,
        focusToolsButtons,
        focusDrawersButtons,
        splitPanelRefs.slider,
        hasDrawers,
    ]);
    return (React.createElement(AppLayoutInternalsContext.Provider, { value: Object.assign(Object.assign({}, props), { activeDrawerId,
            contentType,
            drawers, drawersAriaLabel: (_c = drawersProps.ariaLabelsWithDrawers) === null || _c === void 0 ? void 0 : _c.drawers, drawersOverflowAriaLabel: (_d = drawersProps.ariaLabelsWithDrawers) === null || _d === void 0 ? void 0 : _d.drawersOverflow, drawersOverflowWithBadgeAriaLabel: (_e = drawersProps.ariaLabelsWithDrawers) === null || _e === void 0 ? void 0 : _e.drawersOverflowWithBadge, drawersRefs,
            drawersMinWidth,
            drawersMaxWidth,
            drawerSize,
            drawerRef,
            resizeHandle,
            drawersTriggerCount, headerHeight: placement.insetBlockStart, footerHeight: placement.insetBlockEnd, hasDrawerViewportOverlay,
            handleDrawersClick,
            handleNavigationClick,
            handleSplitPanelClick,
            handleSplitPanelPreferencesChange,
            handleSplitPanelResize,
            handleToolsClick,
            hasBackgroundOverlap,
            hasNotificationsContent,
            hasOpenDrawer, isBackgroundOverlapDisabled: props.disableContentHeaderOverlap || !hasBackgroundOverlap, isMobile,
            isSplitPanelForcedPosition,
            isSplitPanelOpen,
            isToolsOpen,
            layoutElement, layoutWidth: placement.inlineSize, loseToolsFocus,
            loseDrawersFocus,
            mainElement,
            mainOffsetLeft,
            maxContentWidth,
            minContentWidth,
            navigationHide,
            navigationRefs,
            notificationsHeight,
            setNotificationsHeight,
            offsetBottom,
            setSplitPanelReportedSize,
            setSplitPanelReportedHeaderHeight,
            splitPanel,
            splitPanelControlId,
            splitPanelDisplayed,
            splitPanelMaxWidth,
            splitPanelPosition,
            splitPanelPreferences,
            splitPanelReportedSize,
            splitPanelReportedHeaderHeight,
            splitPanelSize,
            splitPanelToggle,
            setSplitPanelToggle,
            splitPanelRefs,
            toolsControlId,
            toolsHide, toolsOpen: isToolsOpen, toolsWidth,
            toolsRefs,
            __embeddedViewMode }) },
        React.createElement(DynamicOverlapContext.Provider, { value: updateBackgroundOverlapHeight }, children)));
});
//# sourceMappingURL=context.js.map