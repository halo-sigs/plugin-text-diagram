<script lang="ts" setup>
import { NodeViewContent, nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import mermaid from "mermaid";
import { compress } from "./plantuml/encoder";
import { useDebounceFn } from "@vueuse/core";

mermaid.initialize({ startOnLoad: false });

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
  <node-view-wrapper>
    <div>
      <select
        v-model="language"
        class="block px-2 py-1.5 text-sm text-gray-900 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        contenteditable="false"
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
        class="text-dragram-preview"
        contenteditable="false"
      ></div>
    </div>
  </node-view-wrapper>
</template>
<style>
.panel {
  display: flex;
  padding: 5px;
}

.text-diagram-code {
  flex: 1;
  padding: 5px;
}

.text-dragram-preview {
  flex: 1;
}
</style>
