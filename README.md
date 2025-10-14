1) 전체 아키텍트 개요

<img width="600" height="1000" alt="image" src="https://github.com/user-attachments/assets/39ff64ff-6241-49ac-9bec-f056f24c7842" />


[ Figma GUI Design ]
          |
          v
[ Figma Plugin ]
          |
          +--> Node Extractor
          |       - 선택된 Frame / Component / Group
          |       - 위치, 크기, 색상, 텍스트, 아이콘 정보
          |
          +--> Mapping Engine
          |       - Figma Node → Glance Component 매핑
          |       - 속성 변환 (예: px → dp, 색상, 글꼴)
          |
          +--> Code Generator
          |       - Glance DSL 코드 생성
          |       - 템플릿 기반 코드 출력
          |
          v
[ Clipboard / File Export ]
          |
          v
[ Android Studio / AppWidget Project ]

-------------------------------------------------------------------------------------

2. 주요 컴포넌트 설명
① Node Extractor (Figma API 활용)

   1-1) 기능
      - 사용자가 선택한 노드(Frame, Group, Component) 분석
      - 위치(x, y), 크기(width, height)
      - 색상, 텍스트, 아이콘, 이미지 정보
      - AutoLayout 속성, padding, alignment

   1-2) 기술
      - Figma Plugin API (TypeScript 기반)
      - figma.currentPage.selection 으로 선택 노드 추출
      - 노드 속성 JSON으로 직렬화

② Mapping Engine (Rule 기반 or AI 기반)

   2-1) 기능
      - Figma 노드를 Jetpack Glance 구성요소로 변환
      - 예: Frame → Column / Row / Box, Text → Text, Rectangle → Box + background
      - 속성 매핑: px → dp, color 변환, font style 변환

   2-2) 방식
      - Rule-based Mapping (단순, 안정적)
         - 사전에 정의된 Figma Node → Glance 매핑 테이블 사용
         - 장점: 예측 가능, 디버깅 쉬움
         - 단점: 복잡한 레이아웃 처리 어려움

      - AI-based Mapping (ML 모델 활용)
         - Figma 노드 구조 → Glance 코드 변환 모델 학습
         - 장점: 자유로운 레이아웃 처리 가능
         - 단점: 학습 데이터 필요, 예측 불확실성 존재

③ Code Generator
      3-1) 기능
         - Mapping Engine 결과 → Kotlin Glance 코드로 변환
         - 코드 포맷팅, 들여쓰기, import 처리
         - 재사용 가능한 Composable 함수 생성

      3-2) 기술
         - 템플릿 엔진 사용 가능 (e.g., Mustache, Handlebars)
         - JSON → Kotlin DSL 코드 변환

④ Output
      4-1) 기능
         - 코드 클립보드 복사
         - Android Studio에서 바로 붙여넣기 가능

※※※ 개발 로드맵 ※※※
   
   Phase 1 – PoC
      - 단순 Frame + Text + Rectangle 변환
      - Rule-based Mapping
      - Clipboard로 코드 복사 가능

   Phase 2 – 확장
      - AutoLayout, 이미지, 아이콘 처리
      - Box/Row/Column 구조 자동 매핑
      - 코드 포맷팅 개선

   Phase 3 – AI 변환 (선택)
      - 복잡한 레이아웃, 조건부 구성 처리
      - Pix2Struct 또는 LLM 활용 가능



📁 pipeline/
├── types.ts                    # 공통 타입 정의
├── pipeline_runner.ts          # 파이프라인 실행기
└── stages/
    ├── node_extractor.ts       # Stage 1: Figma 노드 추출
    ├── mapping_engine.ts       # Stage 2: Figma → Glance 매핑
    ├── code_generator.ts       # Stage 3: 코드 생성
    └── output_stage.ts         # Stage 4: 결과 출력


