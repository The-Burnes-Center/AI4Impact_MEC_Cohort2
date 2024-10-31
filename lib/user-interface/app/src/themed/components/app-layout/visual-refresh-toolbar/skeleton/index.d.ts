import React from 'react';
import { AppLayoutPropsWithDefaults } from '../../interfaces';
interface SkeletonLayoutProps extends Pick<AppLayoutPropsWithDefaults, 'notifications' | 'headerVariant' | 'contentHeader' | 'content' | 'contentType' | 'maxContentWidth' | 'disableContentPaddings' | 'navigation' | 'navigationOpen' | 'navigationWidth' | 'tools' | 'toolsOpen' | 'toolsWidth' | 'placement'> {
    style?: React.CSSProperties;
    toolbar?: React.ReactNode;
    splitPanelOpen?: boolean;
    sideSplitPanel?: React.ReactNode;
    bottomSplitPanel?: React.ReactNode;
    globalTools?: React.ReactNode;
    globalToolsOpen?: boolean;
}
export declare const SkeletonLayout: React.ForwardRefExoticComponent<SkeletonLayoutProps & React.RefAttributes<HTMLDivElement>>;
export {};
//# sourceMappingURL=index.d.ts.map