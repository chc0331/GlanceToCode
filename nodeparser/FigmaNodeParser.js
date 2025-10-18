import { frameStrategy } from "./strategies/frameStrategy";
import { rectangleStrategy } from "./strategies/rectangleStrategy";
import { textStrategy } from "./strategies/textStrategy";
import { ellipseStrategy } from "./strategies/ellipseStrategy";
import { lineStrategy } from "./strategies/lineStrategy";
import { imageStrategy, instanceImageStrategy } from "./strategies/imageStrategy";
const parserRegistry = new Map();
export function registerParserStrategy(nodeType, fn) {
    parserRegistry.set(nodeType, fn);
}
// parseFigmaNode now dispatches to a registered strategy
export function parseFigmaNode(node) {
    const handler = parserRegistry.get(node.type);
    if (handler)
        return handler(node);
    return null;
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
// Convert FigmaBaseNode instances to plain serializable objects
function toPlain(node) {
    const base = {
        id: node.id,
        name: node.name,
        visible: node.visible,
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
    };
    if (node.children) {
        base.children = node.children.map((c) => toPlain(c));
    }
    // include subclass-specific properties if present
    if (node.backgroundColor)
        base.backgroundColor = node.backgroundColor;
    if (node.fillColor)
        base.fillColor = node.fillColor;
    if (node.text)
        base.text = node.text;
    if (node.fontSize)
        base.fontSize = node.fontSize;
    if (node.color)
        base.color = node.color;
    if (node.imageUrl)
        base.imageUrl = node.imageUrl;
    return base;
}
/**
 * Serialize current selection's parsed tree to JSON.
 * - returns JSON string (or null if nothing selected)
 * - posts message to UI with type 'parsedTree' and payload { json }
 */
export function serializeSelectedNodesToJSON(pretty = true) {
    const nodes = parseSelectedNodes();
    if (nodes.length === 0)
        return null;
    const plain = nodes.map((n) => toPlain(n));
    const json = pretty ? JSON.stringify(plain, null, 2) : JSON.stringify(plain);
    try {
        // Notify UI if available
        if (typeof figma !== 'undefined' && figma.ui) {
            figma.ui.postMessage({ type: 'parsedTree', json });
        }
    }
    catch (e) {
        // ignore if not in plugin environment
    }
    return json;
}
