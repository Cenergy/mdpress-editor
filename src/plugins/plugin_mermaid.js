
import { registerSimpleContainerPlugin } from './plugin_helpers';

const pluginKeyword = 'mermaid';

export function mermaidPlugin(md) {
    registerSimpleContainerPlugin(
        md,
        pluginKeyword,
        (source) => `<div class="${pluginKeyword}-container">${render(preProcess(source))}`,
        '</div>'
    );
    return md;
}

function render(code) {
    return `
   <div class="mermaid">
     ${code}
   </div>
   `;
}

export const mermaidRender = render;

function preProcess(source) {
    return source
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n+$/, '')
        .trimStart();
}
