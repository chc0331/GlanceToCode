// Design to Code Plugin - Pipeline Architecture
// Converts Figma designs to Jetpack Glance code

// ======================================================
// run_pipeline.ts
// 역할: 파이프라인의 오케스트레이터 역할을 합니다.
// 1) 현재 선택된 Figma 노드를 추출(extract)
// 2) 추출한 중간 표현을 Glance 컴포넌트로 매핑(map)
// 3) 매핑 결과로부터 최종 코드를 생성(generate)
// 4) UI에 결과를 출력 및 메시지 처리
// (비즈니스 로직은 extract/map/generate에 위임되어 이 파일은 흐름 제어만 담당)
// ======================================================
import { FigmaNode, GlanceComponent } from './types';
import { extractNode } from './extract';
import { mapNodeToComponent } from './map';
import { generateImports, generateComponent } from './generate';

// Main Pipeline Function
export async function runPipeline(): Promise<void> {
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