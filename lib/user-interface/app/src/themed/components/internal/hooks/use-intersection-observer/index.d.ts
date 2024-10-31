interface UseIntersectionObserverConfig {
    initialState?: boolean;
}
/**
 * A hook that uses an Intersection Observer on the target element ref
 * and detects if the element is intersecting with its parent.
 */
export declare function useIntersectionObserver<T extends HTMLElement>({ initialState, }?: UseIntersectionObserverConfig): {
    ref: (instance: T | null) => void;
    isIntersecting: boolean;
};
export {};
//# sourceMappingURL=index.d.ts.map