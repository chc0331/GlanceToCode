// ======================================================
// types.ts
// 역할: 파이프라인에서 사용하는 데이터 타입들을 정의합니다.
// - Figma에서 추출한 노드(중간 표현)인 `FigmaNode`
// - 코드 생성에 사용되는 중간 표현 `GlanceComponent`
// 다른 모듈(extract, map, generate)에서 이 타입을 import 하여 사용합니다.
// ======================================================
// Pipeline Types
export interface FigmaNode {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: ReadonlyArray<Paint>;
  children?: FigmaNode[];
  characters?: string;
  fontSize?: number;
  fontName?: FontName;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
}

export interface GlanceComponent {
  type: 'Box' | 'Column' | 'Row' | 'Text' | 'Image';
  modifier: string;
  content?: string;
  children?: GlanceComponent[];
  properties: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    backgroundColor?: string;
    text?: string;
    fontSize?: number;
    textAlign?: string;
    padding?: {
      start?: number;
      end?: number;
      top?: number;
      bottom?: number;
    };
    spacing?: number;
    alignment?: string;
  };
}
