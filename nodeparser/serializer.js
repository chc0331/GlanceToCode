// Convert FigmaBaseNode instances to plain serializable objects
export function toPlain(node) {
    const base = {
        id: node.id,
        name: node.name,
        visible: node.visible,
        width: node.width,
        height: node.height,
        x: node.x,
        y: node.y,
    };
    if (node.children) {
        base.children = node.children.map((c) => toPlain(c));
    }
    // include subclass-specific properties if present
    if (node.backgroundColor)
        base.backgroundColor = node.backgroundColor;
    if (node.fillColor)
        base.fillColor = node.fillColor;
    if (node.text)
        base.text = node.text;
    if (node.fontSize)
        base.fontSize = node.fontSize;
    if (node.color)
        base.color = node.color;
    if (node.imageUrl)
        base.imageUrl = node.imageUrl;
    return base;
}
export function serializeNodesToJSON(nodes, pretty = true) {
    const plain = nodes.map((n) => toPlain(n));
    return pretty ? JSON.stringify(plain, null, 2) : JSON.stringify(plain);
}
export function postParsedTreeToUI(json) {
    try {
        if (typeof figma !== 'undefined' && figma.ui) {
            figma.ui.postMessage({ type: 'parsedTree', json });
        }
    }
    catch (e) {
        // ignore in non-plugin environments
    }
}
