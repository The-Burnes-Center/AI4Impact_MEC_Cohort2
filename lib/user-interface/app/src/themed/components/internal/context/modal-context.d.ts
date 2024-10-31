import { MutableRefObject } from 'react';
export interface ModalContextProps {
    isInModal: boolean;
    componentLoadingCount: MutableRefObject<number>;
    emitTimeToContentReadyInModal: (loadCompleteTime: number) => void;
}
export declare const ModalContext: import("react").Context<ModalContextProps>;
export declare const useModalContext: () => ModalContextProps;
//# sourceMappingURL=modal-context.d.ts.map