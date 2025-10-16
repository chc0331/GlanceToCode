// FigmaTextNode.ts

import { FigmaBaseNode } from "./figmaNode";

export class FigmaTextNode extends FigmaBaseNode {
    text: string;
    fontSize: number;
    color: string;
    textAlign?: "Left" | "Center" | "Right";

    constructor(
        id: string,
        name: string,
        visible: boolean,
        width: number,
        height: number,
        x: number,
        y: number,
        text: string,
        fontSize: number,
        color: string,
        textAlign?: "Left" | "Center" | "Right"
    ) {
        super(id, name, visible, width, height, x, y);
        this.text = text;
        this.fontSize = fontSize;
        this.color = color;
        this.textAlign = textAlign;
    }
}
