// FigmaEllipseNode.ts

import { FigmaBaseNode } from "./figmaNode";

export class FigmaEllipseNode extends FigmaBaseNode {
    fillColor?: string;

    constructor(
        id: string,
        name: string,
        visible: boolean,
        width: number,
        height: number,
        x: number,
        y: number,
        fillColor?: string
    ) {
        super(id, name, visible, width, height, x, y);
        this.fillColor = fillColor;
    }
}
