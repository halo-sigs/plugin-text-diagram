import { definePlugin } from "@halo-dev/console-shared";
import { ExtensionTextDiagram } from "@/editor/text-diagram";

export default definePlugin({
  components: {},
  routes: [],
  extensionPoints: {
    "default:editor:extension:create": () => {
      return [ExtensionTextDiagram];
    },
  },
});
