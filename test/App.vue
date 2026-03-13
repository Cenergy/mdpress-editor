<script setup>
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { createEditor, destroyEditor } from './editor.js';
import { runSmokeRenderTests } from './smoke.js';

const editorContainer = ref(null);
let mEditor;

const loadData = () => {
  fetch('/test/data.md').then(res => res.text()).then(text => {
    if (mEditor) {
      mEditor.setValue(text);
    }
  });
};

const customIcons = () => {
  const dom = document.createElement('div');
  dom.innerHTML = '自定义';
  dom.style.fontSize = '12px';
  dom.style.lineHeight = '24px';
  dom.style.cursor = 'pointer';
  dom.onclick = () => {
    alert('自定义图标');
  };
  if (mEditor) {
    mEditor.addToolIcon({
      dom,
      position: 'left',
      index: 0
    });
  }
};

onMounted(() => {
  if (editorContainer.value) {
    mEditor = createEditor(editorContainer.value, {
      theme: 'serene-rose',
      monacoOptions: {
        // language: 'markdown-math'
        // theme: 'vs-dark'
      }
    });
    loadData();
    customIcons();
    const query = new URLSearchParams(window.location.search);
    if (query.get('smokeTest') === '1') {
      runSmokeRenderTests(mEditor).then((result) => {
        if (result.success) {
          console.log('[smoke] render smoke tests passed');
          return;
        }
        console.error('[smoke] render smoke tests failed:', result.reason);
      });
    }
  }
});

onBeforeUnmount(() => {
  destroyEditor();
});
</script>

<template>
  <div class="container2" style="display: flex;flex-direction: row; width: 100%;height: 100%;">
    <div  style="flex: 1;min-width: 0;height: 100%;background-color: black;">
      <div ref="editorContainer" style="width: 100%;height: 100%;background-color: green;"></div>
    </div>
    <div  style="width: 100px;height: 100%;background-color: cadetblue;"></div>
  </div>
</template>

<style>

html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  font-family: 微软雅黑;
}

.container {
  width: 100%;
  height: 100%;
  margin: auto;
}
</style>
