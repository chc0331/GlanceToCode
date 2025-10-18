// FigmaEllipseNode.ts
import { FigmaBaseNode } from "./figmaNode";
export class FigmaEllipseNode extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, fillColor) {
        super(id, name, visible, width, height, x, y);
        this.fillColor = fillColor;
    }
}
