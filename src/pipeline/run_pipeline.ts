// Design to Code Plugin - Pipeline Architecture
// Converts Figma designs to Jetpack Glance code

// Pipeline Types
interface FigmaNode {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fills?: ReadonlyArray<Paint>;
  children?: FigmaNode[];
  characters?: string;
  fontSize?: number;
  fontName?: FontName;
  textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM';
  layoutMode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL' | 'GRID';
  primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingBottom?: number;
  itemSpacing?: number;
}

interface GlanceComponent {
  type: 'Box' | 'Column' | 'Row' | 'Text' | 'Image';
  modifier: string;
  content?: string;
  children?: GlanceComponent[];
  properties: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    backgroundColor?: string;
    text?: string;
    fontSize?: number;
    textAlign?: string;
    padding?: {
      start?: number;
      end?: number;
      top?: number;
      bottom?: number;
    };
    spacing?: number;
    alignment?: string;
  };
}

// Node Extractor
function extractNode(node: SceneNode): FigmaNode | null {
  const baseNode: FigmaNode = {
    id: node.id,
    type: node.type,
    name: node.name,
    x: Math.round(node.x),
    y: Math.round(node.y),
    width: Math.round(node.width),
    height: Math.round(node.height),
  };

  // Extract fills for visual elements
  if ('fills' in node && node.fills && node.fills !== figma.mixed) {
    baseNode.fills = node.fills as ReadonlyArray<Paint>;
  }

  // Extract text properties
  if (node.type === 'TEXT') {
    const textNode = node as TextNode;
    baseNode.characters = textNode.characters;
    baseNode.fontSize = textNode.fontSize as number;
    baseNode.fontName = textNode.fontName as FontName;
    baseNode.textAlignHorizontal = textNode.textAlignHorizontal;
    baseNode.textAlignVertical = textNode.textAlignVertical;
  }

  // Extract layout properties for frames/components
  if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
    const frameNode = node as FrameNode;
    baseNode.layoutMode = frameNode.layoutMode;
    baseNode.primaryAxisAlignItems = frameNode.primaryAxisAlignItems;
    baseNode.counterAxisAlignItems = frameNode.counterAxisAlignItems;
    baseNode.paddingLeft = frameNode.paddingLeft;
    baseNode.paddingRight = frameNode.paddingRight;
    baseNode.paddingTop = frameNode.paddingTop;
    baseNode.paddingBottom = frameNode.paddingBottom;
    baseNode.itemSpacing = frameNode.itemSpacing;
  }

  // Extract children recursively
  if ('children' in node && node.children) {
    baseNode.children = node.children
      .map(child => extractNode(child))
      .filter((child): child is FigmaNode => child !== null);
  }

  return baseNode;
}

// Mapping Engine
function mapNodeToComponent(node: FigmaNode): GlanceComponent | null {
  switch (node.type) {
    case 'RECTANGLE':
      return mapRectangleToBox(node);
    case 'TEXT':
      return mapTextToText(node);
    case 'FRAME':
    case 'COMPONENT':
    case 'INSTANCE':
      return mapFrameToContainer(node);
    default:
      console.warn(`Unsupported node type: ${node.type}`);
      return null;
  }
}

function mapRectangleToBox(node: FigmaNode): GlanceComponent {
  const modifier = buildModifier(node);
  
  // Extract background color
  let backgroundColor = '';
  if (node.fills && node.fills.length > 0) {
    const solid = node.fills.find((p): p is SolidPaint => p.type === 'SOLID');
    if (solid) {
      const r = Math.round((solid.color.r || 0) * 255);
      const g = Math.round((solid.color.g || 0) * 255);
      const b = Math.round((solid.color.b || 0) * 255);
      backgroundColor = `Color(${r}, ${g}, ${b})`;
    }
  }

  return {
    type: 'Box',
    modifier,
    properties: {
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y,
      backgroundColor,
    },
  };
}

function mapTextToText(node: FigmaNode): GlanceComponent {
  const modifier = buildModifier(node);
  
  return {
    type: 'Text',
    modifier,
    content: node.characters || '',
    properties: {
      width: node.width,
      height: node.height,
      x: node.x,
      y: node.y,
      text: node.characters || '',
      fontSize: node.fontSize,
      textAlign: mapTextAlign(node.textAlignHorizontal),
    },
  };
}

function mapFrameToContainer(node: FigmaNode): GlanceComponent {
  const modifier = buildModifier(node);
  
  // Determine container type based on layout mode
  let containerType: 'Column' | 'Row' | 'Box' = 'Box';
  if (node.layoutMode === 'VERTICAL') {
    containerType = 'Column';
  } else if (node.layoutMode === 'HORIZONTAL') {
    containerType = 'Row';
  }

  // Map children
  const children: GlanceComponent[] = [];
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
        bottom: node.paddingBottom,
      },
      spacing: node.itemSpacing,
      alignment: mapAlignment(node.primaryAxisAlignItems, node.counterAxisAlignItems),
    },
  };
}

function buildModifier(node: FigmaNode): string {
  const parts: string[] = [];
  
  // Position
  if (node.x !== 0 || node.y !== 0) {
    parts.push(`offset(x = ${node.x}.dp, y = ${node.y}.dp)`);
  }
  
  // Size
  parts.push(`size(width = ${node.width}.dp, height = ${node.height}.dp)`);
  
  return parts.join('\n        .');
}

