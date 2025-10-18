// FigmaFrameNode.ts
import { FigmaBaseNode } from "./figmaNode";

export abstract class FigmaFrameNode extends FigmaBaseNode {
  backgroundColor?: string;

  constructor(
    id: string,
    name: string,
    visible: boolean,
    width: number,
    height: number,
    x: number,
    y: number,
    children?: FigmaBaseNode[],
    backgroundColor?: string
  ) {
    super(id, name, visible, width, height, x, y, children);
    this.backgroundColor = backgroundColor;
  }
}

export class FigmaBoxNode extends FigmaFrameNode {

}

export class FigmaRowNode extends FigmaFrameNode {

}

export class FigmaColumnNode extends FigmaFrameNode {

}


