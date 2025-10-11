export function generateImports() {
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
export function generateComponent(component, indentLevel) {
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
