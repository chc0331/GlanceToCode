import { ParserStrategy } from "./ParserStrategy";
import { FigmaRectangleNode } from "../../figmanode/figmaRectangleNode";

export const rectangleStrategy: ParserStrategy = {
  nodeType: 'RECTANGLE',
  parse(node: SceneNode) {
    const fillColor = ((): string | undefined => {
      const fills = (node as any).fills;
      if (!Array.isArray(fills) || fills.length === 0) return undefined;
      const p = fills[0];
      if (p && (p as any).type === 'SOLID') return rgbToHex((p as SolidPaint).color);
      return undefined;
    })();

    return new FigmaRectangleNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, fillColor, undefined);
  }
};

function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
