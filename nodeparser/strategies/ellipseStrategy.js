import { FigmaEllipseNode } from "../../figmanode/figmaEllipseNode";
export const ellipseStrategy = {
    nodeType: 'ELLIPSE',
    parse(node) {
        const fillColor = (() => {
            const fills = node.fills;
            if (!Array.isArray(fills) || fills.length === 0)
                return undefined;
            const p = fills[0];
            if (p && p.type === 'SOLID')
                return rgbToHex(p.color);
            return undefined;
        })();
        return new FigmaEllipseNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, fillColor);
    }
};
function rgbToHex(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
