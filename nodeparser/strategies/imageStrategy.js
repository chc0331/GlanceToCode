import { FigmaImageNode } from "../../figmanode/figmaImageNode";
export const imageStrategy = {
    nodeType: 'COMPONENT',
    parse(node) {
        let imageUrl = "";
        const fills = node.fills;
        if (Array.isArray(fills) && fills.length > 0 && fills[0].imageHash) {
            imageUrl = fills[0].imageHash;
        }
        return new FigmaImageNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, imageUrl, 'Fit');
    }
};
// Also export an INSTANCE strategy (registered by parser loader)
export const instanceImageStrategy = {
    nodeType: 'INSTANCE',
    parse: imageStrategy.parse
};
