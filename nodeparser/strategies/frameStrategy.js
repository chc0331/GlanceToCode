import { FigmaBoxNode, FigmaColumnNode, FigmaRowNode } from "../../figmanode/figmaFrameNode";
export const frameStrategy = {
    nodeType: 'FRAME',
    parse(node, parseChild) {
        const layoutMode = node.layoutMode || 'NONE';
        const children = 'children' in node
            ? node.children.map((c) => parseChild(c)).filter((n) => n !== null)
            : [];
        const backgroundColor = (() => {
            if (!Array.isArray(node.backgrounds) || node.backgrounds.length === 0)
                return undefined;
            const b = node.backgrounds[0];
            if (b && b.type === 'SOLID')
                return rgbToHex(b.color);
            return undefined;
        })();
        if (layoutMode === 'HORIZONTAL')
            return new FigmaRowNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
        if (layoutMode === 'VERTICAL')
            return new FigmaColumnNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
        return new FigmaBoxNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
    }
};
function rgbToHex(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
    const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
    const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
}
