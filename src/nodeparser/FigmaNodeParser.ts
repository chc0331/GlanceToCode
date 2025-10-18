import { FigmaBaseNode } from "../figmanode/figmaNode";
import { frameStrategy } from "./strategies/frameStrategy";
import { rectangleStrategy } from "./strategies/rectangleStrategy";
import { textStrategy } from "./strategies/textStrategy";
import { ellipseStrategy } from "./strategies/ellipseStrategy";
import { lineStrategy } from "./strategies/lineStrategy";
import { imageStrategy, instanceImageStrategy } from "./strategies/imageStrategy";
import { ParserStrategy } from "./strategies/ParserStrategy";


/**
 * SceneNode → FigmaBaseNode 구조로 파싱
 */
type ParserFn = (node: SceneNode) => FigmaBaseNode | null;

const parserRegistry: Map<string, ParserFn> = new Map();

export function registerParserStrategy(nodeType: string, fn: ParserFn) {
  parserRegistry.set(nodeType, fn);
}

// parseFigmaNode now dispatches to a registered strategy
export function parseFigmaNode(node: SceneNode): FigmaBaseNode | null {
  const handler = parserRegistry.get(node.type);
  if (handler) return handler(node);
  return null;
}

// register built-in strategies using adapters that pass parseFigmaNode as the child parser
const builtIn: ParserStrategy[] = [
  frameStrategy,
  rectangleStrategy,
  textStrategy,
  ellipseStrategy,
  lineStrategy,
  imageStrategy,
  instanceImageStrategy,
];

for (const s of builtIn) {
  registerParserStrategy(s.nodeType, (n: SceneNode) => s.parse(n, parseFigmaNode as any));
}

/**
 * ✅ 현재 선택된 노드들 파싱
 */
export function parseSelectedNodes(): FigmaBaseNode[] {
  const selection = figma.currentPage.selection;
  if (selection.length === 0) {
    figma.notify("선택된 노드가 없습니다.");
    return [];
  }

  return selection
    .map((node) => parseFigmaNode(node))
    .filter((n): n is FigmaBaseNode => n !== null);
}

// Convert FigmaBaseNode instances to plain serializable objects
function toPlain(node: FigmaBaseNode): any {
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

/**
 * Serialize current selection's parsed tree to JSON.
 * - returns JSON string (or null if nothing selected)
 * - posts message to UI with type 'parsedTree' and payload { json }
 */
export function serializeSelectedNodesToJSON(pretty = true): string | null {
  const nodes = parseSelectedNodes();
  if (nodes.length === 0) return null;
  const plain = nodes.map((n) => toPlain(n));
  const json = pretty ? JSON.stringify(plain, null, 2) : JSON.stringify(plain);
  try {
    // Notify UI if available
    if (typeof figma !== 'undefined' && figma.ui) {
      figma.ui.postMessage({ type: 'parsedTree', json });
    }
  } catch (e) {
    // ignore if not in plugin environment
  }
  return json;
}
