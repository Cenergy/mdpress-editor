import { ensureMermaid, getMermaid } from '../deps';
import { getToastr } from '../toast';

let hasShownMermaidError = false;

export function initMermaid(dom) {
    const els = dom.querySelectorAll('.mermaid');
    if (!els.length) {
        return;
    }
    const mermaid = getMermaid();
    if (!mermaid || typeof mermaid.initialize !== 'function' || typeof mermaid.run !== 'function') {
        ensureMermaid().then(() => {
            const loadedMermaid = getMermaid();
            if (!loadedMermaid || typeof loadedMermaid.initialize !== 'function' || typeof loadedMermaid.run !== 'function') {
                if (!hasShownMermaidError) {
                    hasShownMermaidError = true;
                    console.error('not find mermaid,please registerMermaid');
                    getToastr().error('not find mermaid,please registerMermaid');
                }
                return;
            }
            hasShownMermaidError = false;
            initMermaid(dom);
        }).catch((err) => {
            if (!hasShownMermaidError) {
                hasShownMermaidError = true;
                console.error(err);
                getToastr().error('not find mermaid,please registerMermaid');
            }
        });
        return;
    }
    hasShownMermaidError = false;
    mermaid.initialize({ startOnLoad: false });
    const notInit = [];
    for (let i = 0, len = els.length; i < len; i++) {
        const dataset = els[i].dataset;
        if (!dataset.processed) {
            notInit.push(1);
        }
    }
    if (notInit.length) {
        mermaid.run({
            nodes: els
        });
    }
}
