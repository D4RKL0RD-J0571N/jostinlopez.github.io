import tokens from "../config/design-tokens.json";

export const hexToRgbChannels = (hex) => {
    // Handle short hex (e.g. #fff)
    const expandedHex = hex.length === 4
        ? '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3]
        : hex;

    const r = parseInt(expandedHex.slice(1, 3), 16);
    const g = parseInt(expandedHex.slice(3, 5), 16);
    const b = parseInt(expandedHex.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
};

export function applyTheme(theme = tokens) {
    if (typeof document !== 'undefined') {
        Object.entries(theme).forEach(([key, def]) => {
            document.documentElement.style.setProperty(`--${key}`, def.value);
        });
    }
}
