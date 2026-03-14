import { checkIframe } from './preview/iframe';
import { checkLinks } from './preview/link';
// import { initMermaid } from './preview/mermaid';
// import { initQRCode } from './preview/qrcode';

export function domDiff(dom1, dom2, editor) {
    // console.log(dom1.childNodes, dom2.childNodes);
    const childNodes = dom1.childNodes;
    const newChildNodes = dom2.childNodes;
    checkLinks(dom2);
    checkIframe(dom2);
    // initQRCode(dom2);

    const maxLength = Math.max(childNodes.length, newChildNodes.length);
    const diff = {
        add: [],
        remove: [],
        update: []
    };
    for (let i = 0; i < maxLength; i++) {
        const node1 = childNodes[i];
        const node2 = newChildNodes[i];
        if (!node1 && node2) {
            diff.add.push({
                index: i,
                node: node2
            });
        } else if (node1 && !node2) {
            diff.remove.push({
                index: i,
                node: node1
            });
        } else {
            const html1 = node1.outerHTML;
            const html2 = node2.outerHTML;
            if (html1 !== html2) {
                diff.update.push({
                    index: i,
                    node: node1,
                    newNode: node2
                });
            }
        }
    }
    if (editor && editor.options.debug) {
        console.log(diff);
    }
    const { add, remove, update } = diff;
    remove.forEach(({ node }) => {
        dom1.removeChild(node);
    });
    add.forEach(({ node, index }) => {
        dom1.appendChild(node);
    });
    update.forEach(({ node, newNode }) => {
        delete node.inited;
        if (newNode.parentNode) {
            newNode.parentNode.removeChild(newNode);
        }
        dom1.replaceChild(newNode, node);
        // node.outerHTML = newNode.outerHTML;
    });
}
