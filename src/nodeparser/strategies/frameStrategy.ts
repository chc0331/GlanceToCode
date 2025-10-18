import { ParserStrategy } from "./ParserStrategy";
import { FigmaBaseNode } from "../../figmanode/figmaNode";
import { FigmaBoxNode, FigmaColumnNode, FigmaRowNode } from "../../figmanode/figmaFrameNode";

export const frameStrategy: ParserStrategy = {
  nodeType: 'FRAME',
  parse(node: SceneNode, parseChild) {
    const layoutMode = (node as any).layoutMode || 'NONE';
    const children = 'children' in node
      ? node.children.map((c) => parseChild(c)).filter((n): n is FigmaBaseNode => n !== null)
      : [];
    const backgroundColor = ((): string | undefined => {
      if (!Array.isArray((node as any).backgrounds) || (node as any).backgrounds.length === 0) return undefined;
      const b = (node as any).backgrounds[0];
      if (b && (b as any).type === 'SOLID') return rgbToHex((b as SolidPaint).color);
      return undefined;
    })();

    if (layoutMode === 'HORIZONTAL')
      return new FigmaRowNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
    if (layoutMode === 'VERTICAL')
      return new FigmaColumnNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
    return new FigmaBoxNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
  }
};

function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
