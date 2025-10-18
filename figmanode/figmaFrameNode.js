// FigmaFrameNode.ts
import { FigmaBaseNode } from "./figmaNode";
export class FigmaFrameNode extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, children, backgroundColor) {
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
