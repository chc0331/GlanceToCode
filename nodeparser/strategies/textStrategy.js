import { FigmaTextNode } from "../../figmanode/figmaTextNode";
export const textStrategy = {
    nodeType: 'TEXT',
    parse(node) {
        const color = (() => {
            const fills = node.fills;
            if (!Array.isArray(fills) || fills.length === 0)
                return '#000000';
            const p = fills[0];
            if (p && p.type === 'SOLID')
                return rgbToHex(p.color);
            return '#000000';
        })();
        const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 14;
        const align = node.textAlignHorizontal === 'CENTER' ? 'Center' : node.textAlignHorizontal === 'RIGHT' ? 'Right' : 'Left';
        return new FigmaTextNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, node.characters, fontSize, color, align);
    }
};
function rgbToHex(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
