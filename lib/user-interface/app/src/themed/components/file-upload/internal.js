// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { __rest } from "tslib";
import React, { useRef, useState } from 'react';
import clsx from 'clsx';
import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import InternalBox from '../box/internal';
import { useFormFieldContext } from '../contexts/form-field';
import { ConstraintText, FormFieldError, FormFieldWarning } from '../form-field/internal';
import { getBaseProps } from '../internal/base-component';
import InternalFileDropzone, { useFilesDragging } from '../internal/components/file-dropzone';
import TokenList from '../internal/components/token-list';
import { fireNonCancelableEvent } from '../internal/events';
import checkControlled from '../internal/hooks/check-controlled';
import { useListFocusController } from '../internal/hooks/use-list-focus-controller';
import { useMergeRefs } from '../internal/hooks/use-merge-refs';
import { useUniqueId } from '../internal/hooks/use-unique-id';
import { joinStrings } from '../internal/utils/strings';
import InternalSpaceBetween from '../space-between/internal';
import { Token } from '../token-group/token';
import FileInput from './file-input';
import { FileOption } from './file-option';
import tokenListStyles from '../internal/components/token-list/styles.css.js';
import fileInputStyles from './file-input/styles.css.js';
import styles from './styles.css.js';
export default React.forwardRef(InternalFileUpload);
function InternalFileUpload(_a, externalRef) {
    var _b;
    var { accept, ariaRequired, multiple = false, onChange, value, tokenLimit, showFileSize, showFileLastModified, showFileThumbnail, i18nStrings, __internalRootRef = null, constraintText, errorText, warningText, fileErrors, fileWarnings } = _a, restProps = __rest(_a, ["accept", "ariaRequired", "multiple", "onChange", "value", "tokenLimit", "showFileSize", "showFileLastModified", "showFileThumbnail", "i18nStrings", "__internalRootRef", "constraintText", "errorText", "warningText", "fileErrors", "fileWarnings"]);
    const [nextFocusIndex, setNextFocusIndex] = useState(null);
    const tokenListRef = useListFocusController({
        nextFocusIndex,
        onFocusMoved: target => {
            target.focus();
            setNextFocusIndex(null);
        },
        listItemSelector: `.${tokenListStyles['list-item']}`,
        showMoreSelector: `.${tokenListStyles.toggle}`,
        fallbackSelector: `.${fileInputStyles['upload-input']}`,
    });
    const baseProps = getBaseProps(restProps);
    const metadata = { showFileSize, showFileLastModified, showFileThumbnail };
    const errorId = useUniqueId('error-');
    const warningId = useUniqueId('warning-');
    const constraintTextId = useUniqueId('constraint-text-');
    const fileInputRef = useRef(null);
    const ref = useMergeRefs(fileInputRef, externalRef);
    checkControlled('FileUpload', 'value', value, 'onChange', onChange);
    if (!multiple && value.length > 1) {
        warnOnce('FileUpload', 'Value must be an array of size 0 or 1 when `multiple=false`.');
    }
    const handleFilesChange = (newFiles) => {
        const newValue = multiple ? [...value, ...newFiles] : newFiles[0] ? newFiles.slice(0, 1) : [...value];
        fireNonCancelableEvent(onChange, { value: newValue });
    };
    const onFileRemove = (removeFileIndex) => {
        const newValue = value.filter((_, fileIndex) => fileIndex !== removeFileIndex);
        fireNonCancelableEvent(onChange, { value: newValue });
        setNextFocusIndex(removeFileIndex);
    };
    const { areFilesDragging } = useFilesDragging();
    const showWarning = warningText && !errorText;
    if (warningText && errorText) {
        warnOnce('FileUpload', 'Both `errorText` and `warningText` exist. `warningText` will not be shown.');
    }
    const formFieldContext = useFormFieldContext(restProps);
    const ariaDescribedBy = joinStrings((_b = restProps.ariaDescribedby) !== null && _b !== void 0 ? _b : formFieldContext.ariaDescribedby, errorText ? errorId : undefined, showWarning ? warningId : undefined, constraintText ? constraintTextId : undefined);
    const hasError = Boolean(errorText || (fileErrors === null || fileErrors === void 0 ? void 0 : fileErrors.filter(Boolean).length));
    const invalid = restProps.invalid || formFieldContext.invalid || hasError;
    return (React.createElement(InternalSpaceBetween, Object.assign({}, baseProps, { size: "xs", className: clsx(baseProps.className, styles.root), __internalRootRef: __internalRootRef, ref: tokenListRef }),
        React.createElement(InternalBox, null,
            areFilesDragging ? (React.createElement(InternalFileDropzone, { onChange: event => handleFilesChange(event.detail.value) }, i18nStrings.dropzoneText(multiple))) : (React.createElement(FileInput, Object.assign({ ref: ref, accept: accept, ariaRequired: ariaRequired, multiple: multiple, onChange: handleFilesChange, value: value }, restProps, { ariaDescribedby: ariaDescribedBy, invalid: invalid }), i18nStrings.uploadButtonText(multiple))),
            (constraintText || errorText || warningText) && (React.createElement("div", { className: styles.hints },
                errorText && (React.createElement(FormFieldError, { id: errorId, errorIconAriaLabel: i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.errorIconAriaLabel }, errorText)),
                showWarning && (React.createElement(FormFieldWarning, { id: warningId, warningIconAriaLabel: i18nStrings === null || i18nStrings === void 0 ? void 0 : i18nStrings.warningIconAriaLabel }, warningText)),
                constraintText && (React.createElement(ConstraintText, { id: constraintTextId, hasValidationText: !!errorText || !!warningText }, constraintText))))),
        !multiple && value.length > 0 ? (React.createElement(InternalBox, null,
            React.createElement(Token, { ariaLabel: value[0].name, dismissLabel: i18nStrings.removeFileAriaLabel(0), onDismiss: () => onFileRemove(0), errorText: fileErrors === null || fileErrors === void 0 ? void 0 : fileErrors[0], warningText: fileWarnings === null || fileWarnings === void 0 ? void 0 : fileWarnings[0], errorIconAriaLabel: i18nStrings.errorIconAriaLabel, warningIconAriaLabel: i18nStrings.warningIconAriaLabel, "data-index": 0 },
                React.createElement(FileOption, { file: value[0], metadata: metadata, i18nStrings: i18nStrings })))) : null,
        multiple && value.length > 0 ? (React.createElement(InternalBox, null,
            React.createElement(TokenList, { alignment: "vertical", items: value, renderItem: (file, fileIndex) => (React.createElement(Token, { ariaLabel: file.name, dismissLabel: i18nStrings.removeFileAriaLabel(fileIndex), onDismiss: () => onFileRemove(fileIndex), errorText: fileErrors === null || fileErrors === void 0 ? void 0 : fileErrors[fileIndex], warningText: fileWarnings === null || fileWarnings === void 0 ? void 0 : fileWarnings[fileIndex], errorIconAriaLabel: i18nStrings.errorIconAriaLabel, warningIconAriaLabel: i18nStrings.warningIconAriaLabel, "data-index": fileIndex },
                    React.createElement(FileOption, { file: file, metadata: metadata, i18nStrings: i18nStrings }))), limit: tokenLimit, i18nStrings: {
                    limitShowFewer: i18nStrings.limitShowFewer,
                    limitShowMore: i18nStrings.limitShowMore,
                } }))) : null));
}
//# sourceMappingURL=internal.js.map