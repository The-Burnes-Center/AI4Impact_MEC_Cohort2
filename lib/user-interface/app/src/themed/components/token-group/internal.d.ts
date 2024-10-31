/// <reference types="react" />
import { InternalBaseComponentProps } from '../internal/hooks/use-base-component';
import { SomeRequired } from '../internal/types';
import { TokenGroupProps } from './interfaces';
type InternalTokenGroupProps = SomeRequired<TokenGroupProps, 'items' | 'alignment'> & InternalBaseComponentProps;
export default function InternalTokenGroup({ alignment, items, onDismiss, limit, i18nStrings, disableOuterPadding, limitShowFewerAriaLabel, limitShowMoreAriaLabel, readOnly, __internalRootRef, ...props }: InternalTokenGroupProps): JSX.Element;
export {};
//# sourceMappingURL=internal.d.ts.map