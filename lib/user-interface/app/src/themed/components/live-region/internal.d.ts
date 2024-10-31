import React from 'react';
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { LiveRegionProps } from './interfaces';
export interface InternalLiveRegionProps extends InternalBaseComponentProps, LiveRegionProps {
    /**
     * The delay between each announcement from this live region. You should
     * leave this set to the default unless this live region is commonly
     * interrupted by other actions (like text entry in text filtering).
     */
    delay?: number;
    /**
     * Use a list of strings and/or refs to existing elements for building the
     * announcement text. If this property is set, `children` and `message` will
     * be ignored.
     */
    sources?: ReadonlyArray<string | React.RefObject<HTMLElement> | undefined>;
}
export interface InternalLiveRegionRef {
    /**
     * Force the live region to announce the message, even if it's the same as
     * the previously announced message.
     *
     * This is useful when making status updates after a change (e.g. filtering)
     * where the new message might be the same as the old one, but the announcement
     * also serves to tell screen reader users that the action was performed.
     */
    reannounce(): void;
}
declare const _default: React.ForwardRefExoticComponent<InternalLiveRegionProps & React.RefAttributes<InternalLiveRegionRef>>;
export default _default;
//# sourceMappingURL=internal.d.ts.map