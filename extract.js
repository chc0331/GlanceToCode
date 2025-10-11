export function extractNode(node) {
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
