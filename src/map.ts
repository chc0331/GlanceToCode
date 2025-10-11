// ======================================================
// map.ts
// 역할: `FigmaNode` 중간 표현을 Glance용 컴포넌트 표현(`GlanceComponent`)으로 변환합니다.
// - 노드 타입별 매핑(mapRectangleToBox, mapTextToText, mapFrameToContainer)
// - 레이아웃/정렬/Modifier 문자열 생성
// ======================================================
import { FigmaNode, GlanceComponent } from './types';

export function mapNodeToComponent(node: FigmaNode): GlanceComponent | null {
  switch (node.type) {
    case 'RECTANGLE':
      return mapRectangleToBox(node);
    case 'TEXT':
      return mapTextToText(node);
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return mapFrameToContainer(node);
    default:
      console.warn(`Unsupported node type: ${node.type}`);
      return null;
  }
}

export function mapRectangleToBox(node: FigmaNode): GlanceComponent {
  const modifier = buildModifier(node);
  let backgroundColor = '';
  if (node.fills && node.fills.length > 0) {
    const solid = node.fills.find((p): p is SolidPaint => p.type === 'SOLID');
    if (solid) {
      const r = Math.round((solid.color.r || 0) * 255);
      const g = Math.round((solid.color.g || 0) * 255);
      const b = Math.round((solid.color.b || 0) * 255);
      backgroundColor = `Color(${r}, ${g}, ${b})`;
    }
  }

  return {
    type: 'Box',
    modifier,
    properties: {
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y,
      backgroundColor,
    },
  };
}

export function mapTextToText(node: FigmaNode): GlanceComponent {
  const modifier = buildModifier(node);
  return {
    type: 'Text',
    modifier,
    content: node.characters || '',
    properties: {
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y,
      text: node.characters || '',
      fontSize: node.fontSize,
      textAlign: mapTextAlign(node.textAlignHorizontal),
    },
  };
}

export function mapFrameToContainer(node: FigmaNode): GlanceComponent {
  const modifier = buildModifier(node);
  let containerType: 'Column' | 'Row' | 'Box' = 'Box';
  if (node.layoutMode === 'VERTICAL') {
    containerType = 'Column';
  } else if (node.layoutMode === 'HORIZONTAL') {
    containerType = 'Row';
  }

  const children: GlanceComponent[] = [];
  if (node.children) {
    for (const child of node.children) {
      const childComponent = mapNodeToComponent(child);
      if (childComponent) {
        children.push(childComponent);
      }
    }
  }

  return {
    type: containerType,
    modifier,
    children,
    properties: {
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y,
      padding: {
        start: node.paddingLeft,
        end: node.paddingRight,
        top: node.paddingTop,
        bottom: node.paddingBottom,
      },
      spacing: node.itemSpacing,
      alignment: mapAlignment(node.primaryAxisAlignItems, node.counterAxisAlignItems),
    },
  };
}

export function buildModifier(node: FigmaNode): string {
  const parts: string[] = [];
  if (node.x !== 0 || node.y !== 0) {
    parts.push(`offset(x = ${node.x}.dp, y = ${node.y}.dp)`);
  }
  parts.push(`size(width = ${node.width}.dp, height = ${node.height}.dp)`);
  return parts.join('\n        .');
}

export function mapTextAlign(align?: string): string {
  switch (align) {
    case 'CENTER': return 'TextAlign.Center';
    case 'RIGHT': return 'TextAlign.End';
    case 'JUSTIFIED': return 'TextAlign.Justify';
    default: return 'TextAlign.Start';
  }
}

export function mapAlignment(primary?: string, counter?: string): string {
  if (primary === 'CENTER' && counter === 'CENTER') {
    return 'Alignment.Center';
  }
  return 'Alignment.TopStart';
}
