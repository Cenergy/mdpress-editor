
import { registerSimpleContainerPlugin } from './plugin_helpers';

const pluginKeyword = 'flowchart';

export function flowChartPlugin(md) {
    registerSimpleContainerPlugin(md, pluginKeyword, render);
    return md;
}

function render(code) {
    return `<div class="flowchart-container">
       <div class="flowchart-code" style="display:none;">${code}</div>
       <div class="flowchart"></div>
    </div>`;
}
