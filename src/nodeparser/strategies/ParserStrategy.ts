import { FigmaBaseNode } from "../../figmanode/figmaNode";

// A parser strategy receives a SceneNode and a parseChildren helper so
// implementations don't need to import the main parser (avoids circular deps).
export interface ParserStrategy {
  nodeType: string;
  parse: (node: SceneNode, parseChild: (n: SceneNode) => FigmaBaseNode | null) => FigmaBaseNode | null;
}
