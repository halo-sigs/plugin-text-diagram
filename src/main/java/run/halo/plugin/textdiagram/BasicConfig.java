package run.halo.plugin.textdiagram;

import lombok.Data;

@Data
public class BasicConfig {
    boolean enable_client_mermaid_render;
    String dark_class_selector;
    String mermaid_selector;
}