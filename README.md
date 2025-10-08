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
