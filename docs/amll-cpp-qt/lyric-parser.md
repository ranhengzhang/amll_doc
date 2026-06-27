# LyricParser

一个用于解析 TTML 歌词格式并导出为多种其他格式的 C++ 库。以 TTML 作为核心输入格式，支持导出为 LRC、QRC、YRC、KRC、ASS、SPL、LYS 等主流歌词格式，提供统一的 API 接口。

[GitHub 仓库](https://github.com/ranhengzhang/ttml-cpp-qt-parser)

## 环境要求

- C++23 或更高版本
- Qt 6.x
- CMake 3.20+

## 集成方式

### 作为子目录使用

```cmake
add_subdirectory(path/to/lyric)
target_link_libraries(your_target PRIVATE LyricParser::lyric)
```

### 通过 find_package 使用

安装后可通过 CMake 的 `find_package` 命令引入：

```cmake
find_package(LyricParser REQUIRED)
target_link_libraries(your_target PRIVATE LyricParser::lyric)
```

## 安装

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
cmake --install build --prefix /your/install/path
```

## 基本用法

```cpp
#include "LyricObject.hpp"
#include <QString>

// 从 TTML 解析歌词
QString ttmlContent = "...";  // 你的 TTML 内容
auto [lyric, status] = LyricObject::fromTTML(ttmlContent);

if (status == LyricObject::Status::Success) {
    // 导出为其他格式
    QString lrc = lyric.toLRC("");
    QString ass = lyric.toASS();
    QString qrc = std::get<0>(lyric.toQRC("zh", ""));
}
```

## 支持的格式

| 格式 | 输入 | 输出 |
|------|------|------|
| TTML | ✅ | ✅ |
| LRC | - | ✅ |
| QRC | - | ✅ |
| YRC | - | ✅ |
| KRC | - | ✅ |
| ASS | - | ✅ |
| SPL | - | ✅ |
| LYS | - | ✅ |

## 架构

库采用三层数据模型设计：

- **LyricObject** - 顶层容器，管理全局元数据和歌词行列表
- **LyricLine** - 单行歌词，包含时间戳和音节信息
- **LyricSyl** - 音节单元，支持逐字时间标记

配合 **LyricTime** 时间戳抽象类，提供毫秒 / 厘秒转换和算术运算。

## 许可

本库采用 GNU 宽通用公共许可证第 3 版（LGPL-3.0-or-later）授权。
