import mdItContainer from 'markdown-it-container';

const INLINE_TOKEN_TYPE = 'inline';
const DEFAULT_BLOCK_ALT_RULES = ['paragraph', 'reference', 'blockquote', 'list'];

export function collectContainerSource(tokens, startIndex, closeType) {
    let source = '';
    for (let index = startIndex + 1; index < tokens.length; index++) {
        const token = tokens[index];
        if (!token || token.type === closeType) {
            break;
        }
        // 聚合容器内容并把中间 token 降级为 inline，避免被 markdown-it 重复渲染。
        source += token.content;
        if (token.block && token.nesting <= 0) {
            source += '\n';
        }
        token.tag = '';
        token.type = INLINE_TOKEN_TYPE;
        token.children = [];
    }
    return source;
}

export function registerSimpleContainerPlugin(md, pluginKeyword, renderOpen, renderClose = '') {
    const closeType = `container_${pluginKeyword}_close`;
    md.use(mdItContainer, pluginKeyword, {
        anyClass: true,
        validate: (info) => info.trim() === pluginKeyword,
        render: (tokens, idx) => {
            const token = tokens[idx];
            if (token.nesting === 1) {
                const source = collectContainerSource(tokens, idx, closeType);
                return renderOpen(source);
            }
            return renderClose;
        }
    });
}

export function registerInlinePrefixBlockPlugin(md, options) {
    const { tag, ruleName, containerClass } = options;
    const inlineRule = (state, startLine) => {
        const lineStart = state.bMarks[startLine] + state.tShift[startLine];
        const lineEnd = state.eMarks[startLine];
        if (lineStart >= lineEnd) {
            return false;
        }
        const lineContent = state.src.substring(lineStart, lineEnd);
        if (!lineContent.startsWith(tag)) {
            return false;
        }
        // 把前缀行转换为自定义 token，后续交给 renderer 输出对应容器。
        const token = state.push(ruleName, 'div', -1);
        token.markup = tag;
        token.content = lineContent.replaceAll(tag, '');
        state.line = startLine + 1;
        return true;
    };

    md.block.ruler.after('blockquote', tag, inlineRule, {
        alt: DEFAULT_BLOCK_ALT_RULES
    });
    md.renderer.rules[ruleName] = (tokens, idx) => {
        const token = tokens[idx];
        return `<div class="${containerClass}">${token.content}</div>`;
    };
}
