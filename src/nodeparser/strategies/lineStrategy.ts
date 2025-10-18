import { ParserStrategy } from "./ParserStrategy";
import { FigmaRectangleNode } from "../../figmanode/figmaRectangleNode";

export const lineStrategy: ParserStrategy = {
  nodeType: 'LINE',
  parse(node: SceneNode) {
    const strokeColor = ((): string | undefined => {
      const strokes = (node as any).strokes;
      if (!Array.isArray(strokes) || strokes.length === 0) return undefined;
      const s = strokes[0];
      if (s && (s as any).type === 'SOLID') return rgbToHex((s as SolidPaint).color);
      return undefined;
    })();

    return new FigmaRectangleNode(node.id, node.name, node.visible, node.width || 1, node.height || 1, node.x, node.y, strokeColor, undefined);
  }
};

function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
