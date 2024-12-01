package run.halo.plugin.textdiagram;

public class JSInjector {
    static String getParsedKatexScript(String darkClassSelector, String mermaid_selector) {
        String katexScript = """
            <script defer src="/plugins/text-diagram/assets/static/mermaid.min.js"></script>
            <script>
                document.addEventListener("DOMContentLoaded", function() {
                  const postBody = document.body
                  let darkModel = document.querySelector('%s')
                  mermaid.initialize({
                    startOnLoad: false,
                    theme: darkModel?'dark':'default'
                  });
                  mermaid.run({
                    querySelector: '%s',
                  });
                });
            </script>
            """;
        return String.format(katexScript, darkClassSelector, mermaid_selector);
    }
}