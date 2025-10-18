// FigmaImageNode.ts
import { FigmaBaseNode } from "./figmaNode";
export class FigmaImageNode extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, imageUrl, contentScale) {
        super(id, name, visible, width, height, x, y);
        this.imageUrl = imageUrl;
        this.contentScale = contentScale;
    }
}
