import { registerInlinePrefixBlockPlugin } from './plugin_helpers';

const TAG = 'excel:';
const RULE_NAME = 'excel';

export function excelPlugin(md) {
    registerInlinePrefixBlockPlugin(md, {
        tag: TAG,
        ruleName: RULE_NAME,
        containerClass: 'excel-container'
    });
}
