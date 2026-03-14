
import { registerSimpleContainerPlugin } from './plugin_helpers';

const pluginKeyword = 'swiper';

export function swiperPlugin(md) {
    registerSimpleContainerPlugin(md, pluginKeyword, render);
    return md;
}

function render(code) {
    return code;
}
