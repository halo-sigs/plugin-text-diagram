import {
  type Editor,
  mergeAttributes,
  Node,
  type Range,
  VueNodeViewRenderer,
} from "@tiptap/vue-3";
import TextDiagramView from "./TextDiagramView.vue";
import { markRaw } from "vue";
import icon from "~icons/simple-icons/diagramsdotnet";

export const ExtensionTextDiagram = Node.create({
  name: "text-diagram",
  inline: false,
  content: "text*",
  marks: "",
  group: "block",
  code: true,
  defining: true,
  addAttributes() {
    return {
      type: {
        default: "mermaid",
        parseHTML: (element) => {
          const type = element.getAttribute("type");
          if (!type) {
            return null;
          }
          return type;
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "text-diagram[type]",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["text-diagram", mergeAttributes(HTMLAttributes), 0];
  },
  addNodeView() {
    return VueNodeViewRenderer(TextDiagramView);
  },
  addOptions() {
    return {
      ...this.parent?.(),
      // 扩展指令项
      getCommandMenuItems() {
        return {
          priority: 100,
          icon: markRaw(icon),
          title: "文本绘图",
          keywords: ["text-diagram", "wenbenhuitu"],
          command: ({ editor, range }: { editor: Editor; range: Range }) => {
            editor
              .chain()
              .focus()
              .deleteRange(range)
              .insertContent([
                { type: "text-diagram", attrs: { src: "" } },
                { type: "paragraph", content: "" },
              ])
              .run();
          },
        };
      },
    };
  },
});
