// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import ContentDisplayOption, { getClassName } from './content-display-option';
import styles from '../styles.css.js';
export default function DraggableOption({ dragHandleAriaLabel, onKeyDown, onToggle, option, }) {
    const { isDragging, isSorting, listeners, setNodeRef, transform, attributes } = useSortable({
        id: option.id,
    });
    const style = {
        transform: CSS.Translate.toString(transform),
    };
    const combinedListeners = Object.assign(Object.assign({}, listeners), { onKeyDown: (event) => {
            if (onKeyDown) {
                onKeyDown(event);
            }
            if (listeners === null || listeners === void 0 ? void 0 : listeners.onKeyDown) {
                listeners.onKeyDown(event);
            }
        } });
    return (React.createElement("li", { className: clsx(getClassName(), isDragging && styles.placeholder, isSorting && styles.sorting), style: style },
        React.createElement(ContentDisplayOption, { ref: setNodeRef, listeners: combinedListeners, dragHandleAriaLabel: dragHandleAriaLabel, onToggle: onToggle, option: option, disabled: attributes['aria-disabled'] })));
}
//# sourceMappingURL=draggable-option.js.map