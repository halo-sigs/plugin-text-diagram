import {
  type Editor,
  mergeAttributes,
  Node,
  type Range,
  VueNodeViewRenderer,
} from "@halo-dev/richtext-editor";
import TextDiagramView from "./TextDiagramView.vue";
import { markRaw } from "vue";
import icon from "~icons/simple-icons/diagramsdotnet";

export type TextDiagramOptions = {
  HTMLAttributes: Record<string, any>;
};

export const ExtensionTextDiagram = Node.create<TextDiagramOptions>({
  name: "text-diagram",
  inline: false,
  content: "",
  marks: "",
  group: "block",
  code: true,
  atom: true,
  defining: true,
  addAttributes() {
    return {
      type: {
        default: "mermaid",
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          return !attributes.type
            ? {}
            : {
                "data-type": attributes.type,
              };
        },
      },
      content: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-content"),
        renderHTML: (attributes) => {
          return !attributes.content
            ? {}
            : {
                "data-content": attributes.content,
              };
        },
      },
      src: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-src"),
        renderHTML: (attributes) => {
          return !attributes.src
            ? {}
            : {
                "data-src": attributes.src,
              };
        },
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "text-diagram[data-type]",
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    switch (node.attrs.type) {
      case "plantuml":
        return [
          "text-diagram",
          mergeAttributes(HTMLAttributes),
          [
            "img",
            {
              src: HTMLAttributes["data-src"],
            },
          ],
        ];
      case "mermaid":
        return [
          "text-diagram",
          mergeAttributes(HTMLAttributes),
          node.attrs.content,
        ];
      default:
        // unknown type
        return [
          "text-diagram",
          mergeAttributes(HTMLAttributes),
          node.attrs.content,
        ];
    }
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
                { type: "text-diagram", attrs: {} },
                { type: "paragraph", content: "" },
              ])
              .run();
          },
        };
      },
    };
  },
});
