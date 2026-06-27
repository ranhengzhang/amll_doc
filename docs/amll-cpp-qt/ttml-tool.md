# TTML Trans Tool

一个基于 C++ Qt 的高性能 TTML 歌词转换桌面工具，专为现代 Apple Music TTML 结构设计，提供全面的歌词格式转换、处理和优化功能。

[GitHub 仓库](https://github.com/ranhengzhang/c-ttml-trans-tool) | [DeepWiki 详细文档](https://deepwiki.com/ranhengzhang/c-ttml-trans-tool)

> [!WARNING]
>
> 本项目的 GitHub README 已过时，详情请以 [DeepWiki 文档](https://deepwiki.com/ranhengzhang/c-ttml-trans-tool) 为准。

## 环境要求

- C++23 或更高版本
- Qt 5.15+ 或 Qt 6.x
- CMake 3.5+（子模块 lyric 需要 3.20+）
- MSVC（Visual Studio 2022 或更高版本，需启用 `/Zc:preprocessor` 和 `/Zc:__cplusplus`）

## 构建模块

| 模块 | 类型 | 职责 |
|------|------|------|
| `lyric` | 静态库 | 核心数据模型（LyricObject、LyricTime）与解析器 |
| `widgets` | 静态库 | 自定义 UI 组件（如 MPlainTextEdit） |
| `dialogs` | 静态库 | 主窗口与辅助对话框逻辑 |
| `ttml-tool` | 可执行文件 | 应用程序入口与系统集成 |

## 已实现功能

### 格式转换

支持读取 TTML 并导出为以下格式：

- TTML
- ASS
- LRC（以 Walkman NW-A45 显示效果为准）
- SPL
- LYS
- QRC
- YRC
- KRC
- TXT

### 复制原文

支持将原文以以下格式复制到剪贴板：

- TTML
- ASS
- LRC
- SPL
- LYS
- QRC
- YRC
- KRC
- TXT

### 时间处理

- 全局时间轴偏移
- 精度调整

### 繁简转换

集成 OpenCC，支持高精度简繁中文转换：

- 简转繁
- 繁转简

### 元数据管理

- 复制为 Markdown 格式 Pr 正文（预设元数据）
- 复制为 Markdown 格式表格（扩展元数据）

## 未实现功能

- 解析 LYS、QRC、YRC、KRC 格式文件
- KRC 编码 / 解码
- Win Toast 提示

## 技术架构

工具分为三个核心层次：

### 数据模型层

基于 `LyricObject` → `LyricLine` → `LyricSyl` 三层结构构建的核心数据模型，配合 `LyricTime` 时间戳抽象类和 `Agent` 贡献者信息类。

### 序列化层

通过分发模式实现多格式导出，`LyricObject` 遍历 `LyricLine` 集合，再由 `LyricLine` 遍历 `LyricSyl` 音节单元生成目标格式。

### 用户界面层

基于 Qt Widgets 的桌面 GUI，提供主窗口控制器、语言选择对话框、时间格式对话框等交互界面。

## IPC 支持

- 管道名称：`C_TTML_TOOL`
- 使用 `QLocalServer` 向连接的客户端流式传输 UTF-8 TTML 内容

## 多平台支持

| 平台 | 支持方式 |
|------|------|
| Windows | 唯一平台，单实例控制（Mutex） |

别的不要想了。

## 许可

本项目采用 GNU 通用公共许可证第 3 版（GPL-3.0-or-later）授权。
