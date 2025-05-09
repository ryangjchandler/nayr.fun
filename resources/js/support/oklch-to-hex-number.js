/**
 * @param {string} oklch
 * @returns {string}
 */
export const oklchToHex = (oklch) => {
    const [l, c, h] = oklch.match(/[\d.]+/g).map(Number);

    // Convert to RGB
    const x = c * Math.cos(h);
    const y = c * Math.sin(h);
    const z = l / 100;

    const r = Math.round((x + y) * 255);
    const g = Math.round((z - y) * 255);
    const b = Math.round((z + x) * 255);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
