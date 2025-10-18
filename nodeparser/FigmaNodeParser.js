import { FigmaBoxNode, FigmaColumnNode, FigmaRowNode } from "../figmanode/figmaFrameNode";
import { FigmaImageNode } from "../figmanode/figmaImageNode";
import { FigmaEllipseNode } from "../figmanode/figmaEllipseNode";
import { FigmaRectangleNode } from "../figmanode/figmaRectangleNode";
import { FigmaTextNode } from "../figmanode/figmaTextNode";
/**
 * SceneNode → FigmaBaseNode 구조로 파싱
 */
export function parseFigmaNode(node) {
    switch (node.type) {
        case "FRAME":
        case "GROUP":
            return parseFrameNode(node);
        case "RECTANGLE":
            return parseRectangleNode(node);
        case "TEXT":
            return parseTextNode(node);
        case "ELLIPSE":
            return parseEllipseNode(node);
        case "LINE":
            // 선은 간단한 Rectangle 혹은 Spacer로 근사
            return parseLineNode(node);
        case "COMPONENT":
        case "INSTANCE":
            // 이미지나 외부 컴포넌트로 취급
            return parseImageNode(node);
        default:
            return null;
    }
}
/**
 * FrameNode → Box / Row / Column으로 변환
 */
function parseFrameNode(node) {
    const layoutMode = node.layoutMode || "NONE";
    const children = "children" in node
        ? node.children
            .map((child) => parseFigmaNode(child))
            .filter((n) => n !== null)
        : [];
    const backgroundColor = (() => {
        if (!Array.isArray(node.backgrounds) || node.backgrounds.length === 0)
            return undefined;
        const b = node.backgrounds[0];
        if (b && b.type === 'SOLID')
            return rgbToHex(b.color);
        return undefined;
    })();
    if (layoutMode === "HORIZONTAL")
        return new FigmaRowNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
    if (layoutMode === "VERTICAL")
        return new FigmaColumnNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
    return new FigmaBoxNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
}
/**
 * Rectangle → FigmaRectangleNode
 */
function parseRectangleNode(node) {
    const fillColor = (() => {
        if (!Array.isArray(node.fills) || node.fills.length === 0)
            return undefined;
        const p = node.fills[0];
        if (p && p.type === 'SOLID')
            return rgbToHex(p.color);
        return undefined;
    })();
    return new FigmaRectangleNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, fillColor, undefined);
}
/**
 * Text → FigmaTextNode
 */
function parseTextNode(node) {
    const color = (() => {
        if (!Array.isArray(node.fills) || node.fills.length === 0)
            return "#000000";
        const p = node.fills[0];
        if (p && p.type === 'SOLID')
            return rgbToHex(p.color);
        return "#000000";
    })();
    const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 14;
    const align = node.textAlignHorizontal === "CENTER" ? "Center" : node.textAlignHorizontal === "RIGHT" ? "Right" : "Left";
    return new FigmaTextNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, node.characters, fontSize, color, align);
}
/**
 * Component / Instance → FigmaImageNode (일단 이미지 취급)
 */
function parseImageNode(node) {
    let imageUrl = "";
    const fills = node.fills;
    if (Array.isArray(fills) && fills.length > 0 && fills[0].imageHash) {
        imageUrl = fills[0].imageHash;
    }
    // default contentScale to 'Fit'
    return new FigmaImageNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, imageUrl, "Fit");
}
function parseEllipseNode(node) {
    const fillColor = (() => {
        const fills = node.fills;
        if (!Array.isArray(fills) || fills.length === 0)
            return undefined;
        const p = fills[0];
        if (p && p.type === 'SOLID')
            return rgbToHex(p.color);
        return undefined;
    })();
    return new FigmaEllipseNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, fillColor);
}
function parseLineNode(node) {
    // Represent a line as a thin rectangle approximation
    const strokeColor = (() => {
        const strokes = node.strokes;
        if (!Array.isArray(strokes) || strokes.length === 0)
            return undefined;
        const s = strokes[0];
        if (s && s.type === 'SOLID')
            return rgbToHex(s.color);
        return undefined;
    })();
    return new FigmaRectangleNode(node.id, node.name, node.visible, 
    // width/height might be zero for lines; ensure at least 1
    node.width || 1, node.height || 1, node.x, node.y, strokeColor, undefined);
}
/**
 * RGB → HEX 변환 유틸
 */
function rgbToHex(color) {
    const r = Math.round(color.r * 255)
        .toString(16)
        .padStart(2, "0");
    const g = Math.round(color.g * 255)
        .toString(16)
        .padStart(2, "0");
    const b = Math.round(color.b * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${r}${g}${b}`;
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
