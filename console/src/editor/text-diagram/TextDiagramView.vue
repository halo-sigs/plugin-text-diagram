<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import mermaid from "mermaid";
import { compress } from "./plantuml/encoder";
import { useDebounceFn } from "@vueuse/core";

mermaid.initialize({ startOnLoad: false });

const props = defineProps(nodeViewProps);
const previewRef = ref<HTMLElement>();

const languages = [
  {
    value: "mermaid",
    label: "Mermaid",
  },
  {
    value: "plantuml",
    label: "PlantUML",
  },
];
const language = computed({
  get: () => {
    return props.node?.attrs.type;
  },
  set: (language: string) => {
    props.updateAttributes({ type: language });
  },
});

// render as svg
const doRenderPreview = async function () {
  const element = previewRef.value;
  const graphDefinition = props.node.attrs.content;
  switch (language.value) {
    case "mermaid": {
      // random element id
      const id = `mermaid-${Date.now()}`;
      const { svg } = await mermaid.render(id, graphDefinition, element);
      element!.innerHTML = svg;
      break;
    }
    case "plantuml": {
      const url = compress(graphDefinition);
      props.updateAttributes({ src: url });
      element!.innerHTML = `<img src="${url}"  alt="plantuml"/>`;
      break;
    }
    default:
      break;
  }
};

const renderPreview = useDebounceFn(() => doRenderPreview(), 250);

onMounted(() => {
  watch(
    () => props.node.attrs.content,
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
  <node-view-wrapper class="editor-block text-diagram-container">
    <div class="text-diagram-nav">
      <div class="text-diagram-nav-start">文本绘图</div>
      <div class="text-diagram-nav-end">
        <select
          v-model="language"
          class="text-diagram-type-select block px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
          contenteditable="false"
        >
          <option
            v-for="(lan, index) in languages"
            :key="index"
            :value="lan.value"
          >
            {{ lan.label }}
          </option>
        </select>
      </div>
    </div>
    <div class="text-diagram-editor-panel">
      <textarea
        class="text-diagram-code rounded-md border border-gray-300"
        rows="5"
        cols="30"
        placeholder="input text"
        :value="node.attrs.content"
        @input="updateAttributes({ content: $event.target.value })"
      />
      <div
        ref="previewRef"
        class="text-diagram-preview"
        contenteditable="false"
      ></div>
    </div>
  </node-view-wrapper>
</template>
<style>
.text-diagram-container {
  border: 1px #e7e7e7 solid;
}

.text-diagram-nav {
  border-bottom: 1px #e7e7e7 solid;
  display: flex;
}

.text-diagram-nav-start {
  flex: 1;
  line-height: 2;
}

.text-diagram-nav-end {
  justify-content: flex-end;
}

.text-diagram-editor-panel {
  display: flex;
  padding: 5px;
}

.text-diagram-type-select {
  width: 7em;
}

.text-diagram-code {
  flex: 1;
  padding: 5px;
}

.text-diagram-preview {
  flex: 1;
  border-left: 1px #e7e7e7 solid;
}
</style>
