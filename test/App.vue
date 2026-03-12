<script setup>
import { onMounted, ref } from 'vue';
import * as mdpress from '../index.js';

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
    mEditor = new mdpress.MDEditor(editorContainer.value, {
      theme: 'serene-rose',
      monacoOptions: {
        // language: 'markdown-math'
        // theme: 'vs-dark'
      }
    });
    loadData();
    customIcons();
  }
});
</script>

<template>
  <div ref="editorContainer"></div>
</template>

<style>
/* @import '../index.css'; */

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
