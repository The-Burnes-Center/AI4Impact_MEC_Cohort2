import { ComponentWrapper, ElementWrapper } from '@cloudscape-design/test-utils-core/dom';
import ButtonDropdownWrapper from '../button-dropdown';
import SplitPanelWrapper from '../split-panel';
export default class AppLayoutWrapper extends ComponentWrapper {
    static rootSelector: string;
    findNavigation(): ElementWrapper;
    findOpenNavigationPanel(): ElementWrapper | null;
    findNavigationToggle(): ElementWrapper<HTMLButtonElement>;
    findNavigationClose(): ElementWrapper<HTMLButtonElement>;
    findContentRegion(): ElementWrapper;
    findNotifications(): ElementWrapper | null;
    findBreadcrumbs(): ElementWrapper | null;
    findTools(): ElementWrapper;
    findOpenToolsPanel(): ElementWrapper | null;
    findToolsClose(): ElementWrapper<HTMLButtonElement>;
    findToolsToggle(): ElementWrapper<HTMLButtonElement>;
    findSplitPanel(): SplitPanelWrapper | null;
    findSplitPanelOpenButton(): ElementWrapper | null;
    findActiveDrawer(): ElementWrapper | null;
    findActiveDrawerCloseButton(): ElementWrapper<HTMLButtonElement> | null;
    findDrawersTriggers(): ElementWrapper<HTMLButtonElement>[];
    /**
     * Finds a drawer trigger by the given id.
     *
     * @param id id of the trigger to find
     * @param options
     * * hasBadge (boolean) - If provided, only finds drawers with the badge or without badge respectively
     */
    findDrawerTriggerById(id: string, options?: {
        hasBadge?: boolean;
    }): ElementWrapper<HTMLButtonElement> | null;
    findDrawersOverflowTrigger(): ButtonDropdownWrapper | null;
    findActiveDrawerResizeHandle(): ElementWrapper | null;
    findToolbar(): ElementWrapper | null;
    findDrawerTriggerTooltip(): ElementWrapper | null;
}