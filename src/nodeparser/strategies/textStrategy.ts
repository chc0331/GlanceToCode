import { ParserStrategy } from "./ParserStrategy";
import { FigmaTextNode } from "../../figmanode/figmaTextNode";

export const textStrategy: ParserStrategy = {
  nodeType: 'TEXT',
  parse(node: SceneNode) {
    const color = ((): string => {
      const fills = (node as any).fills;
      if (!Array.isArray(fills) || fills.length === 0) return '#000000';
      const p = fills[0];
      if (p && (p as any).type === 'SOLID') return rgbToHex((p as SolidPaint).color);
      return '#000000';
    })();
    const fontSize = typeof (node as any).fontSize === 'number' ? (node as any).fontSize : 14;
    const align = (node as any).textAlignHorizontal === 'CENTER' ? 'Center' : (node as any).textAlignHorizontal === 'RIGHT' ? 'Right' : 'Left';
    return new FigmaTextNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, (node as any).characters, fontSize, color, align);
  }
};

function rgbToHex(color: RGB): string {
  const r = Math.round(color.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(color.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(color.b * 255).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
}
