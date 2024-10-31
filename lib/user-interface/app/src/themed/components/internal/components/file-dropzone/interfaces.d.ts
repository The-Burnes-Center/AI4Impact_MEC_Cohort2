/// <reference types="react" />
import { BaseComponentProps } from '../../base-component';
import { NonCancelableEventHandler } from '../../events';
export interface FileDropzoneProps extends BaseComponentProps {
    /**
     * Called when the user selects new file(s), or removes a file.
     * The event `detail` contains the current value of the component.
     */
    onChange: NonCancelableEventHandler<FileDropzoneProps.ChangeDetail>;
    /**
     * Children of the Dropzone.
     */
    children: React.ReactNode;
}
export declare namespace FileDropzoneProps {
    interface ChangeDetail {
        value: File[];
    }
}
//# sourceMappingURL=interfaces.d.ts.map