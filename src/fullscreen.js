import { domSizeByWindow } from './util';

const FULL_SCREEN_CLASS = 'mdeditor-fullscreen';

export function checkFullScreen(mdEditor) {
    const container = mdEditor.getContainer();
    container.oldStyle = container.oldStyle || {};
    const oldStyle = container.oldStyle;
    const classList = container.classList;
    if (classList.contains(FULL_SCREEN_CLASS)) {
        classList.remove(FULL_SCREEN_CLASS);
        mdEditor.fullScreen = false;
        for (const key in oldStyle) {
            container.style[key] = oldStyle[key];
        }
        mdEditor.fire('closefullscreen', { fullScreen: mdEditor.fullScreen });
    } else {
        classList.add(FULL_SCREEN_CLASS);
        container.oldStyle = {
            width: container.style.width,
            height: container.style.height
        };
        mdEditor.fullScreen = true;
        domSizeByWindow(container);
        mdEditor.fire('openfullscreen', { fullScreen: mdEditor.fullScreen });
    }
}
