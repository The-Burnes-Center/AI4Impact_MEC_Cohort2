import { ComponentWrapper, ElementWrapper } from "@cloudscape-design/test-utils-core/selectors";
export default class FileDropzoneWrapper extends ComponentWrapper {
    static rootSelector: string;
    findContent(): ElementWrapper;
}