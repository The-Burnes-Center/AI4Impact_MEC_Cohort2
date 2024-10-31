import { BreadcrumbGroupProps } from '../../breadcrumb-group/interfaces';
import { ActionsApiInternal, ActionsApiPublic } from './controllers/action-buttons';
import { AlertFlashContentApiInternal, AlertFlashContentApiPublic } from './controllers/alert-flash-content';
import { AppLayoutWidgetApiInternal } from './controllers/app-layout-widget';
import { BreadcrumbsApiInternal } from './controllers/breadcrumbs';
import { DrawersApiInternal, DrawersApiPublic } from './controllers/drawers';
import { SharedReactContextsApiInternal } from './controllers/shared-react-contexts';
interface AwsuiApi {
    awsuiPlugins: {
        appLayout: DrawersApiPublic;
        alert: ActionsApiPublic;
        alertContent: AlertFlashContentApiPublic;
        flashbar: ActionsApiPublic;
        flashContent: AlertFlashContentApiPublic;
    };
    awsuiPluginsInternal: {
        appLayout: DrawersApiInternal;
        appLayoutWidget: AppLayoutWidgetApiInternal;
        alert: ActionsApiInternal;
        alertContent: AlertFlashContentApiInternal;
        flashbar: ActionsApiInternal;
        flashContent: AlertFlashContentApiInternal;
        breadcrumbs: BreadcrumbsApiInternal<BreadcrumbGroupProps>;
        sharedReactContexts: SharedReactContextsApiInternal;
    };
}
export declare function loadApi(): AwsuiApi;
export declare const awsuiPlugins: {
    appLayout: DrawersApiPublic;
    alert: ActionsApiPublic;
    alertContent: AlertFlashContentApiPublic;
    flashbar: ActionsApiPublic;
    flashContent: AlertFlashContentApiPublic;
}, awsuiPluginsInternal: {
    appLayout: DrawersApiInternal;
    appLayoutWidget: AppLayoutWidgetApiInternal;
    alert: ActionsApiInternal;
    alertContent: AlertFlashContentApiInternal;
    flashbar: ActionsApiInternal;
    flashContent: AlertFlashContentApiInternal;
    breadcrumbs: BreadcrumbsApiInternal<BreadcrumbGroupProps>;
    sharedReactContexts: SharedReactContextsApiInternal;
};
export {};
//# sourceMappingURL=api.d.ts.map