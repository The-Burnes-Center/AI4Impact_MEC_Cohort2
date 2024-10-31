import { AppLayoutPropsWithDefaults } from '../interfaces';
interface HorizontalLayoutInput {
    navigationOpen: boolean;
    navigationWidth: number;
    placement: AppLayoutPropsWithDefaults['placement'];
    minContentWidth: number;
    activeDrawerSize: number;
    splitPanelOpen: boolean;
    splitPanelPosition: 'side' | 'bottom' | undefined;
    splitPanelSize: number;
    isMobile: boolean;
    activeGlobalDrawersSizes: Record<string, number>;
}
export declare const CONTENT_PADDING: number;
export declare function computeHorizontalLayout({ navigationOpen, navigationWidth, placement, minContentWidth, activeDrawerSize, splitPanelOpen, splitPanelPosition, splitPanelSize, isMobile, activeGlobalDrawersSizes, }: HorizontalLayoutInput): {
    splitPanelPosition: "bottom" | "side";
    splitPanelForcedPosition: boolean;
    sideSplitPanelSize: number;
    maxSplitPanelSize: number;
    maxDrawerSize: number;
    maxGlobalDrawersSizes: Record<string, number>;
    totalActiveGlobalDrawersSize: number;
    resizableSpaceAvailable: number;
};
interface VerticalLayoutInput {
    topOffset: number;
    hasVisibleToolbar: boolean;
    toolbarHeight: number;
    stickyNotifications: boolean;
    notificationsHeight: number;
}
export interface VerticalLayoutOutput {
    toolbar: number;
    notifications: number;
    header: number;
    drawers: number;
}
export declare function computeVerticalLayout({ topOffset, hasVisibleToolbar, toolbarHeight, stickyNotifications, notificationsHeight, }: VerticalLayoutInput): VerticalLayoutOutput;
export declare function getDrawerTopOffset(verticalOffsets: VerticalLayoutOutput, isMobile: boolean, placement: AppLayoutPropsWithDefaults['placement']): number;
export {};
//# sourceMappingURL=compute-layout.d.ts.map