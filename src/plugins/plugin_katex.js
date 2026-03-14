
import katex from 'katex';
import { registerSimpleContainerPlugin } from './plugin_helpers';

const pluginKeyword = 'katex';

export function katexPlugin(md) {
    registerSimpleContainerPlugin(md, pluginKeyword, render);
    return md;
}

function render(code) {
    const html = katex.renderToString(code, {
        throwOnError: false
    });
    return `
     <div class="katex-container">

     ${html}

     </div>
   `;
}

export const katexRender = (code) => {
    const html = katex.renderToString(code, {
        throwOnError: false
    });
    return html;
};

export const ketexRender = katexRender;
