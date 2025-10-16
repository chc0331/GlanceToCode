// FigmaRectangleNode.ts

import { FigmaBaseNode } from "./figmaNode";


export class FigmaRectangleNode extends FigmaBaseNode {
    fillColor?: string;
    cornerRadius?: number;

    constructor(
        id: string,
        name: string,
        visible: boolean,
        width: number,
        height: number,
        x: number,
        y: number,
        fillColor?: string,
        cornerRadius?: number
    ) {
        super(id, name, visible, width, height, x, y);
        this.fillColor = fillColor;
        this.cornerRadius = cornerRadius;
    }
}
