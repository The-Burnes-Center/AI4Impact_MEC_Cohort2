// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { createContext, useContext } from 'react';
export const ModalContext = createContext({
    isInModal: false,
    componentLoadingCount: { current: 0 },
    emitTimeToContentReadyInModal: () => { },
});
export const useModalContext = () => {
    const modalContext = useContext(ModalContext);
    return modalContext;
};
//# sourceMappingURL=modal-context.js.map