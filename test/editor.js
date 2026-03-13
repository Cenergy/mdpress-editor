import { MDEditor } from "../index.js";
import * as mdpress from "../index.js";
import editorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import tsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import "highlight.js/styles/atom-one-dark.min.css";
import "katex/dist/katex.min.css";
import "viewerjs/dist/viewer.min.css";
import "swiper/css/bundle";
import "x-data-spreadsheet/dist/xspreadsheet.css";
// import "mdpress-monaco-editor/dist/mdpress-monaco-editor.css";
import "../index.css";

// Monaco Environment Setup
const workers = {
  json: jsonWorker,
  css: cssWorker,
  scss: cssWorker,
  less: cssWorker,
  html: htmlWorker,
  handlebars: htmlWorker,
  razor: htmlWorker,
  typescript: tsWorker,
  javascript: tsWorker,
};

let isMonacoInitialized = false;

function initMonacoEnv() {
  if (isMonacoInitialized) return;

  self.MonacoEnvironment = {
    getWorker(_, label) {
      return new (workers[label] || editorWorker)();
    },
  };

  // Mount mdpress to window for compatibility if needed elsewhere
  window.mdpress = mdpress;
  isMonacoInitialized = true;
}

let mdEditor = null;

export function getEditor() {
  return mdEditor;
}

export function destroyEditor() {
  if (mdEditor) {
    if (typeof mdEditor.dispose === "function") {
      mdEditor.dispose();
    }
    mdEditor = null;
  }
}

export function loadMonaco(callback) {
  initMonacoEnv();
  if (callback) callback();
}

export function createEditor(selector, config, callback) {
  if (getEditor()) {
    if (callback) callback();
    return getEditor();
  }

  initMonacoEnv();

  const theme = config.theme || "serene-rose";

  mdEditor = new MDEditor(selector, {
    theme: theme,
    monacoOptions: config.monacoOptions || {
    //   minimap: { enabled: false },
    },
  });

  // Event listeners
  const LEFT_NAV_FLOAT = "left-nav-float";
  const ANIMATION_FADEINLEFT = "animate__fadeInLeft";

  mdEditor.on("closefullscreen", function () {
    const leftNav = config.getLeftNav ? config.getLeftNav() : null;
    if (leftNav) {
      const classList = leftNav.classList;
      classList.remove(LEFT_NAV_FLOAT);
      classList.remove(ANIMATION_FADEINLEFT);
    }
  });

  // Paste handler
  mdEditor.on("paste", function (e) {
    const files = e.clipboardData.files || [];
    if (files.length > 0) {
      Array.from(files).forEach((file) => {
        if (file.size > 20 * 1024 * 1024) {
          if (config.warn) config.warn(`文件 ${file.name} 超过 20M，跳过上传`);
          return;
        }
        if (config.uploadFile) {
          config.uploadFile(file, (url) => {
            // Insert markdown image or link
            const isImage = file.type.startsWith("image/");
            const text = isImage
              ? `![${file.name}](${url})`
              : `[${file.name}](${url})`;

            const range = mdEditor.getCurrentRange()[0];
            mdEditor.editor.executeEdits("", [
              { range: range, text: "\n" + text + "\n" },
            ]);
          });
        }
      });
    }
  });

  addToolicons(config);

  if (callback) callback();
  return mdEditor;
}

function addToolicons(config) {
  const className = "majoricon";
  const icons = [
    {
      icon: "icon-zhankaicaidan",
      title: "打开左侧侧边栏",
      className: className,
      position: "right",
    },
    {
      icon: "icon-file-markdown1",
      title: "导入markdown",
      className: className,
    },
    {
      icon: "icon-fujian1",
      title: "托管附件",
      className: className,
      position: "right",
    },
    {
      icon: "icon-baocun1",
      title: "保存文档",
      className: className,
      position: "right",
    },
  ].map((opts) => new mdpress.ToolIcon(opts));

  icons.forEach((icon) => icon.addTo(mdEditor));

  const LEFT_NAV_FLOAT = "left-nav-float";
  const ANIMATION_FADEINLEFT = "animate__fadeInLeft";

  icons[0].on("click", function () {
    if (mdEditor.isFullScreen()) {
      const leftNav = config.getLeftNav ? config.getLeftNav() : null;
      if (leftNav) {
        const classList = leftNav.classList;
        if (classList.contains(LEFT_NAV_FLOAT)) {
          classList.remove(LEFT_NAV_FLOAT);
          classList.remove(ANIMATION_FADEINLEFT);
        } else {
          classList.add(LEFT_NAV_FLOAT);
          classList.add(ANIMATION_FADEINLEFT);
        }
      }
    } else {
      if (config.info) config.info("当编辑器全屏时才可以进行该操作");
    }
  });

  icons[1].on("click", () => {
    if (config.importMd) config.importMd();
  });
  icons[2].on("click", () => {
    if (config.openUploadPanel) config.openUploadPanel();
  });
  icons[3].on("click", () => {
    if (config.saveDoc) config.saveDoc();
  });
}
