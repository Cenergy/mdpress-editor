import { registerInlinePrefixBlockPlugin } from './plugin_helpers';

const TAG = 'qrcode:';
const RULE_NAME = 'qrcode';

export function qrCodePlugin(md) {
    registerInlinePrefixBlockPlugin(md, {
        tag: TAG,
        ruleName: RULE_NAME,
        containerClass: 'qrcode-container'
    });
}
