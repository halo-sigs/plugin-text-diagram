<script lang="ts" setup>
import { nodeViewProps, NodeViewWrapper } from "@halo-dev/richtext-editor";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { compress } from "./plantuml/encoder";
import { useDebounceFn } from "@vueuse/core";
import IcOutlineTipsAndUpdates from "~icons/ic/outline-tips-and-updates";
import IcOutlineFullscreen from "~icons/ic/outline-fullscreen";
import IcOutlineFullscreenExit from "~icons/ic/outline-fullscreen-exit";

const props = defineProps(nodeViewProps);
const previewRef = ref<HTMLElement>();
const fullscreen = ref(false);

const languages = [
  {
    value: "mermaid",
    label: "Mermaid",
    document: "https://mermaid.js.org/",
  },
  {
    value: "plantuml",
    label: "PlantUML",
    document: "https://plantuml.com/zh/",
  },
];

const languageValue = computed({
  get: () => {
    return props.node?.attrs.type;
  },
  set: (language: string) => {
    props.updateAttributes({ type: language });
  },
});

const language = computed(() => {
  return languages.find((lan) => lan.value === languageValue.value);
});

// render as svg
const doRenderPreview = async function () {
  const element = previewRef.value;
  if (!element) return;
  const graphDefinition = props.node.attrs.content;
  switch (languageValue.value) {
    case "mermaid": {
      // random element id
      const id = `mermaid-${Date.now()}`;
      try {
        const mermaid = await import("mermaid");
        const { svg } = await mermaid.default.render(
          id,
          graphDefinition,
          element
        );
        element.innerHTML = svg;
      } catch (error) {
        element.innerHTML = `<pre style="color: red; background-color: #f6f8fa">${error}</pre>`;
      }
      break;
    }
    case "plantuml": {
      const url = compress(graphDefinition);
      props.updateAttributes({ src: url });
      element.innerHTML = `<img src="${url}" alt="plantuml"/>`;
      break;
    }
    default:
      break;
  }
};

const renderPreview = useDebounceFn(() => doRenderPreview(), 250);

onMounted(async () => {
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

// text diagram editor
function onEditorChange(value: string) {
  props.updateAttributes({ content: value });
}
</script>
<template>
  <node-view-wrapper
    class="text-diagram-container"
    :class="{ 'text-diagram-fullscreen': fullscreen }"
  >
    <div class="text-diagram-nav">
      <div class="text-diagram-nav-start">
        <div>文本绘图</div>
        <select
          v-model="languageValue"
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
        <a
          v-if="language"
          v-tooltip="`查阅 ${language.label} 的文档`"
          :href="language.document"
          target="_blank"
        >
          <IcOutlineTipsAndUpdates />
        </a>
      </div>
      <div class="text-diagram-nav-end">
        <div
          class="text-diagram-fullscreen-icon"
          @click="fullscreen = !fullscreen"
        >
          <IcOutlineFullscreenExit v-if="fullscreen" v-tooltip="'退出全屏'" />
          <IcOutlineFullscreen v-else v-tooltip="'全屏'" />
        </div>
      </div>
    </div>
    <div class="text-diagram-editor-panel">
      <div class="text-diagram-code">
        <VCodemirror
          :model-value="node.attrs.content"
          height="100%"
          @change="onEditorChange"
        />
      </div>
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
  border-radius: 4px;
  overflow: hidden;
  margin-top: 0.75em;
}

.text-diagram-nav {
  border-bottom: 1px #e7e7e7 solid;
  display: flex;
  padding: 5px 10px;
  align-items: center;
}

.text-diagram-nav-start {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.text-diagram-nav-end {
  justify-content: flex-end;
}

.text-diagram-editor-panel {
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100%;
  height: 100%;
}

.text-diagram-type-select {
  width: 7em;
}

.text-diagram-code {
  height: 100%;
  border-right: 1px #e7e7e7 solid;
}

.text-diagram-preview {
  padding: 5px;
  height: 100%;
}

.text-diagram-preview svg {
  width: 100%;
}

.text-diagram-code img {
  width: 100%;
}

.text-diagram-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: #fff;
  margin-top: 0;
}

.text-diagram-fullscreen-icon {
  cursor: pointer;
}

.text-diagram-fullscreen-icon svg {
  font-size: 18px;
}

.text-diagram-fullscreen-icon:hover {
  color: #999;
}
</style>
