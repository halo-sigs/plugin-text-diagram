# plugin-text-diagram

为默认编辑器和文章渲染提供 文本绘图（mermaid） 支持。

- [x] mermaid
- [ ] plantuml（可编辑预览，文章页无法渲染）

## 使用方式

1. 下载，目前提供以下两个下载方式：
    - GitHub Releases：访问 [Releases](https://github.com/gengxiaoxiaoxin/plugin-text-diagram/releases) 下载 Assets 中的 JAR 文件。
2. 安装，插件安装和更新方式可参考：<https://docs.halo.run/user-guide/plugins>。

## 用法说明

### 默认编辑器
增添了`/`快捷方式，文本绘图。
### 文章页渲染
此插件安装之后，文章页使用KaTeX.js渲染公式，插件支持2个配置项。
1. mermaid_selector
   
CSS-Selector语法，用来查找渲染的mermaid-Dom。

默认值为：`text-diagram[type="mermaid"]`（本插件扩展默认编辑器生成的行内公式Dom），如需兼容其他编辑器，则设置为相应的Selector即可（CSS-Selector支持或，`,`分隔即可）

example：`.class1,.class2`

## 开发环境

```bash
git clone git@github.com:gengxiaoxiaoxin/plugin-text-diagram.git

# 或者当你 fork 之后

git clone git@github.com:{your_github_id}/plugin-text-diagram.git
```

```bash
cd path/to/plugin-katex
```

```bash
# macOS / Linux
./gradlew pnpmInstall

# Windows
./gradlew.bat pnpmInstall
```

```bash
# macOS / Linux
./gradlew build

# Windows
./gradlew.bat build
```

修改 Halo 配置文件：

```yaml
halo:
  plugin:
    runtime-mode: development
    classes-directories:
      - "build/classes"
      - "build/resources"
    lib-directories:
      - "libs"
    fixedPluginPath:
      - "/path/to/plugin-text-diagram"
```
