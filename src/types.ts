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
