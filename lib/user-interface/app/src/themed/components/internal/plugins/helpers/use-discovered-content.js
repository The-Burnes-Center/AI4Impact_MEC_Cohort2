// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { useEffect, useRef, useState } from 'react';
export function createUseDiscoveredContent(componentName, controller) {
    return function useDiscoveredContent({ type, header, children, }) {
        const headerRef = useRef(null);
        const contentRef = useRef(null);
        const replacementHeaderRef = useRef(null);
        const replacementContentRef = useRef(null);
        const [initialHidden, setInitialHidden] = useState(() => controller.initialCheck({
            type,
            header,
            content: children,
        }));
        const [headerReplacementType, setFoundHeaderReplacement] = useState('original');
        const [contentReplacementType, setFoundContentReplacement] = useState('original');
        const mountedProvider = useRef();
        useEffect(() => {
            const context = { type, headerRef, contentRef };
            setInitialHidden(false);
            return controller.onContentRegistered(provider => {
                let mounted = true;
                function checkMounted(methodName) {
                    if (!mounted) {
                        console.warn(`[AwsUi] [Runtime ${componentName} content] \`${methodName}\` called after component unmounted`);
                        return false;
                    }
                    return true;
                }
                mountedProvider.current = provider.runReplacer(context, {
                    hideHeader() {
                        if (checkMounted('hideHeader')) {
                            setFoundHeaderReplacement('remove');
                        }
                    },
                    restoreHeader() {
                        if (checkMounted('restoreHeader')) {
                            setFoundHeaderReplacement('original');
                        }
                    },
                    replaceHeader(replacer) {
                        if (checkMounted('replaceHeader')) {
                            replacer(replacementHeaderRef.current);
                            setFoundHeaderReplacement('replaced');
                        }
                    },
                    hideContent() {
                        if (checkMounted('hideContent')) {
                            setFoundContentReplacement('remove');
                        }
                    },
                    restoreContent() {
                        if (checkMounted('restoreContent')) {
                            setFoundContentReplacement('original');
                        }
                    },
                    replaceContent(replacer) {
                        if (checkMounted('replaceContent')) {
                            replacer(replacementContentRef.current);
                            setFoundContentReplacement('replaced');
                        }
                    },
                });
                return () => {
                    var _a;
                    (_a = mountedProvider.current) === null || _a === void 0 ? void 0 : _a.unmount({
                        replacementHeaderContainer: replacementHeaderRef.current,
                        replacementContentContainer: replacementContentRef.current,
                    });
                    mounted = false;
                };
            });
        }, [type]);
        useEffect(() => {
            var _a;
            (_a = mountedProvider.current) === null || _a === void 0 ? void 0 : _a.update();
        }, [type, header, children]);
        return {
            initialHidden,
            headerReplacementType,
            contentReplacementType,
            headerRef: headerRef,
            replacementHeaderRef: replacementHeaderRef,
            contentRef: contentRef,
            replacementContentRef: replacementContentRef,
        };
    };
}
//# sourceMappingURL=use-discovered-content.js.map