import { FigmaNode } from './types';

export function extractNode(node: SceneNode): FigmaNode | null {
  const baseNode: FigmaNode = {
    id: node.id,
    type: node.type,
    name: node.name,
    x: Math.round(node.x),
    y: Math.round(node.y),
    width: Math.round(node.width),
    height: Math.round(node.height),
  };

  if ('fills' in node && node.fills && node.fills !== figma.mixed) {
    baseNode.fills = node.fills as ReadonlyArray<Paint>;
  }

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    baseNode.characters = textNode.characters;
    baseNode.fontSize = textNode.fontSize as number;
    baseNode.fontName = textNode.fontName as FontName;
    baseNode.textAlignHorizontal = textNode.textAlignHorizontal;
    baseNode.textAlignVertical = textNode.textAlignVertical;
  }

  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    const frameNode = node as FrameNode;
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
      .filter((child): child is FigmaNode => child !== null);
  }

  return baseNode;
}
