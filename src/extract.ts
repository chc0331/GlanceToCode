// ======================================================
// extract.ts
// 역할: Figma SceneNode에서 필요한 속성을 추출하여
// 중간 표현인 `FigmaNode` 객체로 변환합니다.
// - 위치, 크기, fills, 텍스트/레이아웃 관련 속성 등 추출
// - 재귀적으로 자식 노드도 추출하여 트리 구조 생성
// ======================================================
import { FigmaNode } from './types';
import { parseFigmaNode } from './nodeparser/FigmaNodeParser';
import { FigmaBaseNode } from './figmanode/figmaNode';

export function extractNode(node: SceneNode): FigmaNode | null {
  // Try to use the richer parser which creates figmanode class instances,
  // then map that structure back into the pipeline's lightweight `FigmaNode` type.
  const parsed = parseFigmaNode(node);
  console.log("Parsed nodes : ", parsed);
  if (parsed) {
    return mapFigmaBaseNodeToFigmaNode(parsed);
  }

  // Fallback: preserve original light-weight extraction behavior
  const baseNode: FigmaNode = {
    id: node.id,
    type: node.type,
    name: node.name,
    x: Math.round(node.x),
    y: Math.round(node.y),
    width: Math.round(node.width),
    height: Math.round(node.height),
  };

  if ('fills' in node && node.fills && node.fills !== figma.mixed) {
    baseNode.fills = node.fills as ReadonlyArray<Paint>;
  }

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    baseNode.characters = textNode.characters;
    baseNode.fontSize = textNode.fontSize as number;
    baseNode.fontName = textNode.fontName as FontName;
    baseNode.textAlignHorizontal = textNode.textAlignHorizontal;
    baseNode.textAlignVertical = textNode.textAlignVertical;
  }

  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    const frameNode = node as FrameNode;
    baseNode.layoutMode = frameNode.layoutMode;
    baseNode.primaryAxisAlignItems = frameNode.primaryAxisAlignItems;
    baseNode.counterAxisAlignItems = frameNode.counterAxisAlignItems;
    baseNode.paddingLeft = frameNode.paddingLeft;
    baseNode.paddingRight = frameNode.paddingRight;
    baseNode.paddingTop = frameNode.paddingTop;
    baseNode.paddingBottom = frameNode.paddingBottom;
    baseNode.itemSpacing = frameNode.itemSpacing;
  }

  if ('children' in node && node.children) {
    baseNode.children = node.children
      .map(child => extractNode(child))
      .filter((child): child is FigmaNode => child !== null);
  }

  return baseNode;
}

function mapFigmaBaseNodeToFigmaNode(n: FigmaBaseNode): FigmaNode {
  const out: FigmaNode = {
    id: n.id,
    type: (n as any).constructor && (n as any).constructor.name ? (n as any).constructor.name : 'Node',
    name: n.name,
    x: Math.round(n.x || 0),
    y: Math.round(n.y || 0),
    width: Math.round(n.width || 0),
    height: Math.round(n.height || 0),
  };

  // map known properties
  if ((n as any).fillColor) out.fills = [{ type: 'SOLID', color: hexToRgb((n as any).fillColor) } as any];
  if ((n as any).backgroundColor) out.fills = [{ type: 'SOLID', color: hexToRgb((n as any).backgroundColor) } as any];
  if ((n as any).text) {
    out.characters = (n as any).text;
    out.fontSize = (n as any).fontSize;
  }

  if ((n as any).children && Array.isArray((n as any).children)) {
    out.children = (n as any).children.map((c: FigmaBaseNode) => mapFigmaBaseNodeToFigmaNode(c));
  }

  return out;
}

function hexToRgb(hex?: string): RGB | undefined {
  if (!hex) return undefined;
  // remove '#'
  const h = hex.replace('#', '');
  if (h.length !== 6) return undefined;
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return { r, g, b } as RGB;
}
