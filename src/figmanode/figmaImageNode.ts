// FigmaImageNode.ts

import { FigmaBaseNode } from "./figmaNode";

export class FigmaImageNode extends FigmaBaseNode {
    imageUrl: string;
    contentScale: "Fit" | "Crop" | "Fill";

    constructor(
        id: string,
        name: string,
        visible: boolean,
        width: number,
        height: number,
        x: number,
        y: number,
        imageUrl: string,
        contentScale: "Fit" | "Crop" | "Fill"
    ) {
        super(id, name, visible, width, height, x, y);
        this.imageUrl = imageUrl;
        this.contentScale = contentScale;
    }
}
