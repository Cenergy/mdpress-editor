
function getDataLineNumber(node) {
    return parseInt(node.getAttribute('data-line'));
}

export function calScroll(editor, dom) {
    const ranges = editor.getVisibleRanges();
    if (!ranges.length) {
        return;
    }
    const range = ranges[0];
    const { startLineNumber } = range;
    const children = dom.children;
    let target = null;
    let nextTarget = null;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const dataLine = getDataLineNumber(child);
        if (isNaN(dataLine)) {
            continue;
        }
        if (dataLine <= startLineNumber) {
            target = child;
        } else {
            nextTarget = child;
            break;
        }
    }
    if (!target) {
        return 0;
    }
    const targetLine = getDataLineNumber(target);
    let offset = 0;
    if (nextTarget) {
        const nextLine = getDataLineNumber(nextTarget);
        const lineDiff = nextLine - targetLine;
        const heightDiff = nextTarget.offsetTop - target.offsetTop;
        const lineOffset = startLineNumber - targetLine;
        if (lineDiff > 0) {
            offset = (lineOffset / lineDiff) * heightDiff;
        }
    }
    return target.offsetTop + offset - 10; // -10 for padding
}

export function calEditorScroll(dom) {
    const scrollTop = dom.scrollTop;
    const children = dom.children;
    let target = null;
    let nextTarget = null;
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.offsetTop <= scrollTop) {
            target = child;
        } else {
            nextTarget = child;
            break;
        }
    }
    if (!target) {
        return 1;
    }
    const targetLine = getDataLineNumber(target);
    if (isNaN(targetLine)) {
        return;
    }
    let offsetLine = 0;
    if (nextTarget) {
        const nextLine = getDataLineNumber(nextTarget);
        if (!isNaN(nextLine)) {
            const lineDiff = nextLine - targetLine;
            const heightDiff = nextTarget.offsetTop - target.offsetTop;
            const scrollOffset = scrollTop - target.offsetTop;
            if (heightDiff > 0) {
                offsetLine = (scrollOffset / heightDiff) * lineDiff;
            }
        }
    }
    return Math.floor(targetLine + offsetLine);
}
