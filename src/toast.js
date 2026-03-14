
import miniToastr from 'mini-toastr';

let isMiniToastrInitialized = false;

export function initToastr() {
    if (!isMiniToastrInitialized) {
        miniToastr.init({
            appendTarget: document.body
        });
        isMiniToastrInitialized = true;
    }
}

export function getToastr() {
    return miniToastr;
}
