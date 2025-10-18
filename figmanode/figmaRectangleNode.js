// FigmaRectangleNode.ts
import { FigmaBaseNode } from "./figmaNode";
export class FigmaRectangleNode extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, fillColor, cornerRadius) {
        super(id, name, visible, width, height, x, y);
        this.fillColor = fillColor;
        this.cornerRadius = cornerRadius;
    }
}
