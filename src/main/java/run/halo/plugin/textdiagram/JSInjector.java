package run.halo.plugin.textdiagram;

public class JSInjector {
    static String getParsedKatexScript(String mermaid_selector) {
        String katexScript = """
            <script defer src="/plugins/text-diagram/assets/static/mermaid.min.js"></script>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                  const postBody = document.body
                  mermaid.initialize({ startOnLoad: false });
                  mermaid.run({
                    querySelector: '%s',
                  });
                });
            </script>
            """;
        return String.format(katexScript, mermaid_selector);
    }
}