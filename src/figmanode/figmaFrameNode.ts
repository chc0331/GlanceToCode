// FigmaFrameNode.ts
import { FigmaBaseNode } from "./figmaNode";

export class FigmaFrameNode extends FigmaBaseNode {
  layoutMode: "HORIZONTAL" | "VERTICAL" | "NONE";
  backgroundColor?: string;

  constructor(
    id: string,
    name: string,
    visible: boolean,
    width: number,
    height: number,
    x: number,
    y: number,
    layoutMode: "HORIZONTAL" | "VERTICAL" | "NONE",
    children?: FigmaBaseNode[],
    backgroundColor?: string
  ) {
    super(id, name, visible, width, height, x, y, children);
    this.layoutMode = layoutMode;
    this.backgroundColor = backgroundColor;
  }
}


