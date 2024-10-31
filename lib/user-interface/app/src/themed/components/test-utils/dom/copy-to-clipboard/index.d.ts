import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ButtonWrapper from '../button';
export default class CopyToClipboardWrapper extends ComponentWrapper {
    static rootSelector: string;
    findCopyButton(): ButtonWrapper;
    findStatusText(options?: {
        popoverRenderWithPortal: boolean;
    }): null | ElementWrapper;
    findTextToCopy(): null | ElementWrapper;
}