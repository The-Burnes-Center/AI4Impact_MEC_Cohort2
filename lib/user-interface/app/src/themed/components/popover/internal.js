import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import clsx from 'clsx';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { getFirstFocusable } from '../internal/components/focus-lock/utils';
import Portal from '../internal/components/portal';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import ResetContextsForModal from '../internal/context/reset-contexts-for-modal';
import { useSingleTabStopNavigation } from '../internal/context/single-tab-stop-navigation-context';
import { fireNonCancelableEvent } from '../internal/events/index';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { usePortalModeClasses } from '../internal/hooks/use-portal-mode-classes';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { KeyCode } from '../internal/keycode';
import Arrow from './arrow';
import PopoverBody from './body';
import PopoverContainer from './container';
import styles from './styles.css.js';
export default React.forwardRef(InternalPopover);
function InternalPopover(_a, ref) {
    var { position = 'right', size = 'medium', fixedWidth = false, triggerType = 'text', dismissButton = true, children, header, content, triggerAriaLabel, wrapTriggerText = true, renderWithPortal = false, __onOpen, __internalRootRef = null, __closeAnalyticsAction } = _a, restProps = __rest(_a, ["position", "size", "fixedWidth", "triggerType", "dismissButton", "children", "header", "content", "triggerAriaLabel", "wrapTriggerText", "renderWithPortal", "__onOpen", "__internalRootRef", "__closeAnalyticsAction"]);
    const baseProps = getBaseProps(restProps);
    const triggerRef = useRef(null);
    const popoverRef = useRef(null);
    const clickFrameId = useRef(null);
    const i18n = useInternalI18n('popover');
    const dismissAriaLabel = i18n('dismissAriaLabel', restProps.dismissAriaLabel);
    const [visible, setVisible] = useState(false);
    const focusTrigger = useCallback(() => {
        var _a, _b;
        if (triggerType === 'text') {
            (_a = triggerRef.current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        else {
            triggerRef.current && ((_b = getFirstFocusable(triggerRef.current)) === null || _b === void 0 ? void 0 : _b.focus());
        }
    }, [triggerType]);
    const onTriggerClick = useCallback(() => {
        fireNonCancelableEvent(__onOpen);
        setVisible(true);
    }, [__onOpen]);
    const onDismiss = useCallback(() => {
        setVisible(false);
        focusTrigger();
    }, [focusTrigger]);
    const onTriggerKeyDown = useCallback((event) => {
        const isEscapeKey = event.keyCode === KeyCode.escape;
        const isTabKey = event.keyCode === KeyCode.tab;
        if (isEscapeKey && visible) {
            event.stopPropagation();
        }
        if (isTabKey || isEscapeKey) {
            setVisible(false);
        }
    }, [visible]);
    useImperativeHandle(ref, () => ({
        dismissPopover: onDismiss,
        focus: () => {
            setVisible(false);
            focusTrigger();
        },
    }));
    useEffect(() => {
        if (!triggerRef.current) {
            return;
        }
        const document = triggerRef.current.ownerDocument;
        const onDocumentClick = () => {
            // Dismiss popover unless there was a click inside within the last animation frame.
            if (clickFrameId.current === null) {
                setVisible(false);
            }
        };
        document.addEventListener('mousedown', onDocumentClick);
        return () => {
            document.removeEventListener('mousedown', onDocumentClick);
        };
    }, []);
    const popoverClasses = usePortalModeClasses(triggerRef);
    const triggerProps = {
        // https://github.com/microsoft/TypeScript/issues/36659
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref: triggerRef,
        onClick: onTriggerClick,
        onKeyDown: onTriggerKeyDown,
        className: clsx(styles.trigger, styles[`trigger-type-${triggerType}`]),
    };
    const { tabIndex: triggerTabIndex } = useSingleTabStopNavigation(triggerRef);
    const referrerId = useUniqueId();
    const popoverContent = (React.createElement("div", { "aria-live": dismissButton ? undefined : 'polite', "aria-atomic": dismissButton ? undefined : true, className: clsx(popoverClasses, !renderWithPortal && styles['popover-inline-content']), "data-awsui-referrer-id": referrerId }, visible && (React.createElement(PopoverContainer, { size: size, fixedWidth: fixedWidth, position: position, trackRef: triggerRef, arrow: position => React.createElement(Arrow, { position: position }), renderWithPortal: renderWithPortal, zIndex: renderWithPortal ? 7000 : undefined },
        React.createElement(LinkDefaultVariantContext.Provider, { value: { defaultVariant: 'primary' } },
            React.createElement(PopoverBody, { dismissButton: dismissButton, dismissAriaLabel: dismissAriaLabel, header: header, onDismiss: onDismiss, overflowVisible: "both", closeAnalyticsAction: __closeAnalyticsAction }, content))))));
    const mergedRef = useMergeRefs(popoverRef, __internalRootRef);
    return (React.createElement("span", Object.assign({}, baseProps, { className: clsx(styles.root, baseProps.className, triggerType === 'filtering-token' && styles['root-filtering-token']), ref: mergedRef, onMouseDown: () => {
            // Indicate there was a click inside popover recently, including nested portals.
            clickFrameId.current = requestAnimationFrame(() => {
                clickFrameId.current = null;
            });
        } }),
        triggerType === 'text' ? (React.createElement("button", Object.assign({}, triggerProps, { className: clsx(triggerProps.className, wrapTriggerText === false && styles['overflow-ellipsis']), tabIndex: triggerTabIndex, type: "button", "aria-haspopup": "dialog", id: referrerId, "aria-label": triggerAriaLabel }), children)) : (React.createElement("span", Object.assign({}, triggerProps, { id: referrerId }), children)),
        React.createElement(ResetContextsForModal, null, renderWithPortal ? React.createElement(Portal, null, popoverContent) : popoverContent)));
}
//# sourceMappingURL=internal.js.map