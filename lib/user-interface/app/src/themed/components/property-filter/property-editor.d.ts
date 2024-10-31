/// <reference types="react" />
import { DropdownStatusProps } from '../internal/components/dropdown-status';
import { NonCancelableEventHandler } from '../internal/events';
import { I18nStringsInternal } from './i18n-utils';
import { ComparisonOperator, ExtendedOperatorForm, InternalFilteringOption, InternalFilteringProperty, InternalToken, LoadItemsDetail } from './interfaces';
export declare function PropertyEditorContentCustom<TokenValue = any>({ property, operator, filter, value, onChange, operatorForm, }: {
    property: InternalFilteringProperty;
    operator: ComparisonOperator;
    filter: string;
    value: null | TokenValue;
    onChange: (value: null | TokenValue) => void;
    operatorForm: ExtendedOperatorForm<TokenValue>;
}): JSX.Element;
export declare function PropertyEditorContentEnum({ property, filter, value: unknownValue, onChange, asyncProps, filteringOptions, onLoadItems, }: {
    property: InternalFilteringProperty;
    filter: string;
    value: unknown;
    onChange: (value: null | string[]) => void;
    asyncProps: DropdownStatusProps;
    filteringOptions: readonly InternalFilteringOption[];
    onLoadItems?: NonCancelableEventHandler<LoadItemsDetail>;
}): JSX.Element;
export declare function PropertyEditorFooter<TokenValue = any>({ property, operator, value, onCancel, onSubmit, i18nStrings, }: {
    property: InternalFilteringProperty;
    operator: ComparisonOperator;
    value: null | TokenValue;
    onCancel: () => void;
    onSubmit: (value: InternalToken) => void;
    i18nStrings: I18nStringsInternal;
}): JSX.Element;
//# sourceMappingURL=property-editor.d.ts.map