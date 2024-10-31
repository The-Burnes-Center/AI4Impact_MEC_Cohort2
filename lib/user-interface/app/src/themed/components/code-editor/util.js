import { AceModes } from './ace-modes';
import { DarkThemes, LightThemes } from './ace-themes';
const CLOUD_EDITOR_LIGHT_THEME = 'cloud_editor';
const CLOUD_EDITOR_DARK_THEME = 'cloud_editor_dark';
const FALLBACK_LIGHT_THEME = 'dawn';
const FALLBACK_DARK_THEME = 'tomorrow_night_bright';
export const DEFAULT_AVAILABLE_THEMES = {
    light: LightThemes.map(theme => theme.value).filter(value => value !== CLOUD_EDITOR_LIGHT_THEME),
    dark: DarkThemes.map(theme => theme.value).filter(value => value !== CLOUD_EDITOR_DARK_THEME),
};
function isAceVersionAtLeast(ace, minVersion) {
    var _a;
    // Split semantic version numbers. We don't need a full semver parser for this.
    const semanticVersion = (_a = ace === null || ace === void 0 ? void 0 : ace.version) === null || _a === void 0 ? void 0 : _a.split('.').map((part) => {
        const parsed = parseInt(part);
        return Number.isNaN(parsed) ? part : parsed;
    });
    return (!!semanticVersion &&
        typeof semanticVersion[0] === 'number' &&
        semanticVersion[0] >= minVersion[0] &&
        typeof semanticVersion[1] === 'number' &&
        semanticVersion[1] >= minVersion[1] &&
        typeof semanticVersion[2] === 'number' &&
        semanticVersion[2] >= minVersion[2]);
}
export function supportsKeyboardAccessibility(ace) {
    return isAceVersionAtLeast(ace, [1, 23, 0]);
}
export function getDefaultConfig(ace) {
    return Object.assign({ behavioursEnabled: true }, (supportsKeyboardAccessibility(ace) ? { enableKeyboardAccessibility: true } : {}));
}
export function getDefaultTheme(mode, themes) {
    if (mode === 'light') {
        return (themes === null || themes === void 0 ? void 0 : themes.light.some(value => value === CLOUD_EDITOR_LIGHT_THEME))
            ? CLOUD_EDITOR_LIGHT_THEME
            : FALLBACK_LIGHT_THEME;
    }
    else {
        return (themes === null || themes === void 0 ? void 0 : themes.dark.some(value => value === CLOUD_EDITOR_DARK_THEME))
            ? CLOUD_EDITOR_DARK_THEME
            : FALLBACK_DARK_THEME;
    }
}
export function getAceTheme(theme) {
    return `ace/theme/${theme}`;
}
export function getLanguageLabel(language) {
    var _a;
    return ((_a = AceModes.filter((mode) => mode.value === language)[0]) === null || _a === void 0 ? void 0 : _a.label) || language;
}
export function getStatusButtonId({ paneId, paneStatus }) {
    return paneId ? `${paneId}-button-${paneStatus}` : undefined;
}
//# sourceMappingURL=util.js.map