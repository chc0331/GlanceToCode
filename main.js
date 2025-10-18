"use strict";
(() => {
  // src/figmanode/figmaNode.ts
  var FigmaBaseNode = class {
    constructor(id, name, visible, width, height, x, y, children) {
      this.id = id;
      this.name = name;
      this.visible = visible;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.children = children;
    }
    // abstract toGlance(): string;
  };

  // src/figmanode/figmaFrameNode.ts
  var FigmaFrameNode = class extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, children, backgroundColor) {
      super(id, name, visible, width, height, x, y, children);
      this.backgroundColor = backgroundColor;
    }
  };
  var FigmaBoxNode = class extends FigmaFrameNode {
  };
  var FigmaRowNode = class extends FigmaFrameNode {
  };
  var FigmaColumnNode = class extends FigmaFrameNode {
  };

  // src/nodeparser/strategies/frameStrategy.ts
  var frameStrategy = {
    nodeType: "FRAME",
    parse(node, parseChild) {
      const layoutMode = node.layoutMode || "NONE";
      const children = "children" in node ? node.children.map((c) => parseChild(c)).filter((n) => n !== null) : [];
      const backgroundColor = (() => {
        if (!Array.isArray(node.backgrounds) || node.backgrounds.length === 0)
          return void 0;
        const b = node.backgrounds[0];
        if (b && b.type === "SOLID")
          return rgbToHex(b.color);
        return void 0;
      })();
      if (layoutMode === "HORIZONTAL")
        return new FigmaRowNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
      if (layoutMode === "VERTICAL")
        return new FigmaColumnNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
      return new FigmaBoxNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, children, backgroundColor);
    }
  };
  function rgbToHex(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
    const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
    const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  // src/figmanode/figmaRectangleNode.ts
  var FigmaRectangleNode = class extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, fillColor, cornerRadius) {
      super(id, name, visible, width, height, x, y);
      this.fillColor = fillColor;
      this.cornerRadius = cornerRadius;
    }
  };

  // src/nodeparser/strategies/rectangleStrategy.ts
  var rectangleStrategy = {
    nodeType: "RECTANGLE",
    parse(node) {
      const fillColor = (() => {
        const fills = node.fills;
        if (!Array.isArray(fills) || fills.length === 0)
          return void 0;
        const p = fills[0];
        if (p && p.type === "SOLID")
          return rgbToHex2(p.color);
        return void 0;
      })();
      return new FigmaRectangleNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, fillColor, void 0);
    }
  };
  function rgbToHex2(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
    const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
    const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  // src/figmanode/figmaTextNode.ts
  var FigmaTextNode = class extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, text, fontSize, color, textAlign) {
      super(id, name, visible, width, height, x, y);
      this.text = text;
      this.fontSize = fontSize;
      this.color = color;
      this.textAlign = textAlign;
    }
  };

  // src/nodeparser/strategies/textStrategy.ts
  var textStrategy = {
    nodeType: "TEXT",
    parse(node) {
      const color = (() => {
        const fills = node.fills;
        if (!Array.isArray(fills) || fills.length === 0)
          return "#000000";
        const p = fills[0];
        if (p && p.type === "SOLID")
          return rgbToHex3(p.color);
        return "#000000";
      })();
      const fontSize = typeof node.fontSize === "number" ? node.fontSize : 14;
      const align = node.textAlignHorizontal === "CENTER" ? "Center" : node.textAlignHorizontal === "RIGHT" ? "Right" : "Left";
      return new FigmaTextNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, node.characters, fontSize, color, align);
    }
  };
  function rgbToHex3(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
    const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
    const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  // src/figmanode/figmaEllipseNode.ts
  var FigmaEllipseNode = class extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, fillColor) {
      super(id, name, visible, width, height, x, y);
      this.fillColor = fillColor;
    }
  };

  // src/nodeparser/strategies/ellipseStrategy.ts
  var ellipseStrategy = {
    nodeType: "ELLIPSE",
    parse(node) {
      const fillColor = (() => {
        const fills = node.fills;
        if (!Array.isArray(fills) || fills.length === 0)
          return void 0;
        const p = fills[0];
        if (p && p.type === "SOLID")
          return rgbToHex4(p.color);
        return void 0;
      })();
      return new FigmaEllipseNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, fillColor);
    }
  };
  function rgbToHex4(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
    const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
    const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  // src/nodeparser/strategies/lineStrategy.ts
  var lineStrategy = {
    nodeType: "LINE",
    parse(node) {
      const strokeColor = (() => {
        const strokes = node.strokes;
        if (!Array.isArray(strokes) || strokes.length === 0)
          return void 0;
        const s = strokes[0];
        if (s && s.type === "SOLID")
          return rgbToHex5(s.color);
        return void 0;
      })();
      return new FigmaRectangleNode(node.id, node.name, node.visible, node.width || 1, node.height || 1, node.x, node.y, strokeColor, void 0);
    }
  };
  function rgbToHex5(color) {
    const r = Math.round(color.r * 255).toString(16).padStart(2, "0");
    const g = Math.round(color.g * 255).toString(16).padStart(2, "0");
    const b = Math.round(color.b * 255).toString(16).padStart(2, "0");
    return `#${r}${g}${b}`;
  }

  // src/figmanode/figmaImageNode.ts
  var FigmaImageNode = class extends FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, imageUrl, contentScale) {
      super(id, name, visible, width, height, x, y);
      this.imageUrl = imageUrl;
      this.contentScale = contentScale;
    }
  };

  // src/nodeparser/strategies/imageStrategy.ts
  var imageStrategy = {
    nodeType: "COMPONENT",
    parse(node) {
      let imageUrl = "";
      const fills = node.fills;
      if (Array.isArray(fills) && fills.length > 0 && fills[0].imageHash) {
        imageUrl = fills[0].imageHash;
      }
      return new FigmaImageNode(node.id, node.name, node.visible, node.width, node.height, node.x, node.y, imageUrl, "Fit");
    }
  };
  var instanceImageStrategy = {
    nodeType: "INSTANCE",
    parse: imageStrategy.parse
  };

  // src/nodeparser/serializer.ts
  function toPlain(node) {
    const base = {
      id: node.id,
      name: node.name,
      visible: node.visible,
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y
    };
    if (node.children) {
      base.children = node.children.map((c) => toPlain(c));
    }
    if (node.backgroundColor)
      base.backgroundColor = node.backgroundColor;
    if (node.fillColor)
      base.fillColor = node.fillColor;
    if (node.text)
      base.text = node.text;
    if (node.fontSize)
      base.fontSize = node.fontSize;
    if (node.color)
      base.color = node.color;
    if (node.imageUrl)
      base.imageUrl = node.imageUrl;
    return base;
  }
  function serializeNodesToJSON(nodes, pretty = true) {
    const plain = nodes.map((n) => toPlain(n));
    return pretty ? JSON.stringify(plain, null, 2) : JSON.stringify(plain);
  }

  // src/nodeparser/FigmaNodeParser.ts
  function parseFigmaNode(node) {
    const handler = parserRegistry.get(node.type);
    if (handler)
      return handler(node);
    return null;
  }
  var parserRegistry = /* @__PURE__ */ new Map();
  function registerParserStrategy(nodeType, fn) {
    parserRegistry.set(nodeType, fn);
  }
  var builtIn = [
    frameStrategy,
    rectangleStrategy,
    textStrategy,
    ellipseStrategy,
    lineStrategy,
    imageStrategy,
    instanceImageStrategy
  ];
  for (const s of builtIn) {
    registerParserStrategy(s.nodeType, (n) => s.parse(n, parseFigmaNode));
  }
  function parseSelectedNodes() {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("\uC120\uD0DD\uB41C \uB178\uB4DC\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4.");
      return [];
    }
    return selection.map((node) => parseFigmaNode(node)).filter((n) => n !== null);
  }

  // src/extract.ts
  function extractNode(node) {
    const parsed = parseFigmaNode(node);
    console.log("Parsed nodes : ", parsed);
    if (parsed) {
      return mapFigmaBaseNodeToFigmaNode(parsed);
    }
    const baseNode = {
      id: node.id,
      type: node.type,
      name: node.name,
      x: Math.round(node.x),
      y: Math.round(node.y),
      width: Math.round(node.width),
      height: Math.round(node.height)
    };
    if ("fills" in node && node.fills && node.fills !== figma.mixed) {
      baseNode.fills = node.fills;
    }
    if (node.type === "TEXT") {
      const textNode = node;
      baseNode.characters = textNode.characters;
      baseNode.fontSize = textNode.fontSize;
      baseNode.fontName = textNode.fontName;
      baseNode.textAlignHorizontal = textNode.textAlignHorizontal;
      baseNode.textAlignVertical = textNode.textAlignVertical;
    }
    if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") {
      const frameNode = node;
      baseNode.layoutMode = frameNode.layoutMode;
      baseNode.primaryAxisAlignItems = frameNode.primaryAxisAlignItems;
      baseNode.counterAxisAlignItems = frameNode.counterAxisAlignItems;
      baseNode.paddingLeft = frameNode.paddingLeft;
      baseNode.paddingRight = frameNode.paddingRight;
      baseNode.paddingTop = frameNode.paddingTop;
      baseNode.paddingBottom = frameNode.paddingBottom;
      baseNode.itemSpacing = frameNode.itemSpacing;
    }
    if ("children" in node && node.children) {
      baseNode.children = node.children.map((child) => extractNode(child)).filter((child) => child !== null);
    }
    return baseNode;
  }
  function mapFigmaBaseNodeToFigmaNode(n) {
    const out = {
      id: n.id,
      type: n.constructor && n.constructor.name ? n.constructor.name : "Node",
      name: n.name,
      x: Math.round(n.x || 0),
      y: Math.round(n.y || 0),
      width: Math.round(n.width || 0),
      height: Math.round(n.height || 0)
    };
    if (n.fillColor)
      out.fills = [{ type: "SOLID", color: hexToRgb(n.fillColor) }];
    if (n.backgroundColor)
      out.fills = [{ type: "SOLID", color: hexToRgb(n.backgroundColor) }];
    if (n.text) {
      out.characters = n.text;
      out.fontSize = n.fontSize;
    }
    if (n.children && Array.isArray(n.children)) {
      out.children = n.children.map((c) => mapFigmaBaseNodeToFigmaNode(c));
    }
    return out;
  }
  function hexToRgb(hex) {
    if (!hex)
      return void 0;
    const h = hex.replace("#", "");
    if (h.length !== 6)
      return void 0;
    const r = parseInt(h.substring(0, 2), 16) / 255;
    const g = parseInt(h.substring(2, 4), 16) / 255;
    const b = parseInt(h.substring(4, 6), 16) / 255;
    return { r, g, b };
  }

  // src/map.ts
  function mapNodeToComponent(node) {
    switch (node.type) {
      case "RECTANGLE":
        return mapRectangleToBox(node);
      case "TEXT":
        return mapTextToText(node);
      case "FRAME":
      case "COMPONENT":
      case "INSTANCE":
        return mapFrameToContainer(node);
      default:
        console.warn(`Unsupported node type: ${node.type}`);
        return null;
    }
  }
  function mapRectangleToBox(node) {
    const modifier = buildModifier(node);
    let backgroundColor = "";
    if (node.fills && node.fills.length > 0) {
      const solid = node.fills.find((p) => p.type === "SOLID");
      if (solid) {
        const r = Math.round((solid.color.r || 0) * 255);
        const g = Math.round((solid.color.g || 0) * 255);
        const b = Math.round((solid.color.b || 0) * 255);
        backgroundColor = `Color(${r}, ${g}, ${b})`;
      }
    }
    return {
      type: "Box",
      modifier,
      properties: {
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        backgroundColor
      }
    };
  }
  function mapTextToText(node) {
    const modifier = buildModifier(node);
    return {
      type: "Text",
      modifier,
      content: node.characters || "",
      properties: {
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        text: node.characters || "",
        fontSize: node.fontSize,
        textAlign: mapTextAlign(node.textAlignHorizontal)
      }
    };
  }
  function mapFrameToContainer(node) {
    const modifier = buildModifier(node);
    let containerType = "Box";
    if (node.layoutMode === "VERTICAL") {
      containerType = "Column";
    } else if (node.layoutMode === "HORIZONTAL") {
      containerType = "Row";
    }
    const children = [];
    if (node.children) {
      for (const child of node.children) {
        const childComponent = mapNodeToComponent(child);
        if (childComponent) {
          children.push(childComponent);
        }
      }
    }
    return {
      type: containerType,
      modifier,
      children,
      properties: {
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
        padding: {
          start: node.paddingLeft,
          end: node.paddingRight,
          top: node.paddingTop,
          bottom: node.paddingBottom
        },
        spacing: node.itemSpacing,
        alignment: mapAlignment(node.primaryAxisAlignItems, node.counterAxisAlignItems)
      }
    };
  }
  function buildModifier(node) {
    const parts = [];
    if (node.x !== 0 || node.y !== 0) {
      parts.push(`offset(x = ${node.x}.dp, y = ${node.y}.dp)`);
    }
    parts.push(`size(width = ${node.width}.dp, height = ${node.height}.dp)`);
    return parts.join("\n        .");
  }
  function mapTextAlign(align) {
    switch (align) {
      case "CENTER":
        return "TextAlign.Center";
      case "RIGHT":
        return "TextAlign.End";
      case "JUSTIFIED":
        return "TextAlign.Justify";
      default:
        return "TextAlign.Start";
    }
  }
  function mapAlignment(primary, counter) {
    if (primary === "CENTER" && counter === "CENTER") {
      return "Alignment.Center";
    }
    return "Alignment.TopStart";
  }

  // src/generate.ts
  function generateImports() {
    return `import androidx.compose.foundation.layout.*
import androidx.compose.foundation.background
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.glance.*
import androidx.glance.action.*
import androidx.glance.appwidget.*
import androidx.glance.appwidget.action.*
import androidx.glance.layout.*
import androidx.glance.text.*`;
  }
  function generateComponent(component, indentLevel) {
    const indent = "    ".repeat(indentLevel);
    const nextIndent = "    ".repeat(indentLevel + 1);
    let code = "";
    switch (component.type) {
      case "Box":
        code += generateBox(component, indent, nextIndent);
        break;
      case "Column":
        code += generateColumn(component, indent, nextIndent);
        break;
      case "Row":
        code += generateRow(component, indent, nextIndent);
        break;
      case "Text":
        code += generateText(component, indent);
        break;
      default:
        code += `${indent}// Unsupported component type: ${component.type}
`;
    }
    return code;
  }
  function generateBox(component, indent, nextIndent) {
    let code = `${indent}Box(
`;
    code += `${nextIndent}modifier = Modifier
`;
    if (component.modifier) {
      code += `${nextIndent}    .${component.modifier}
`;
    }
    if (component.properties.backgroundColor) {
      code += `${nextIndent}    .background(${component.properties.backgroundColor})
`;
    }
    code += `${nextIndent}
`;
    if (component.children && component.children.length > 0) {
      code += `${nextIndent}) {
`;
      for (const child of component.children) {
        code += generateComponent(child, component.children.indexOf(child) + 2);
      }
      code += `${nextIndent}}
`;
    } else {
      code += `${nextIndent}) {}
`;
    }
    return code;
  }
  function generateColumn(component, indent, nextIndent) {
    let code = `${indent}Column(
`;
    code += `${nextIndent}modifier = Modifier
`;
    if (component.modifier) {
      code += `${nextIndent}    .${component.modifier}
`;
    }
    if (component.properties.spacing) {
      code += `${nextIndent}    .padding(${component.properties.spacing}.dp)
`;
    }
    code += `${nextIndent}
`;
    if (component.children && component.children.length > 0) {
      code += `${nextIndent}) {
`;
      for (const child of component.children) {
        code += generateComponent(child, component.children.indexOf(child) + 2);
      }
      code += `${nextIndent}}
`;
    } else {
      code += `${nextIndent}) {}
`;
    }
    return code;
  }
  function generateRow(component, indent, nextIndent) {
    let code = `${indent}Row(
`;
    code += `${nextIndent}modifier = Modifier
`;
    if (component.modifier) {
      code += `${nextIndent}    .${component.modifier}
`;
    }
    if (component.properties.spacing) {
      code += `${nextIndent}    .padding(${component.properties.spacing}.dp)
`;
    }
    code += `${nextIndent}
`;
    if (component.children && component.children.length > 0) {
      code += `${nextIndent}) {
`;
      for (const child of component.children) {
        code += generateComponent(child, component.children.indexOf(child) + 2);
      }
      code += `${nextIndent}}
`;
    } else {
      code += `${nextIndent}) {}
`;
    }
    return code;
  }
  function generateText(component, indent) {
    let code = `${indent}Text(
`;
    code += `${indent}    text = "${component.properties.text || ""}",
`;
    if (component.properties.fontSize) {
      code += `${indent}    fontSize = ${component.properties.fontSize}.sp,
`;
    }
    if (component.properties.textAlign) {
      code += `${indent}    textAlign = ${component.properties.textAlign},
`;
    }
    code += `${indent}    modifier = Modifier
`;
    if (component.modifier) {
      code += `${indent}        .${component.modifier}
`;
    }
    code += `${indent})
`;
    return code;
  }

  // src/run_pipeline.ts
  async function runPipeline() {
    console.log("\u{1F680} Pipeline started");
    try {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        figma.notify("Please select some nodes to convert");
        figma.closePlugin();
        return;
      }
      const nodes = [];
      for (const node of selection) {
        console.log("Selected nodes : ", node);
        const extractedNode = extractNode(node);
        if (extractedNode) {
          nodes.push(extractedNode);
        }
      }
      if (nodes.length === 0) {
        figma.notify("No supported nodes found in selection");
        figma.closePlugin();
        return;
      }
      const components = [];
      for (const node of nodes) {
        const component = mapNodeToComponent(node);
        if (component) {
          components.push(component);
        }
      }
      let code = generateImports();
      code += "\n\n";
      code += "@Composable\nfun GeneratedFromFigma() {\n";
      for (const component of components) {
        code += generateComponent(component, 1);
      }
      code += "}";
      figma.showUI(__html__, { width: 600, height: 500 });
      figma.ui.postMessage({ type: "code", code });
      const parsedJson = serializeNodesToJSON(parseSelectedNodes(), true);
      if (parsedJson) {
        console.log("--- parsed tree JSON START ---");
        console.log(parsedJson);
        console.log("--- parsed tree JSON END ---");
        figma.ui.postMessage({ type: "parsedTree", json: parsedJson });
      }
      figma.ui.onmessage = (msg) => {
        if (msg.type === "close") {
          figma.closePlugin();
        }
      };
      console.log("\u2705 Pipeline finished successfully");
    } catch (error) {
      console.error("\u274C Pipeline failed:", error);
      figma.notify(`Pipeline error: ${error}`);
      figma.closePlugin();
    }
  }

  // src/main.ts
  figma.on("run", async () => {
    try {
      await runPipeline();
    } catch (error) {
      console.error("Plugin error:", error);
      figma.notify(`Error: ${error}`);
      figma.closePlugin();
    }
  });
})();
//# sourceMappingURL=main.js.map
