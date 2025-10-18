import { frameStrategy } from "./strategies/frameStrategy";
import { rectangleStrategy } from "./strategies/rectangleStrategy";
import { textStrategy } from "./strategies/textStrategy";
import { ellipseStrategy } from "./strategies/ellipseStrategy";
import { lineStrategy } from "./strategies/lineStrategy";
import { imageStrategy, instanceImageStrategy } from "./strategies/imageStrategy";
// parseFigmaNode now dispatches to a registered strategy
export function parseFigmaNode(node) {
    const handler = parserRegistry.get(node.type);
    if (handler)
        return handler(node);
    return null;
}
const parserRegistry = new Map();
export function registerParserStrategy(nodeType, fn) {
    parserRegistry.set(nodeType, fn);
}
// register built-in strategies using adapters that pass parseFigmaNode as the child parser
const builtIn = [
    frameStrategy,
    rectangleStrategy,
    textStrategy,
    ellipseStrategy,
    lineStrategy,
    imageStrategy,
    instanceImageStrategy,
];
for (const s of builtIn) {
    registerParserStrategy(s.nodeType, (n) => s.parse(n, parseFigmaNode));
}
/**
 * ✅ 현재 선택된 노드들 파싱
 */
export function parseSelectedNodes() {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        figma.notify("선택된 노드가 없습니다.");
        return [];
    }
    return selection
        .map((node) => parseFigmaNode(node))
        .filter((n) => n !== null);
}
// Re-export serializer helpers from dedicated module for backwards compatibility
export { toPlain, serializeNodesToJSON, postParsedTreeToUI } from './serializer';
