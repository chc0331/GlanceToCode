1) 전체 아키텍트 개요

Figma (Nodes)
   │
   ▼
[Plugin Sandbox (code.ts)]
   │
   │  ① Figma Node Tree 분석
   │  ② Node → Intermediate Model 변환
   │  ③ Model → Glance Code 변환
   │
   ▼
[UI (ui.html / ui.ts)]
   │
   │  ④ 코드 미리보기 / 복사 / 설정 조정
   ▼
사용자

2) 주요 모듈

| 모듈                             | 역할                                  | 구현 파일                             |
| ------------------------------ | ----------------------------------- | --------------------------------- |
| **Plugin Core (code.ts)**      | Figma 문서 접근, 노드 파싱, 변환 호출           | `src/code.ts`                     |
| **UI Panel (ui.html + ui.ts)** | 사용자와 상호작용 (버튼, 결과 미리보기 등)           | `src/ui.html`, `src/ui.ts`        |
| **Parser Layer**               | Figma 노드를 중간 모델로 변환                 | `src/core/parser/FigmaParser.ts`  |
| **Mapper Layer**               | 중간 모델 → Glance Code 변환              | `src/core/mapper/GlanceMapper.ts` |
| **Model Layer**                | 중간 표현 (e.g. View, Text, Image 등) 정의 | `src/core/model/WidgetNode.ts`    |
| **Utils Layer**                | 문자열 포매팅, 코드 인덴트 처리 등                | `src/core/utils/format.ts`        |


3) 아키텍처 설계 포인트
| 포인트                                 | 이유                               |
| ----------------------------------- | -------------------------------- |
| **계층 분리 (Parser/Mapper/Model)**     | 디자인 → 코드 변환 로직을 재사용, 테스트 가능하게 만듦 |
| **TypeScript Class 기반 구조**          | Node 타입과 Glance 요소 매핑을 명확히 관리    |
| **Intermediate Representation(IR)** | 나중에 Compose, XML 등 다른 코드로 확장 가능  |
| **UI와 Logic 분리**                    | 유지보수성 향상 및 단위 테스트 용이             |

