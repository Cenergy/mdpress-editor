import { getToastr } from '../toast';
import { getQRCode } from '../deps';

export function initQRCode(dom) {
    const els = dom.querySelectorAll('.qrcode-container');
    if (!els.length) {
        return [];
    }
    const QRCode = getQRCode();
    if (!QRCode) {
        const message = 'not find QRCode,please registerQRCode';
        console.error(message);
        getToastr().error(message);
        return [];
    }
    const swipers = [];
    // console.log(Swiper);
    els.forEach(el => {
        if (el.dataset.inited) {
            return;
        }
        const text = el.textContent;
        el.innerHTML = '';
        // console.log(text);
        const canvas = document.createElement('canvas');
        el.appendChild(canvas);
        QRCode.toCanvas(canvas, text, {
            width: 128,
            margin: 0,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'H'
        }, function (error) {
            if (error) console.error(error);
        });

        el.dataset.inited = 'true';
        swipers.push(canvas);
    });
    return swipers;
}
