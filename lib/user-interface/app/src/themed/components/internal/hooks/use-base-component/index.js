import { useComponentMetadata, useFocusVisible, } from '@cloudscape-design/component-toolkit/internal';
import { PACKAGE_VERSION } from '../../environment';
import { useTelemetry } from '../use-telemetry';
/**
 * This hook is used for components which are exported to customers. The returned __internalRootRef needs to be
 * attached to the (internal) component's root DOM node. The hook takes care of attaching the metadata to this
 * root DOM node and emits the telemetry for this component.
 */
export default function useBaseComponent(componentName, config, analyticsMetadata) {
    useTelemetry(componentName, config);
    useFocusVisible();
    const elementRef = useComponentMetadata(componentName, PACKAGE_VERSION, Object.assign({}, analyticsMetadata));
    return { __internalRootRef: elementRef };
}
//# sourceMappingURL=index.js.map