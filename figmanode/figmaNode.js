/**
 * | 클래스명                               | 역할               | Figma API 대응                                | Glance 변환 용도                       |
| ---------------------------------- | ---------------- | ------------------------------------------- | ---------------------------------- |
| `FigmaNode`                        | 모든 노드의 기본 추상 클래스 | `BaseNode`                                  | 공통 속성(id, name, bounds, visible 등) |
| `FigmaFrameNode`                   | 레이아웃 컨테이너        | `FrameNode`                                 | `Row` / `Column` / `Box` 변환        |
| `FigmaGroupNode`                   | 단순 그룹            | `GroupNode`                                 | 변환 시 생략되거나 병합                      |
| `FigmaComponentNode`               | 컴포넌트 정의          | `ComponentNode`                             | 재사용 가능한 Glance 컴포저블 정의             |
| `FigmaInstanceNode`                | 컴포넌트 인스턴스        | `InstanceNode`                              | 기존 정의된 Glance 컴포저블 호출              |
| `FigmaRectangleNode`               | 사각형 요소           | `RectangleNode`                             | `Box` + `background` modifier      |
| `FigmaEllipseNode`                 | 원형 요소            | `EllipseNode`                               | `Box` + `shape = CircleShape` 등    |
| `FigmaTextNode`                    | 텍스트 요소           | `TextNode`                                  | `Text()`                           |
| `FigmaImageNode`                   | 이미지 요소           | `VectorNode` / `RectangleNode` + fill=image | `Image()`                          |
| `FigmaLineNode`                    | 선 요소             | `LineNode`                                  | `Spacer(height=1.dp)` or `Divider` |
| *(선택)* `FigmaBooleanOperationNode` | 도형 합성            | `BooleanOperationNode`                      | 벡터 머징 or 무시                        |
| *(선택)* `FigmaComponentSetNode`     | Variants 집합      | `ComponentSetNode`                          | 여러 상태 컴포넌트 관리                      |
 *
 *
 *
 */
/**
 * | **Figma Node Type**  | **역할**         | **Glance 매핑 대상**           | **비고**                 |
| -------------------- | -------------- | -------------------------- | ---------------------- |
| `FigmaNode`          | 기본 추상 타입       | -                          | 공통 속성(id, size, pos 등) |
| `FigmaFrameNode`     | 컨테이너 / 레이아웃    | `Box`, `Row`, `Column`     | layoutMode로 구분         |
| `FigmaRectangleNode` | 사각형 영역, 버튼, 배경 | `Box(modifier=...)`        | 색상, radius, border     |
| `FigmaEllipseNode`   | 원형, 아이콘 배경 등   | `Box(shape = CircleShape)` | `width==height`시 원     |
| `FigmaTextNode`      | 텍스트 표시         | `Text()`                   | 폰트, 색상, 정렬             |
| `FigmaImageNode`     | 이미지            | `Image(provider=...)`      | URL or resourceName    |
 *
 */
export class FigmaBaseNode {
    constructor(id, name, visible, width, height, x, y, children) {
        this.id = id;
        this.name = name;
        this.visible = visible;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.children = children;
    }
}
