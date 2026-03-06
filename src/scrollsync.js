
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
        const dataLine = parseInt(child.getAttribute('data-line'));
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
    const targetLine = parseInt(target.getAttribute('data-line'));
    let offset = 0;
    if (nextTarget) {
        const nextLine = parseInt(nextTarget.getAttribute('data-line'));
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
    const targetLine = parseInt(target.getAttribute('data-line'));
    if (isNaN(targetLine)) {
        return;
    }
    let offsetLine = 0;
    if (nextTarget) {
        const nextLine = parseInt(nextTarget.getAttribute('data-line'));
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
