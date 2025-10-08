"use strict";
// Design to Code Plugin - Rectangle to Box converter (TypeScript)
function convertRectangleToBox(rect) {
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const x = Math.round(rect.x);
    const y = Math.round(rect.y);
    let backgroundSnippet = '';
    if (rect.fills && rect.fills !== figma.mixed) {
        const fills = rect.fills;
        const solid = fills.find((p) => p.type === 'SOLID');
        if (solid) {
            const r = Math.round((solid.color.r || 0) * 255);
            const g = Math.round((solid.color.g || 0) * 255);
            const b = Math.round((solid.color.b || 0) * 255);
            backgroundSnippet = `\n        .backgroundColor = Color(${r}, ${g}, ${b})`;
        }
    }
    return `Box(\n    modifier = Modifier\n        .offset(x = ${x}.dp, y = ${y}.dp)\n        .size(width = ${width}.dp, height = ${height}.dp)${backgroundSnippet}\n) {\n}`;
}
function generateCode() {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
        return '// No selection\n// Select a Rectangle to generate Box code';
    }
    const rectangles = selection.filter((n) => n.type === 'RECTANGLE');
    if (rectangles.length === 0) {
        return '// No rectangles selected\n// Select Rectangle nodes to generate Box code';
    }
    let code = '@Composable\nfun GeneratedFromFigma() {\n';
    for (const rect of rectangles) {
        const boxCode = convertRectangleToBox(rect);
        const indented = boxCode.split('\n').map(line => '    ' + line).join('\n');
        code += indented + '\n';
    }
    code += '}';
    return code;
}
figma.showUI(__html__, { width: 500, height: 400 });
figma.ui.postMessage({ type: 'code', code: generateCode() });
figma.ui.onmessage = (msg) => {
    if (msg.type === 'close') {
        figma.closePlugin();
    }
};
