import { FigmaBaseNode } from "../figmanode/figmaNode";
import { frameStrategy } from "./strategies/frameStrategy";
import { rectangleStrategy } from "./strategies/rectangleStrategy";
import { textStrategy } from "./strategies/textStrategy";
import { ellipseStrategy } from "./strategies/ellipseStrategy";
import { lineStrategy } from "./strategies/lineStrategy";
import { imageStrategy, instanceImageStrategy } from "./strategies/imageStrategy";
import { ParserStrategy } from "./strategies/ParserStrategy";


// parseFigmaNode now dispatches to a registered strategy
export function parseFigmaNode(node: SceneNode): FigmaBaseNode | null {
  const handler = parserRegistry.get(node.type);
  if (handler) return handler(node);
  return null;
}

/**
 * SceneNode → FigmaBaseNode 구조로 파싱
 */
type ParserFn = (node: SceneNode) => FigmaBaseNode | null;

const parserRegistry: Map<string, ParserFn> = new Map();

export function registerParserStrategy(nodeType: string, fn: ParserFn) {
  parserRegistry.set(nodeType, fn);
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

// Re-export serializer helpers from dedicated module for backwards compatibility
export { toPlain, serializeNodesToJSON, postParsedTreeToUI } from './serializer';
