import { parseFigmaNode } from './nodeparser/FigmaNodeParser';
export function extractNode(node) {
    // Try to use the richer parser which creates figmanode class instances,
    // then map that structure back into the pipeline's lightweight `FigmaNode` type.
    const parsed = parseFigmaNode(node);
    if (parsed) {
        return mapFigmaBaseNodeToFigmaNode(parsed);
    }
    // Fallback: preserve original light-weight extraction behavior
    const baseNode = {
        id: node.id,
        type: node.type,
        name: node.name,
        x: Math.round(node.x),
        y: Math.round(node.y),
        width: Math.round(node.width),
        height: Math.round(node.height),
    };
    if ('fills' in node && node.fills && node.fills !== figma.mixed) {
        baseNode.fills = node.fills;
    }
    if (node.type === 'TEXT') {
        const textNode = node;
        baseNode.characters = textNode.characters;
        baseNode.fontSize = textNode.fontSize;
        baseNode.fontName = textNode.fontName;
        baseNode.textAlignHorizontal = textNode.textAlignHorizontal;
        baseNode.textAlignVertical = textNode.textAlignVertical;
    }
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
        const frameNode = node;
        baseNode.layoutMode = frameNode.layoutMode;
        baseNode.primaryAxisAlignItems = frameNode.primaryAxisAlignItems;
        baseNode.counterAxisAlignItems = frameNode.counterAxisAlignItems;
        baseNode.paddingLeft = frameNode.paddingLeft;
        baseNode.paddingRight = frameNode.paddingRight;
        baseNode.paddingTop = frameNode.paddingTop;
        baseNode.paddingBottom = frameNode.paddingBottom;
        baseNode.itemSpacing = frameNode.itemSpacing;
    }
    if ('children' in node && node.children) {
        baseNode.children = node.children
            .map(child => extractNode(child))
            .filter((child) => child !== null);
    }
    return baseNode;
}
function mapFigmaBaseNodeToFigmaNode(n) {
    const out = {
        id: n.id,
        type: n.constructor && n.constructor.name ? n.constructor.name : 'Node',
        name: n.name,
        x: Math.round(n.x || 0),
        y: Math.round(n.y || 0),
        width: Math.round(n.width || 0),
        height: Math.round(n.height || 0),
    };
    // map known properties
    if (n.fillColor)
        out.fills = [{ type: 'SOLID', color: hexToRgb(n.fillColor) }];
    if (n.backgroundColor)
        out.fills = [{ type: 'SOLID', color: hexToRgb(n.backgroundColor) }];
    if (n.text) {
        out.characters = n.text;
        out.fontSize = n.fontSize;
    }
    if (n.children && Array.isArray(n.children)) {
        out.children = n.children.map((c) => mapFigmaBaseNodeToFigmaNode(c));
    }
    return out;
}
function hexToRgb(hex) {
    if (!hex)
        return undefined;
    // remove '#'
    const h = hex.replace('#', '');
    if (h.length !== 6)
        return undefined;
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    return { r, g, b };
}
