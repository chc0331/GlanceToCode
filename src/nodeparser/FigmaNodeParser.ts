import { FigmaBoxNode, FigmaColumnNode, FigmaRowNode } from "../figmanode/figmaFrameNode";
import { FigmaImageNode } from "../figmanode/figmaImageNode";
import { FigmaEllipseNode } from "../figmanode/figmaEllipseNode";
import { FigmaBaseNode } from "../figmanode/figmaNode";
import { FigmaRectangleNode } from "../figmanode/figmaRectangleNode";
import { FigmaTextNode } from "../figmanode/figmaTextNode";


/**
 * SceneNode → FigmaBaseNode 구조로 파싱
 */
export function parseFigmaNode(node: SceneNode): FigmaBaseNode | null {
  switch (node.type) {
    case "FRAME":
    case "GROUP":
      return parseFrameNode(node);
    case "RECTANGLE":
      return parseRectangleNode(node);
    case "TEXT":
      return parseTextNode(node);
    case "ELLIPSE":
      return parseEllipseNode(node as EllipseNode);
    case "LINE":
      // 선은 간단한 Rectangle 혹은 Spacer로 근사
      return parseLineNode(node as LineNode);
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
function parseFrameNode(node: FrameNode | GroupNode): FigmaBaseNode {
  const layoutMode = (node as any).layoutMode || "NONE";

  const children =
    "children" in node
      ? node.children
          .map((child) => parseFigmaNode(child))
          .filter((n): n is FigmaBaseNode => n !== null)
      : [];
  const backgroundColor = ((): string | undefined => {
    if (!Array.isArray(node.backgrounds) || node.backgrounds.length === 0) return undefined;
    const b = node.backgrounds[0];
    if (b && (b as any).type === 'SOLID') return rgbToHex((b as SolidPaint).color);
    return undefined;
  })();

  if (layoutMode === "HORIZONTAL")
    return new FigmaRowNode(
      node.id,
      node.name,
      node.visible,
      node.width,
      node.height,
      node.x,
      node.y,
      children,
      backgroundColor
    );
  if (layoutMode === "VERTICAL")
    return new FigmaColumnNode(
      node.id,
      node.name,
      node.visible,
      node.width,
      node.height,
      node.x,
      node.y,
      children,
      backgroundColor
    );
  return new FigmaBoxNode(
    node.id,
    node.name,
    node.visible,
    node.width,
    node.height,
    node.x,
    node.y,
    children,
    backgroundColor
  );
}

/**
 * Rectangle → FigmaRectangleNode
 */
function parseRectangleNode(node: RectangleNode): FigmaRectangleNode {
  const fillColor = ((): string | undefined => {
    if (!Array.isArray(node.fills) || node.fills.length === 0) return undefined;
    const p = node.fills[0];
    if (p && (p as any).type === 'SOLID') return rgbToHex((p as SolidPaint).color);
    return undefined;
  })();
  return new FigmaRectangleNode(
    node.id,
    node.name,
    node.visible,
    node.width,
    node.height,
    node.x,
    node.y,
    fillColor,
    undefined
  );
}

/**
 * Text → FigmaTextNode
 */
function parseTextNode(node: TextNode): FigmaTextNode {
  const color = ((): string => {
    if (!Array.isArray(node.fills) || node.fills.length === 0) return "#000000";
    const p = node.fills[0];
    if (p && (p as any).type === 'SOLID') return rgbToHex((p as SolidPaint).color);
    return "#000000";
  })();
  const fontSize = typeof node.fontSize === 'number' ? node.fontSize : 14;
  const align = node.textAlignHorizontal === "CENTER" ? "Center" : node.textAlignHorizontal === "RIGHT" ? "Right" : "Left";
  return new FigmaTextNode(
    node.id,
    node.name,
    node.visible,
    node.width,
    node.height,
    node.x,
    node.y,
    node.characters,
    fontSize,
    color,
    align
  );
}

/**
 * Component / Instance → FigmaImageNode (일단 이미지 취급)
 */
function parseImageNode(node: SceneNode): FigmaImageNode {
  let imageUrl = "";
  const fills = (node as any).fills;
  if (Array.isArray(fills) && fills.length > 0 && (fills[0] as any).imageHash) {
    imageUrl = (fills[0] as any).imageHash;
  }
  // default contentScale to 'Fit'
  return new FigmaImageNode(
    node.id,
    node.name,
    node.visible,
    node.width,
    node.height,
    node.x,
    node.y,
    imageUrl,
    "Fit"
  );
}

function parseEllipseNode(node: EllipseNode): FigmaEllipseNode {
  const fillColor = ((): string | undefined => {
    const fills = (node as any).fills;
    if (!Array.isArray(fills) || fills.length === 0) return undefined;
    const p = fills[0];
    if (p && (p as any).type === 'SOLID') return rgbToHex((p as SolidPaint).color);
    return undefined;
  })();

  return new FigmaEllipseNode(
    node.id,
    node.name,
    node.visible,
    node.width,
    node.height,
    node.x,
    node.y,
    fillColor
  );
}

function parseLineNode(node: LineNode): FigmaRectangleNode {
  // Represent a line as a thin rectangle approximation
  const strokeColor = ((): string | undefined => {
    const strokes = (node as any).strokes;
    if (!Array.isArray(strokes) || strokes.length === 0) return undefined;
    const s = strokes[0];
    if (s && (s as any).type === 'SOLID') return rgbToHex((s as SolidPaint).color);
    return undefined;
  })();

  return new FigmaRectangleNode(
    node.id,
    node.name,
    node.visible,
    // width/height might be zero for lines; ensure at least 1
    node.width || 1,
    node.height || 1,
    node.x,
    node.y,
    strokeColor,
    undefined
  );
}

/**
 * RGB → HEX 변환 유틸
 */
function rgbToHex(color: RGB): string {
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
