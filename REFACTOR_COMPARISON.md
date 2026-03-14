# src 目录重构对比说明

## 重构目标

在保持功能不变的前提下，降低重复代码、收敛插件实现模式、统一命名并提升可读性与可维护性。

## 重构前问题

1. `plugin_flowchart.js`、`plugin_katex.js`、`plugin_mermaid.js`、`plugin_swiper.js` 都包含近似的容器解析与 token 清洗逻辑，重复度高。
2. `plugin_excel.js` 与 `plugin_qrcode.js` 的前缀行解析逻辑几乎一致，维护成本高。
3. `markdown.js` 中 `hljs.registerLanguage(...)` 采用大量重复语句，扩展时易漏改。
4. `plugin_katex.js` 中 `ketexRender` 命名存在拼写歧义，可读性一般。

## 重构后改进点

### 1) 抽象容器插件模板方法

- 新增 `src/plugins/plugin_helpers.js`：
  - `registerSimpleContainerPlugin`：统一 markdown-it 容器类插件注册流程。
  - `collectContainerSource`：统一 token 聚合与清洗逻辑。
- 应用到以下插件：
  - `plugin_flowchart.js`
  - `plugin_katex.js`
  - `plugin_mermaid.js`
  - `plugin_swiper.js`

### 2) 抽象前缀块插件模板方法

- 在 `plugin_helpers.js` 新增 `registerInlinePrefixBlockPlugin`：
  - 统一 `excel:` / `qrcode:` 等前缀块语法解析。
- 应用到：
  - `plugin_excel.js`
  - `plugin_qrcode.js`

### 3) 统一高亮语言注册结构

- 将 `markdown.js` 中离散的多行 `hljs.registerLanguage` 改为 `HIGHLIGHT_LANGUAGES` 配置数组 + 遍历注册。
- 降低样板代码，新增语言时只需要维护一个列表项。

### 4) 命名优化与兼容

- `plugin_katex.js` 将 `ketexRender` 规范为 `katexRender`。
- 为避免外部潜在调用中断，保留 `ketexRender` 作为兼容别名导出。

### 5) 可读性补充

- 在 `plugin_helpers.js` 增加关键流程注释，说明 token 清洗与自定义 token 生成意图，便于后续维护。

### 6) Eventable 命名与现代化语法统一

- `src/Eventable.js` 保持 PascalCase 文件名，和导出的类式 mixin 语义一致。
- `Eventable` 维持 mixin 工厂模式，但将匿名 `class extends Base` 明确为具名 `class EventableMixin extends Base`，提升调试可读性。
- 事件别名方法改为 `...args` 透传，替代 `apply + arguments` 的早期写法，行为保持一致。
- 属性访问从 `param['type']` 统一为 `param.type`，增强可读性。
- 引用路径保持不变：`import Eventable from './Eventable'`，避免大小写不一致在 Linux 环境触发路径问题。

## 功能一致性说明

1. 插件注册顺序保持不变，渲染链路未改变。
2. 容器类插件输出结构保持一致：
   - flowchart: 仍输出 `flowchart-container` + `flowchart-code` + `flowchart`。
   - katex: 仍使用 `katex.renderToString(..., { throwOnError: false })`。
   - mermaid: 仍输出外层 `mermaid-container` 与内部 `mermaid` 结构。
   - swiper: 仍透传代码文本。
3. 前缀块插件输出结构保持一致：
   - `excel:` -> `excel-container`
   - `qrcode:` -> `qrcode-container`
4. Eventable 事件流保持一致：
   - `on / off / once / fire` 的触发与注销行为不变。
   - `addEventListener / removeEventListener` 仍是别名入口。
   - `_setEventParent` 后 `fire` 仍优先委托父事件对象。

## 质量与验证

- 已执行：
  - `npm run lint`
  - `npm test`
  - `npm run build`
- 结果：全部通过，无新增诊断错误。

## 性能影响评估

1. 运行时性能：核心渲染流程与算法复杂度未变，预期无显著运行时差异。
2. 构建与体积：本次主要为结构性重构与重复逻辑收敛，未引入重依赖；构建结果正常，未观察到负向影响。
3. 维护性能：重复代码显著下降，后续新增同类插件的开发和修改成本更低，回归风险更可控。
