import { createDom, on } from '../util';

export function scrollTop(dom, container, callback) {
    const parent = container || dom;
    if (parent.querySelector('.mdeditor-scrolltop')) {
        return;
    }
    const el = createDom('div');
    el.className = 'mdeditor-scrolltop';
    el.innerHTML = '<i class="iconfont icon-huidaodingbu"></i>';
    parent.appendChild(el);
    on(el, 'click', () => {
        if (callback) {
            callback();
            return;
        }
        dom.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    });
}
