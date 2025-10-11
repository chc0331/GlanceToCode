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
import { extractNode } from './extract';
import { mapNodeToComponent } from './map';
import { generateImports, generateComponent } from './generate';
// Main Pipeline Function
export function runPipeline() {
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
