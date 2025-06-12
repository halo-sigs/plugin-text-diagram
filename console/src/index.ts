import { definePlugin } from "@halo-dev/console-shared";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": async () => {
      const { ExtensionTextDiagram } = await import("./editor/text-diagram");
      return [ExtensionTextDiagram];
    },
  },
});
