import React from 'react';
export type FocusableChangeHandler = (isFocusable: boolean) => void;
export interface SingleTabStopNavigationOptions {
    tabIndex?: number;
}
export declare const defaultValue: {
    navigationActive: boolean;
    registerFocusable(focusable: HTMLElement, handler: FocusableChangeHandler): () => void;
};
/**
 * Single tab stop navigation context is used together with keyboard navigation that requires a single tab stop.
 * It instructs interactive elements to override tab indices for just a single one to remain user-focusable.
 */
export declare const SingleTabStopNavigationContext: React.Context<{
    navigationActive: boolean;
    registerFocusable(focusable: HTMLElement, handler: FocusableChangeHandler): () => void;
}>;
export declare function useSingleTabStopNavigation(focusable: null | React.RefObject<HTMLElement>, options?: {
    tabIndex?: number;
}): {
    navigationActive: boolean;
    tabIndex: number | undefined;
};
export interface SingleTabStopNavigationProviderProps {
    navigationActive: boolean;
    children: React.ReactNode;
    getNextFocusTarget: () => null | HTMLElement;
    isElementSuppressed?(focusableElement: Element): boolean;
    onRegisterFocusable?(focusableElement: Element): void;
    onUnregisterActive?(focusableElement: Element): void;
}
export interface SingleTabStopNavigationAPI {
    updateFocusTarget(): void;
    getFocusTarget(): null | HTMLElement;
    isRegistered(element: Element): boolean;
}
export declare const SingleTabStopNavigationProvider: React.ForwardRefExoticComponent<SingleTabStopNavigationProviderProps & React.RefAttributes<SingleTabStopNavigationAPI>>;
//# sourceMappingURL=single-tab-stop-navigation-context.d.ts.map