function mapTextAlign(align?: string): string {
  switch (align) {
    case 'CENTER': return 'TextAlign.Center';
    case 'RIGHT': return 'TextAlign.End';
    case 'JUSTIFIED': return 'TextAlign.Justify';
    default: return 'TextAlign.Start';
  }
}

function mapAlignment(primary?: string, counter?: string): string {
  // Simplified alignment mapping
  if (primary === 'CENTER' && counter === 'CENTER') {
    return 'Alignment.Center';
  }
  return 'Alignment.TopStart';
}

// Code Generator
function generateImports(): string {
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

function generateComponent(component: GlanceComponent, indentLevel: number): string {
  const indent = '    '.repeat(indentLevel);
  const nextIndent = '    '.repeat(indentLevel + 1);
  
  let code = '';
  
  switch (component.type) {
    case 'Box':
      code += generateBox(component, indent, nextIndent);
      break;
    case 'Column':
      code += generateColumn(component, indent, nextIndent);
      break;
    case 'Row':
      code += generateRow(component, indent, nextIndent);
      break;
    case 'Text':
      code += generateText(component, indent);
      break;
    default:
      code += `${indent}// Unsupported component type: ${component.type}\n`;
  }
  
  return code;
}

function generateBox(component: GlanceComponent, indent: string, nextIndent: string): string {
  let code = `${indent}Box(\n`;
  code += `${nextIndent}modifier = Modifier\n`;
  
  if (component.modifier) {
    code += `${nextIndent}    .${component.modifier}\n`;
  }
  
  if (component.properties.backgroundColor) {
    code += `${nextIndent}    .background(${component.properties.backgroundColor})\n`;
  }
  
  code += `${nextIndent}\n`;
  
  if (component.children && component.children.length > 0) {
    code += `${nextIndent}) {\n`;
    for (const child of component.children) {
      code += generateComponent(child, component.children!.indexOf(child) + 2);
    }
    code += `${nextIndent}}\n`;
  } else {
    code += `${nextIndent}) {}\n`;
  }
  
  return code;
}

function generateColumn(component: GlanceComponent, indent: string, nextIndent: string): string {
  let code = `${indent}Column(\n`;
  code += `${nextIndent}modifier = Modifier\n`;
  
  if (component.modifier) {
    code += `${nextIndent}    .${component.modifier}\n`;
  }
  
  if (component.properties.spacing) {
    code += `${nextIndent}    .padding(${component.properties.spacing}.dp)\n`;
  }
  
  code += `${nextIndent}\n`;
  
  if (component.children && component.children.length > 0) {
    code += `${nextIndent}) {\n`;
    for (const child of component.children) {
      code += generateComponent(child, component.children!.indexOf(child) + 2);
    }
    code += `${nextIndent}}\n`;
  } else {
    code += `${nextIndent}) {}\n`;
  }
  
  return code;
}

function generateRow(component: GlanceComponent, indent: string, nextIndent: string): string {
  let code = `${indent}Row(\n`;
  code += `${nextIndent}modifier = Modifier\n`;
  
  if (component.modifier) {
    code += `${nextIndent}    .${component.modifier}\n`;
  }
  
  if (component.properties.spacing) {
    code += `${nextIndent}    .padding(${component.properties.spacing}.dp)\n`;
  }
  
  code += `${nextIndent}\n`;
  
  if (component.children && component.children.length > 0) {
    code += `${nextIndent}) {\n`;
    for (const child of component.children) {
      code += generateComponent(child, component.children!.indexOf(child) + 2);
    }
    code += `${nextIndent}}\n`;
  } else {
    code += `${nextIndent}) {}\n`;
  }
  
  return code;
}

function generateText(component: GlanceComponent, indent: string): string {
  let code = `${indent}Text(\n`;
  code += `${indent}    text = "${component.properties.text || ''}",\n`;
  
  if (component.properties.fontSize) {
    code += `${indent}    fontSize = ${component.properties.fontSize}.sp,\n`;
  }
  
  if (component.properties.textAlign) {
    code += `${indent}    textAlign = ${component.properties.textAlign},\n`;
  }
  
  code += `${indent}    modifier = Modifier\n`;
  
  if (component.modifier) {
    code += `${indent}        .${component.modifier}\n`;
  }
  
  code += `${indent})\n`;
  
  return code;
}

// Main Pipeline Function
async function runPipeline(): Promise<void> {
  console.log("🚀 Pipeline started");
  
  try {
    // Get current selection
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("Please select some nodes to convert");
      figma.closePlugin();
      return;
    }

    // Stage 1: Extract Figma Nodes
    const nodes: FigmaNode[] = [];
    for (const node of selection) {
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

    // Stage 2: Mapping - Transform Figma to Glance
    const components: GlanceComponent[] = [];
    for (const node of nodes) {
      const component = mapNodeToComponent(node);
      if (component) {
        components.push(component);
      }
    }

    // Stage 3: Generate Code
    let code = generateImports();
    code += '\n\n';
    code += '@Composable\nfun GeneratedFromFigma() {\n';
    
    for (const component of components) {
      code += generateComponent(component, 1);
    }
    
    code += '}';

    // Stage 4: Output
    figma.showUI(__html__, { width: 600, height: 500 });
    figma.ui.postMessage({ type: 'code', code });
    
    // Set up message handling
    figma.ui.onmessage = (msg) => {
      if (msg.type === 'close') {
        figma.closePlugin();
      }
    };

    console.log("✅ Pipeline finished successfully");
    
  } catch (error) {
    console.error("❌ Pipeline failed:", error);
    figma.notify(`Pipeline error: ${error}`);
    figma.closePlugin();
  }
}