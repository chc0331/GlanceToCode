// ======================================================
// generate.ts
// 역할: 중간 표현인 `GlanceComponent` 리스트를 받아 최종 코드 문자열을 생성합니다.
// - 필요한 import 블럭 생성
// - 컴포넌트 타입별 코드 생성(Box, Column, Row, Text)
// - 들여쓰기와 포맷을 관리하여 최종 Kotlin/Compose 코드 반환
// ======================================================
import { GlanceComponent } from './types';

export function generateImports(): string {
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

export function generateComponent(component: GlanceComponent, indentLevel: number): string {
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
