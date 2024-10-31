import { __rest } from "tslib";
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';
import { useAppLayoutToolbarEnabled } from '../app-layout/utils/feature-flags';
import { useInternalI18n } from '../i18n/context';
import { getBaseProps } from '../internal/base-component';
import { LinkDefaultVariantContext } from '../internal/context/link-default-variant-context';
import { createWidgetizedComponent } from '../internal/widgets';
import InternalLiveRegion from '../live-region/internal';
import InternalStatusIndicator from '../status-indicator/internal';
import styles from './styles.css.js';
export function HelpPanelImplementation(_a) {
    var { header, footer, children, loading, loadingText, __internalRootRef } = _a, restProps = __rest(_a, ["header", "footer", "children", "loading", "loadingText", "__internalRootRef"]);
    const baseProps = getBaseProps(restProps);
    const isToolbar = useAppLayoutToolbarEnabled();
    const i18n = useInternalI18n('help-panel');
    const containerProps = Object.assign(Object.assign({}, baseProps), { className: clsx(baseProps.className, styles['help-panel'], isToolbar && styles['with-toolbar']) });
    return loading ? (React.createElement("div", Object.assign({}, containerProps, { ref: __internalRootRef }),
        React.createElement(InternalStatusIndicator, { type: "loading" },
            React.createElement(InternalLiveRegion, { tagName: "span" }, i18n('loadingText', loadingText))))) : (React.createElement("div", Object.assign({}, containerProps, { ref: __internalRootRef }),
        header && React.createElement("div", { className: clsx(styles.header) }, header),
        React.createElement(LinkDefaultVariantContext.Provider, { value: { defaultVariant: 'primary' } },
            React.createElement("div", { className: styles.content }, children)),
        footer && React.createElement("div", { className: styles.footer }, footer)));
}
export const createWidgetizedHelpPanel = createWidgetizedComponent(HelpPanelImplementation);
//# sourceMappingURL=implementation.js.map