import {
  type Editor,
  mergeAttributes,
  Node,
  type Range,
  VueNodeViewRenderer,
  ToolboxItem,
} from "@halo-dev/richtext-editor";
import TextDiagramView from "./TextDiagramView.vue";
import { markRaw } from "vue";
import icon from "~icons/simple-icons/diagramsdotnet";
import { ExtensionOptions } from "@halo-dev/richtext-editor/dist/types";

export const ExtensionTextDiagram = Node.create<ExtensionOptions>({
  name: "text-diagram",
  inline: false,
  group: "block",
  code: true,
  atom: true,

  addAttributes() {
    return {
      type: {
        default: "mermaid",
        parseHTML: (element) => element.getAttribute("data-type"),
        renderHTML: (attributes) => {
          return {
            "data-type": attributes.type,
          };
        },
      },
      content: {
        default: "",
        parseHTML: (element) => element.getAttribute("data-content"),
        renderHTML: (attributes) => {
          return {
            "data-content": attributes.content,
          };
        },
      },
      render: {
        default: null,
        rendered: false,
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "text-diagram[data-type='mermaid']",
        getAttrs: (element) => {
          const firstChild = element.firstElementChild;
          if (firstChild?.nodeType === 1) {
            return {
              render: firstChild.outerHTML,
            };
          }
          return {
            render: null,
          };
        },
      },
      {
        tag: "text-diagram[data-type='plantuml']",
        getAttrs: (element) => {
          const firstChild = element.firstElementChild;
          if (firstChild?.tagName === "IMG") {
            return {
              render: firstChild.outerHTML,
            };
          }
          return {
            render: null,
          };
        },
      },
    ];
  },
  renderHTML({ node, HTMLAttributes }) {
    const render = node.attrs.render;
    if (!render) {
      return [
        "text-diagram",
        mergeAttributes(HTMLAttributes),
        node.attrs.content,
      ];
    }

    const diagram = document.createElement("text-diagram");
    diagram.innerHTML = render;
    diagram.setAttribute("data-type", node.attrs.type);
    diagram.setAttribute("data-content", node.attrs.content);
    return {
      dom: diagram,
    };
  },
  addNodeView() {
    return VueNodeViewRenderer(TextDiagramView);
  },
  addOptions() {
    return {
      ...this.parent?.(),
      getToolboxItems({ editor }: { editor: Editor }) {
        return [
          {
            priority: 100,
            component: markRaw(ToolboxItem),
            props: {
              editor,
              icon: markRaw(icon),
              title: "文本绘图",
              action: () => {
                editor
                  .chain()
                  .focus()
                  .insertContent([
                    { type: "text-diagram", attrs: {} },
                    { type: "paragraph", content: "" },
                  ])
                  .run();
              },
            },
          },
        ];
      },
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
