# 其它脚本

本章包含不属于辅助脚本分类的其它资源，包括部分 Lua 脚本和字幕模板文件。

## 行内容编辑

本章节下的 Lua 脚本用于从剪贴板批量导入文本到字幕行。脚本需放置在 Aegisub 的 `automation/autoload/` 目录下。

脚本的 GitHub 源文件链接格式为 `https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/<脚本名>.lua`。

### replace-rows — 替换行内容

**源码：** [replace-rows.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/replace-rows.lua)

将剪贴板中的文本按行替换到选中的对话行。剪贴板行数必须与选中行数一致，否则会取消操作并输出每行内容供核对。

**使用方法：**
1. 复制目标文本到剪贴板（每行对应一个待替换行）
2. 在 Aegisub 中选中需要替换的行
3. 运行「replace rows - 替换行内容」宏

### replace-orig — 替换原文行

**源码：** [replace-orig.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/replace-orig.lua)

与 `replace-rows` 类似，但仅替换样式为 `orig` 且效果为空或 `karaoke` 的行。剪贴板行数只需与符合条件的 `orig` 行数匹配。

**使用方法：**
1. 复制目标原文到剪贴板
2. 选中包含 `orig` 行的区域
3. 运行「replace orig - 替换原文行」宏

### add-translation — 添加翻译

**源码：** [add-translation.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/add-translation.lua)

从剪贴板读取翻译文本，为每个 `orig` 行在其下方插入一条样式为 `ts` 的翻译行。翻译文本行数必须与有效 `orig` 行数一致。

**使用方法：**
1. 复制翻译文本到剪贴板（每行对应一句原文的翻译）
2. 选中对应的 `orig` 行
3. 运行「Add Translation - 添加翻译」宏
4. 在弹出的对话框中：
   - **语言**：指定语言代码，如 `zh-CN`（会写入 `x-lang` 标记）
   - **保留相同部分**：勾选后即使原文与翻译相同也会插入翻译行
   - 可直接在文本框粘贴翻译内容替代剪贴板

### add-transliteration — 添加音译

**源码：** [add-transliteration.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/add-transliteration.lua)

与 `add-translation` 功能类似，但从剪贴板读取音译（罗马字）文本，为每个 `orig` 行在其下方插入一条样式为 `roma` 的音译行。

**使用方法：**
1. 复制音译文本到剪贴板
2. 选中对应的 `orig` 行
3. 运行「Add Transliteration - 添加音译」宏
4. 在弹出的对话框中指定语言代码

## 字幕模板文件

以下 `.ass` 文件是 Aegisub 字幕模板（Automation Template），用于歌词的自动化渲染。文件需放置在对应的字幕项目中使用。

模板文件的 GitHub 源文件链接格式为 `https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/subtitles/<文件名>`。

### check.ass — 基础检查模板

**源码：** [check.ass](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/subtitles/check.ass)

一个轻量级的 Aegisub 字幕模板，用于快速检查和验证逐字歌词效果。

**模板结构：**
- **code once**：初始化 `pre_end_time` 和 `pre_pos` 变量，用于追踪行间的时间位置
- **code line**：自动处理行间叠加——当两行的间隔不足 1000ms 时，后一行会自动升高以错位显示
- **template furi**：渲染假名/注音行，位于原文上方
- **template syl**：渲染逐字歌词行，位于原文下方，使用 `\k` 标签控制逐字高亮
- **template line**（roma / ts）：渲染完整的罗马音行和翻译行

**适用场景：**
适用于制作过程中的快速预览，样式简洁，不包含复杂的标记处理逻辑。

### preview.ass — 完整预览模板

**源码：** [preview.ass](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/subtitles/preview.ass)

一个功能完整的 Aegisub 字幕模板，支持多种歌词样式的同时渲染和更多视觉细节。

**样式定义：**

| 样式名 | 用途 |
|--------|------|
| `orig` | 原文主歌词（128px，粗体） |
| `orig-furigana` | 原文的假名注音 |
| `ts` | 翻译歌词（94px，斜体） |
| `ts-furigana` | 翻译的假名注音 |
| `roma` | 罗马音/拼音（52px） |
| `roma-furigana` | 罗马音的假名注音 |

**模板功能：**
- **code once**：定义辅助函数
  - `mask_style()`：根据音节是否为 `\k-Z`（零宽度）或 `\k-zero` 生成不同的裁剪遮罩
  - `pos_index()`：计算当前行在屏幕上的垂直位置，使连续行依次排列
  - `ts_index()`：单独追踪翻译行位置，使翻译行紧贴原文下方
- **code line**：每行开始时计算位置，处理 `x-bg` 背景行的特殊逻辑
- **template syl**（Layer 1）：渲染主歌词的逐字效果，支持 `\k-Z` 零宽字符的隐藏
- **template syl**（Layer 2）：渲染带裁剪遮罩的歌词底层，用于实现渐进式高亮
- **template pre-line mark**：渲染行号标记（背景行加括号显示）
- **template furi**：渲染假名注音，位于原文上方
- **template syl**（roma）：逐字渲染罗马音行
- **template syl**（ts）：逐字渲染翻译行，水平位置与原文对齐

**适用场景：**
适用于正式制作流程，支持多语言歌词的完整预览，包含行号、背景行、假名注音等完整功能。
