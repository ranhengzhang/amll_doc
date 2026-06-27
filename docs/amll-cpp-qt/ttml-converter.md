# TTML Converter

一个用于将 TTML 字幕 / 歌词格式转换为多种其他格式的桌面工具。基于 C++ Qt 开发，支持命令行操作，可将 TTML 格式的歌词转换为 LRC、QRC、YRC、KRC、ASS、SPL、LYS 等主流歌词格式。

[GitHub 仓库](https://github.com/ranhengzhang/ttml-converter)

## 项目组成

本项目包含两个主要组件：

- **Converter** - TTML 字幕转换器核心程序
- **Installer** - TTML Converter 的安装程序（安装后可通过右键菜单使用）

## 环境要求

- Windows 10 或更高版本
- C++23 或更高版本
- Qt 6.x
- CMake 3.14+
- MSVC（Visual Studio 2022 或更高版本）

## 构建

```bash
# 配置项目
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release

# 编译项目
cmake --build build
```

## 使用说明

可直接通过命令行运行，或通过 Installer 安装后右键任意 TTML 文件即可在菜单中找到 TTML Converter 选项。

### 命令行用法

```bash
ttml-converter [选项] <输入文件>
```

### 选项

| 选项 | 说明 |
|------|------|
| `-h, --help` | 显示帮助信息 |
| `-v, --version` | 显示版本信息 |
| `-f, --format <format>` | 指定输出格式（必需） |
| `-o, --output <template>` | 指定输出文件名模板（可选，默认为 `%filename%`） |

### 支持的输出格式

| 格式 | 说明 |
|------|------|
| `ass` | ASS 字幕格式 |
| `lrc` | LRC 歌词格式 |
| `spl` | SPL 歌词格式 |
| `lys` | LYS 歌词格式 |
| `qrc` | QRC 歌词格式 |
| `yrc` | YRC 歌词格式 |
| `krc` | KRC 歌词格式 |
| `txt` | 纯文本格式 |

### 使用示例

```bash
# 将 TTML 转换为 LRC 格式
ttml-converter -f lrc input.ttml

# 将 TTML 转换为 ASS 格式，并指定输出文件名
ttml-converter -f ass -o %title% input.ttml

# 显示帮助
ttml-converter --help
```

## 目录结构

- **converter/** - 核心转换程序源代码
- **installer/** - 安装程序源代码（含右键菜单注册逻辑）
- **CMakeLists.txt** - 顶层构建配置

## 内部依赖

本项目的核心解析逻辑依赖于 [LyricParser](./lyric-parser.md) 库，以 Git Submodule 方式引入。

## 许可

本项目采用 GNU 通用公共许可证第 3 版（GPL-3.0-or-later）授权。
