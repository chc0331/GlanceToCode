import { FigmaBaseNode } from "../figmanode/figmaNode";

// Convert FigmaBaseNode instances to plain serializable objects
export function toPlain(node: FigmaBaseNode): any {
  const base: any = {
    id: node.id,
    name: node.name,
    visible: node.visible,
    width: node.width,
    height: node.height,
    x: node.x,
    y: node.y,
  };

  if ((node as any).children) {
    base.children = (node as any).children.map((c: FigmaBaseNode) => toPlain(c));
  }

  // include subclass-specific properties if present
  if ((node as any).backgroundColor) base.backgroundColor = (node as any).backgroundColor;
  if ((node as any).fillColor) base.fillColor = (node as any).fillColor;
  if ((node as any).text) base.text = (node as any).text;
  if ((node as any).fontSize) base.fontSize = (node as any).fontSize;
  if ((node as any).color) base.color = (node as any).color;
  if ((node as any).imageUrl) base.imageUrl = (node as any).imageUrl;

  return base;
}

export function serializeNodesToJSON(nodes: FigmaBaseNode[], pretty = true): string {
  const plain = nodes.map((n) => toPlain(n));
  return pretty ? JSON.stringify(plain, null, 2) : JSON.stringify(plain);
}

export function postParsedTreeToUI(json: string) {
  try {
    if (typeof figma !== 'undefined' && figma.ui) {
      figma.ui.postMessage({ type: 'parsedTree', json });
    }
  } catch (e) {
    // ignore in non-plugin environments
  }
}
