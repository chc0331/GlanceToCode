"use strict";
// Design to Code Plugin - Pipeline Architecture
// Converts Figma designs to Jetpack Glance code
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Node Extractor
function extractNode(node) {
    const baseNode = {
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
        baseNode.fills = node.fills;
    }
    // Extract text properties
    if (node.type === 'TEXT') {
        const textNode = node;
        baseNode.characters = textNode.characters;
        baseNode.fontSize = textNode.fontSize;
        baseNode.fontName = textNode.fontName;
        baseNode.textAlignHorizontal = textNode.textAlignHorizontal;
        baseNode.textAlignVertical = textNode.textAlignVertical;
    }
    // Extract layout properties for frames/components
    if (node.type === 'FRAME' || node.type === 'COMPONENT' || node.type === 'INSTANCE') {
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
    // Extract children recursively
    if ('children' in node && node.children) {
        baseNode.children = node.children
            .map(child => extractNode(child))
            .filter((child) => child !== null);
    }
    return baseNode;
}
// Mapping Engine
function mapNodeToComponent(node) {
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
function mapRectangleToBox(node) {
    const modifier = buildModifier(node);
    // Extract background color
    let backgroundColor = '';
    if (node.fills && node.fills.length > 0) {
        const solid = node.fills.find((p) => p.type === 'SOLID');
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
function mapTextToText(node) {
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
function mapFrameToContainer(node) {
    const modifier = buildModifier(node);
    // Determine container type based on layout mode
    let containerType = 'Box';
    if (node.layoutMode === 'VERTICAL') {
        containerType = 'Column';
    }
    else if (node.layoutMode === 'HORIZONTAL') {
        containerType = 'Row';
    }
    // Map children
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
                bottom: node.paddingBottom,
            },
            spacing: node.itemSpacing,
            alignment: mapAlignment(node.primaryAxisAlignItems, node.counterAxisAlignItems),
        },
    };
}
function buildModifier(node) {
    const parts = [];
    // Position
    if (node.x !== 0 || node.y !== 0) {
        parts.push(`offset(x = ${node.x}.dp, y = ${node.y}.dp)`);
    }
    // Size
    parts.push(`size(width = ${node.width}.dp, height = ${node.height}.dp)`);
    return parts.join('\n        .');
}
function mapTextAlign(align) {
    switch (align) {
        case 'CENTER': return 'TextAlign.Center';
        case 'RIGHT': return 'TextAlign.End';
        case 'JUSTIFIED': return 'TextAlign.Justify';
        default: return 'TextAlign.Start';
    }
}
function mapAlignment(primary, counter) {
    // Simplified alignment mapping
    if (primary === 'CENTER' && counter === 'CENTER') {
        return 'Alignment.Center';
    }
    return 'Alignment.TopStart';
}
// Code Generator
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
function generateBox(component, indent, nextIndent) {
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
            code += generateComponent(child, component.children.indexOf(child) + 2);
        }
        code += `${nextIndent}}\n`;
    }
    else {
        code += `${nextIndent}) {}\n`;
    }
    return code;
}
function generateColumn(component, indent, nextIndent) {
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
            code += generateComponent(child, component.children.indexOf(child) + 2);
        }
        code += `${nextIndent}}\n`;
    }
    else {
        code += `${nextIndent}) {}\n`;
    }
    return code;
}
function generateRow(component, indent, nextIndent) {
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
            code += generateComponent(child, component.children.indexOf(child) + 2);
        }
        code += `${nextIndent}}\n`;
    }
    else {
        code += `${nextIndent}) {}\n`;
    }
    return code;
}
function generateText(component, indent) {
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
function runPipeline() {
    return __awaiter(this, void 0, void 0, function* () {
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
            const nodes = [];
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
            const components = [];
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
        }
        catch (error) {
            console.error("❌ Pipeline failed:", error);
            figma.notify(`Pipeline error: ${error}`);
            figma.closePlugin();
        }
    });
}
// Main plugin entry point
figma.on("run", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield runPipeline();
    }
    catch (error) {
        console.error("Plugin error:", error);
        figma.notify(`Error: ${error}`);
        figma.closePlugin();
    }
}));
