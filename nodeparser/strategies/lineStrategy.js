import { FigmaRectangleNode } from "../../figmanode/figmaRectangleNode";
export const lineStrategy = {
    nodeType: 'LINE',
    parse(node) {
        const strokeColor = (() => {
            const strokes = node.strokes;
            if (!Array.isArray(strokes) || strokes.length === 0)
                return undefined;
            const s = strokes[0];
            if (s && s.type === 'SOLID')
                return rgbToHex(s.color);
            return undefined;
        })();
        return new FigmaRectangleNode(node.id, node.name, node.visible, node.width || 1, node.height || 1, node.x, node.y, strokeColor, undefined);
    }
};
function rgbToHex(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
