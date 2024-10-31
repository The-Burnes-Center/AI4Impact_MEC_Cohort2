import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useContainerQuery } from '@cloudscape-design/component-toolkit';
import { getAnalyticsMetadataAttribute } from '@cloudscape-design/component-toolkit/internal/analytics-metadata';
import { InternalButton } from '../button/internal';
import InternalHeader from '../header/internal';
import { useInternalI18n } from '../i18n/context';
import { PerformanceMetrics } from '../internal/analytics';
import { FunnelNameSelectorContext, } from '../internal/analytics/context/analytics-context';
import { useFunnel, useFunnelStep, useFunnelSubStep } from '../internal/analytics/hooks/use-funnel';
import { getBaseProps } from '../internal/base-component';
import FocusLock from '../internal/components/focus-lock';
import Portal from '../internal/components/portal';
import { ButtonContext } from '../internal/context/button-context';
import { ModalContext } from '../internal/context/modal-context';
import ResetContextsForModal from '../internal/context/reset-contexts-for-modal';
import { fireNonCancelableEvent } from '../internal/events';
import { useContainerBreakpoints } from '../internal/hooks/container-queries';
import { useIntersectionObserver } from '../internal/hooks/use-intersection-observer';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { useVisualRefresh } from '../internal/hooks/use-visual-mode';
import { KeyCode } from '../internal/keycode';
import { disableBodyScrolling, enableBodyScrolling } from './body-scroll';
import analyticsSelectors from './analytics-metadata/styles.css.js';
import styles from './styles.css.js';
export function InternalModalAsFunnel(props) {
    const { funnelProps, funnelSubmit, funnelNextOrSubmitAttempt } = useFunnel();
    const { funnelStepProps } = useFunnelStep();
    const { subStepRef, funnelSubStepProps } = useFunnelSubStep();
    const onButtonClick = ({ variant }) => {
        if (variant === 'primary') {
            funnelNextOrSubmitAttempt();
            funnelSubmit();
        }
    };
    return (React.createElement(InternalModal, Object.assign({ __funnelProps: funnelProps, __funnelStepProps: funnelStepProps, __subStepRef: subStepRef, __subStepFunnelProps: funnelSubStepProps, onButtonClick: onButtonClick }, props)));
}
export default function InternalModal(_a) {
    var { modalRoot, getModalRoot, removeModalRoot } = _a, rest = __rest(_a, ["modalRoot", "getModalRoot", "removeModalRoot"]);
    return (React.createElement(Portal, { container: modalRoot, getContainer: getModalRoot, removeContainer: removeModalRoot },
        React.createElement(PortaledModal, Object.assign({}, rest))));
}
// Separate component to prevent the Portal from getting in the way of refs, as it needs extra cycles to render the inner components.
// useContainerQuery needs its targeted element to exist on the first render in order to work properly.
function PortaledModal(_a) {
    var _b;
    var { size, visible, header, children, footer, disableContentPaddings, onButtonClick = () => { }, onDismiss, __internalRootRef = null, __injectAnalyticsComponentMetadata, __funnelProps, __funnelStepProps, __subStepRef, __subStepFunnelProps, referrerId } = _a, rest = __rest(_a, ["size", "visible", "header", "children", "footer", "disableContentPaddings", "onButtonClick", "onDismiss", "__internalRootRef", "__injectAnalyticsComponentMetadata", "__funnelProps", "__funnelStepProps", "__subStepRef", "__subStepFunnelProps", "referrerId"]);
    const instanceUniqueId = useUniqueId();
    const headerId = `${rest.id || instanceUniqueId}-header`;
    const lastMouseDownElementRef = useRef(null);
    const [breakpoint, breakpointsRef] = useContainerBreakpoints(['xs']);
    const i18n = useInternalI18n('modal');
    const closeAriaLabel = i18n('closeAriaLabel', rest.closeAriaLabel);
    const refObject = useRef(null);
    const mergedRef = useMergeRefs(breakpointsRef, refObject, __internalRootRef);
    const isRefresh = useVisualRefresh();
    const baseProps = getBaseProps(rest);
    const analyticsComponentMetadata = {
        name: 'awsui.Modal',
        label: `.${analyticsSelectors.header} h2`,
    };
    const metadataAttribute = __injectAnalyticsComponentMetadata
        ? getAnalyticsMetadataAttribute({ component: analyticsComponentMetadata })
        : {};
    const loadStartTime = useRef(0);
    const loadCompleteTime = useRef(0);
    const componentLoadingCount = useRef(0);
    const performanceMetricLogged = useRef(false);
    // enable body scroll and restore focus if unmounting while visible
    useEffect(() => {
        return () => {
            enableBodyScrolling();
        };
    }, []);
    const resetModalPerformanceData = () => {
        loadStartTime.current = performance.now();
        loadCompleteTime.current = 0;
        performanceMetricLogged.current = false;
    };
    const emitTimeToContentReadyInModal = (loadCompleteTime) => {
        if (componentLoadingCount.current === 0 &&
            loadStartTime.current &&
            loadStartTime.current !== 0 &&
            !performanceMetricLogged.current) {
            const timeToContentReadyInModal = loadCompleteTime - loadStartTime.current;
            PerformanceMetrics.modalPerformanceData({
                timeToContentReadyInModal,
                instanceIdentifier: instanceUniqueId,
            });
            performanceMetricLogged.current = true;
        }
    };
    const MODAL_READY_TIMEOUT = 100;
    /**
     * This useEffect is triggered when the visible attribute of modal changes.
     * When modal becomes visible, modal performance metrics are reset marking the beginning loading process.
     * To ensure that the modal component ready metric is always emitted, a setTimeout is implemented.
     * This setTimeout automatically emits the component ready metric after a specified duration.
     */
    useEffect(() => {
        if (visible) {
            disableBodyScrolling();
            resetModalPerformanceData();
            setTimeout(() => {
                emitTimeToContentReadyInModal(loadStartTime.current);
            }, MODAL_READY_TIMEOUT);
        }
        else {
            enableBodyScrolling();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);
    // Because we hide the element with styles (and not actually detach it from DOM), we need to scroll to top
    useEffect(() => {
        if (visible && refObject.current) {
            refObject.current.scrollTop = 0;
        }
    }, [visible]);
    const dismiss = (reason) => fireNonCancelableEvent(onDismiss, { reason });
    const onOverlayMouseDown = (event) => {
        lastMouseDownElementRef.current = event.target;
    };
    const onOverlayClick = (event) => {
        const overlay = refObject.current;
        const lastClicked = lastMouseDownElementRef.current;
        if (event.target === overlay && lastClicked === overlay) {
            dismiss('overlay');
        }
    };
    const onCloseButtonClick = () => dismiss('closeButton');
    const escKeyHandler = (event) => {
        if (event.keyCode === KeyCode.escape) {
            dismiss('keyboard');
        }
    };
    // We use an empty div element at the end of the content slot as a sentinel
    // to detect when the user has scrolled to the bottom.
    const { ref: stickySentinelRef, isIntersecting: footerStuck } = useIntersectionObserver();
    // Add extra scroll padding to account for the height of the sticky footer,
    // to prevent it from covering focused elements.
    const [footerHeight, footerRef] = useContainerQuery(rect => rect.borderBoxHeight);
    const { subStepRef } = useFunnelSubStep();
    return (React.createElement(FunnelNameSelectorContext.Provider, { value: `.${styles['header--text']}` },
        React.createElement(ResetContextsForModal, null,
            React.createElement(ModalContext.Provider, { value: {
                    isInModal: true,
                    componentLoadingCount,
                    emitTimeToContentReadyInModal,
                } },
                React.createElement("div", Object.assign({}, baseProps, __funnelProps, __funnelStepProps, { className: clsx(styles.root, { [styles.hidden]: !visible }, baseProps.className, isRefresh && styles.refresh), role: "dialog", "aria-modal": true, "aria-labelledby": headerId, onMouseDown: onOverlayMouseDown, onClick: onOverlayClick, ref: mergedRef, style: footerHeight ? { scrollPaddingBottom: footerHeight } : undefined, "data-awsui-referrer-id": ((_b = subStepRef.current) === null || _b === void 0 ? void 0 : _b.id) || referrerId }),
                    React.createElement(FocusLock, { disabled: !visible, autoFocus: true, restoreFocus: true, className: styles['focus-lock'] },
                        React.createElement("div", Object.assign({ className: clsx(styles.dialog, styles[size], styles[`breakpoint-${breakpoint}`], isRefresh && styles.refresh), onKeyDown: escKeyHandler }, metadataAttribute),
                            React.createElement("div", { className: styles.container },
                                React.createElement("div", { className: clsx(styles.header, analyticsSelectors.header) },
                                    React.createElement(InternalHeader, { variant: "h2", __disableActionsWrapping: true, actions: React.createElement("div", Object.assign({}, getAnalyticsMetadataAttribute({
                                            action: 'dismiss',
                                        })),
                                            React.createElement(InternalButton, { ariaLabel: closeAriaLabel, className: styles['dismiss-control'], variant: "modal-dismiss", iconName: "close", formAction: "none", onClick: onCloseButtonClick })) },
                                        React.createElement("span", { id: headerId, className: styles['header--text'] }, header))),
                                React.createElement("div", Object.assign({ ref: __subStepRef }, __subStepFunnelProps, { className: clsx(styles.content, { [styles['no-paddings']]: disableContentPaddings }) }),
                                    children,
                                    React.createElement("div", { ref: stickySentinelRef })),
                                footer && (React.createElement(ButtonContext.Provider, { value: { onClick: onButtonClick } },
                                    React.createElement("div", { ref: footerRef, className: clsx(styles.footer, footerStuck && styles['footer--stuck']) }, footer)))))))))));
}
//# sourceMappingURL=internal.js.map