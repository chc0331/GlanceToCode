import { ParserStrategy } from "./ParserStrategy";
import { FigmaImageNode } from "../../figmanode/figmaImageNode";

export const imageStrategy: ParserStrategy = {
  nodeType: 'COMPONENT',
  parse(node: SceneNode) {
    let imageUrl = "";
    const fills = (node as any).fills;
    if (Array.isArray(fills) && fills.length > 0 && (fills[0] as any).imageHash) {
      imageUrl = (fills[0] as any).imageHash;
    }
    return new FigmaImageNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, imageUrl, 'Fit');
  }
};

// Also export an INSTANCE strategy (registered by parser loader)
export const instanceImageStrategy: ParserStrategy = {
  nodeType: 'INSTANCE',
  parse: imageStrategy.parse
};
