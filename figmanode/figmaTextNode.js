// FigmaTextNode.ts
import { FigmaBaseNode } from "./figmaNode";
export class FigmaTextNode extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, text, fontSize, color, textAlign) {
        super(id, name, visible, width, height, x, y);
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
        this.textAlign = textAlign;
    }
}
