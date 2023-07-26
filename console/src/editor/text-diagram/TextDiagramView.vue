<script lang="ts" setup>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from "@tiptap/vue-3";
import { watch, ref, onMounted, nextTick, computed } from "vue";
import mermaid from "mermaid";
mermaid.initialize({ startOnLoad: false });
import { compress } from "./plantuml/encoder";

const props = defineProps(nodeViewProps);
const previewRef = ref<HTMLElement>();

const languages = ["mermaid", "plantuml"];
const language = computed({
  get: () => {
    return props.node?.attrs.type;
  },
  set: (language: string) => {
    props.updateAttributes({ type: language });
  },
});

// render as svg
const renderPreview = async function () {
  const element = previewRef.value;
  const graphDefinition = props.node.textContent;
  switch (language.value) {
    case "mermaid": {
      // random element id
      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, graphDefinition, element);
      element.innerHTML = svg;
      break;
    }
    case "plantuml": {
      const url = compress(graphDefinition);
      console.log(url);
      element.innerHTML = `<img src="${url}" />`;
      break;
    }
    default:
      break;
  }
};

onMounted(() => {
  watch(
    () => props.node.textContent,
    () => {
      nextTick(() => {
        renderPreview();
      });
    }
  );
  watch(
    () => props.node.attrs.type,
    () => {
      nextTick(() => {
        renderPreview();
      });
    }
  );
  renderPreview();
});
</script>
<template>
  <node-view-wrapper>
    <div>
      <select
        v-model="language"
        contenteditable="false"
        class="block px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
      >
        <option
          v-for="(language, index) in languages"
          :key="index"
          :value="language"
        >
          {{ language }}
        </option>
      </select>
    </div>
    <div class="panel">
      <node-view-content as="pre" class="text-diagram-code" />
      <div
        ref="previewRef"
        class="mermaid text-dragram-preview"
        contenteditable="false"
      ></div>
    </div>
  </node-view-wrapper>
</template>
<style>
.panel {
  display: flex;
  color: beige;
}
.text-diagram-code {
  width: 50%;
}
.text-dragram-preview {
  width: 50%;
}
</style>