🔄 Pipeline Flow
Node Extractor: Figma 선택된 노드들을 분석하여 구조화된 데이터로 추출
Mapping Engine: Figma 노드를 Jetpack Glance 컴포넌트로 변환
Code Generator: Glance 컴포넌트를 실제 Kotlin 코드로 생성
Output Stage: UI에 결과 표시 및 사용자 인터랙션 처리


# Figma Node <-> Glance Node

## 🧱 1. Jetpack Glance 지원 레이아웃 / 컴포넌트

| Glance 컴포저블 / 레이아웃 | 역할 / 특성 | 비고 / 제약 |
|---|---|---|
| `Column` | 수직 배치 (vertical stacking) | 자식 뷰들을 위→아래 순으로 배치 |
| `Row` | 수평 배치 (horizontal stacking) | 자식 뷰들을 왼쪽→오른쪽 순으로 배치 |
| `Box` | 겹침 / 포개기 | 내부 요소를 겹치거나 정렬 제어 가능 |
| `Spacer` | 빈 공간 삽입 | 레이아웃 간격 조절용 |
| `LazyColumn` | 스크롤 가능한 리스트 | 반복 항목 처리용 |
| `Text` | 텍스트 출력 | 폰트, 크기, 색상 등 제한 있음 |
| `Image` | 이미지 출력 | 리소스 또는 URL 가능 |
| `Button` | 클릭 가능한 버튼 | 클릭 액션 정의 필요 |
| `LinearProgressIndicator` | 선형 진행 표시기 | 진행 상태 표현 |
| `CircularProgressIndicator` | 원형 진행 표시기 | 진행 상태 표현 |

---

## 🧩 2. Figma 노드 타입

| Figma 노드 타입 | 역할 / 설명 | 주요 속성 / 특징 |
|---|---|---|
| `FrameNode` | 레이아웃 컨테이너 | auto-layout 속성 지원, 자식 포함 |
| `GroupNode` | 단순 그룹화 | 레이아웃 속성 없음 |
| `ComponentNode` | 컴포넌트 정의 | 재사용 가능한 UI 블록 |
| `InstanceNode` | Component 인스턴스 | master 속성 상속 |
| `RectangleNode` | 사각형 도형 | 배경, 카드 등 표현 |
| `EllipseNode` | 원형 / 타원 도형 | 원형 영역 표현 |
| `TextNode` | 텍스트 요소 | 폰트, 정렬, 색상, 내용 |
| `VectorNode` | 벡터 아이콘 / 일러스트 | SVG 기반 그래픽 |
| `LineNode` | 선 요소 | 구분선, Divider 용도 |
| `ComponentSetNode` | Variants 집합 | 상태별 컴포넌트 집합 |

---

## 🔁 3. Figma → Jetpack Glance 매핑

| Figma 노드 / 구성 패턴 | 대응 Glance 컴포저블 / 레이아웃 | 비고 / 처리 방식 |
|---|---|---|
| FrameNode (Auto-layout: Vertical) | `Column` | spacing 속성 → `verticalArrangement` |
| FrameNode (Auto-layout: Horizontal) | `Row` | spacing 속성 → `horizontalArrangement` |
| FrameNode (Absolute position) | `Box` | 겹치는 요소 배치 |
| Nested Frame 구조 | 중첩된 `Column` / `Row` / `Box` | 복합 배치 구성 |
| RectangleNode | `Box` + 배경 색상 | 배경 박스 or 카드 표현 |
| TextNode | `Text` | 텍스트 내용 및 스타일 변환 |
| ImageNode / VectorNode | `Image` | 리소스 참조 or URL |
| 간격용 Frame / Spacer | `Spacer` | auto-layout gap 변환 |
| 버튼 디자인 (사각형 + 텍스트/아이콘) | `Button` 내부에 `Text` / `Image` | onClick 액션 연결 |
| 반복 Frame 구조 | `LazyColumn` + `items {}` | 반복 패턴 감지 |
| 복잡한 아이콘 / 벡터 그래픽 | `Image` or `VectorDrawable` | SVG → Android Vector 변환 |
