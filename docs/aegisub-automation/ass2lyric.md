# ASS 歌词转换脚本使用手册

本文档介绍三款 Aegisub 自动化脚本，用于将 ASS 格式的卡拉OK字幕文件转换为不同歌词格式（SPL、TTML）。

## 脚本概述

### ass2spl.lua — ASS 转 SPL

将 ASS 字幕转换为 SPL（Subtitles Per Line）格式的歌词文件，适用于部分歌词播放器。

**下载链接：** [ass2spl.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/ass2spl.lua)

### ass2ttml.lua — ASS 转 TTML（V1）

将 ASS 字幕转换为 Apple Music 风格的 TTML（Timed Text Markup Language）歌词格式。

**下载链接：**

- 兼容 Aegisub 3.2 版本：[ass2ttml-3.2.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/ass2ttml-3.2.lua)
- 兼容 Aegisub 3.4 版本：[ass2ttml-3.4.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/ass2ttml-3.4.lua)

### ass2ttml.v2.lua — ASS 转 TTML（V2）

V1 的升级版，支持多语言翻译和音译、多角色演唱者（单人对唱 / 多人和声）、和声处理等高级功能。

**下载链接：** [ass2ttml.v2.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/ass2ttml.v2.lua)

## 依赖库

三个脚本均依赖 Aegisub 内置库 `karaskel.lua`。将这些脚本放入 Aegisub 的 `automation/autoload/` 目录即可使用。

## 标记速查总表

以下列出所有标记及其在三个脚本中的支持情况：

| 标记 | 说明 | ass2spl | ass2ttml | ass2ttml.v2 |
|------|------|:---:|:---:|:---:|
| `x-role:"名称"` | 指定演唱者名称 | ✅ | ❌ | ✅ |
| `x-person` / `x-person-N` | 声明单人演唱者 | ❌ | ❌ | ✅ |
| `x-group` / `x-group-N` | 声明多人组合 | ❌ | ❌ | ✅ |
| `x-other` | 声明"其他"演唱者 | ❌ | ❌ | ✅ |
| `x-bg` | 标记背景和声行 | ✅ | ✅ | ✅ |
| `x-chor` | 合唱/双行拆分 | ❌ | ✅ | ✅ |
| `x-stash` | 和声行附属到指定行 | ❌ | ❌ | ✅ |
| `x-anti` / `x-duet` / `x-solo` / `x-fade` / `x-whis` | 对唱样式标记 | ❌ | ✅ | ✅ |
| `x-part:名称` | 段落标记 | ✅ | ✅ | ✅ |
| `x-markXXX` | 自定义标记 | ✅ | ✅ | ✅ |
| `x-lang:语言代码` | 指定行语言 | ✅ | ✅ | ✅ |
| `x-fermata` / `x-fermata-N` | 延音标记 | ❌ | ❌ | ✅ |
| `x-replace` | 翻译行替换为罗马音 | ✅ | ✅ | ✅ |
| `\-merge` / `\-M` | 合并音节 | ✅ | ✅ | ✅ |
| `\-text` / `\-T` | 纯文本音节(无时间) | ✅ | ✅ | ✅ |
| `\-zero` / `\-Z` | 零时长音节 | ✅ | ✅ | ✅ |

## 标记详解

### 演唱者标记（Role）

用于在歌词中标注不同演唱者，实现角色切换显示。TTML V2 中会将不同演唱者组合分配不同的。

#### x-role:"名称"

指定演唱者名称，放在 ASS 的 **Actor** 字段中。一行可包含多个角色名。

```
x-role:"小明" x-role:"小红"
```

#### x-person / x-group / x-other

三个标记只能在 TTML V2 中使用，用于声明演唱者的类型和排序：

| 标记 | 作用 | 示例 |
|------|------|------|
| `x-person` | 声明该行为单人演唱 | `x-person x-role:"小明"` |
| `x-person-N` | 声明单人演唱并指定排序位置（N 为数字） | `x-person-2` 表示第二个出场 |
| `x-group` | 声明该行为多人组合演唱 | `x-group x-role:"小明" x-role:"小红"` |
| `x-group-N` | 声明多人组合并指定排序位置 | `x-group-1` |
| `x-other` | 声明该行为"其他"演唱者（背景/伴唱） | `x-other x-role:"伴唱"` |

使用规则：
- 一行中**只能包含一种类型**标记（person / group / other 三选一）
- `x-person` 行通常角色数量为 1，`x-group` 行通常有 2 个或以上角色
- `N` 参数用于控制输出中的演唱者排列顺序，数字越小越靠前

**支持情况：**

| 脚本 | x-role | x-person | x-group | x-other |
|------|:---:|:---:|:---:|:---:|
| ass2spl | ✅ | ❌ | ❌ | ❌ |
| ass2ttml | ❌ | ❌ | ❌ | ❌ |
| ass2ttml.v2 | ✅ | ✅ | ✅ | ✅ |

### 背景和声标记（x-bg / x-chor / x-stash）

控制歌词中和声部分的输出形式。

#### x-bg

放在 ASS 的 Actor 字段中，标记该行为**背景和声行**。和声行在 SPL 输出中会被圆括号 `()` 包裹，在 TTML 输出中作为单独的背景歌词行。

```
x-bg             → 标记当前行为和声行
```

**注意：** 一行同时包含 `x-bg` 和 `x-chor` 时有特殊含义（见 x-chor 说明）。

**支持情况：**

| 脚本 | x-bg |
|------|:---:|
| ass2spl | ✅ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

#### x-chor

合唱标记。将一行歌词拆分为**主唱行**和**对唱/和声行**两行，适用于对唱和多声部场景。

在 TTML V2 中：
- 仅 `x-chor`（无 `x-bg`）：生成两行相同文本，第二行自动添加 `x-anti` 标记
- `x-chor` + `x-bg` 同时存在：将当前行同时作为主行与背景行，合并输出

```
x-chor                              → 合唱拆分
x-chor x-bg                         → 合唱同时为主+和声
```

**支持情况：**

| 脚本 | x-chor |
|------|:---:|
| ass2spl | ❌ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

#### x-stash

**仅 TTML V2 支持。** 控制背景行附属到哪个主行。

- 不带 `x-stash`：背景和声行默认附属到**上一个已收集的主行**
- 带 `x-stash`：背景和声行附属到**下一个出现的 orig 行**

```
x-bg x-stash     → 和声行将附属到后面的主行
```

**支持情况：**

| 脚本 | x-stash |
|------|:---:|
| ass2spl | ❌ |
| ass2ttml | ❌ |
| ass2ttml.v2 | ✅ |

---

### 样式标记（x-anti / x-duet / x-solo / x-fade / x-whis）

这些标记在代码中均由同一组逻辑处理，效果等价——用于将当前行标记为对唱样式，与 `x-chor` 拆分出的第二行效果一致。区分不同标记名称仅用作语义提示，方便打轴时区分演唱风格。

用法示例：

```
x-anti            → 反色显示，通常用于对唱中的"答句"
x-duet            → 语义上的对唱标记
x-solo            → 语义上的独唱标记
x-fade            → 语义上的渐隐标记
x-whis            → 语义上的轻声/耳语标记
```

放入 Actor 字段即可生效。各样式具体视觉效果由播放器决定。

**支持情况：**

| 脚本 | 五种样式标记 |
|------|:---:|
| ass2spl | ❌ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

### 段落标记（x-part）

标记歌词的段落类型（如 Verse、Chorus、Bridge 等）。

放在第一行的 Actor 字段中，段落标题为自定义文本：

```
x-part:Verse       → 段落类型为 Verse（主歌）
x-part:Chorus      → 段落类型为 Chorus（副歌）
x-part:Bridge      → 段落类型为 Bridge（桥段）
```

在 TTML 输出中，不同段落会生成不同的 `<div>`。当段落切换且间隔超过 5 秒时，SPL 输出会自动插入空行作为段落分隔。

**支持情况：**

| 脚本 | x-part |
|------|:---:|
| ass2spl | ✅ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

### 自定义标记（x-mark）

用于在歌词中添加自定义备注标记，输出结束后会弹出对话框显示各标记所在的行号。

标记名称可以自定义，以 `x-mark` 开头：

```
x-markToDo         → 自定义标记 "ToDo"
x-markReview       → 自定义标记 "Review"
```

**支持情况：**

| 脚本 | x-mark |
|------|:---:|
| ass2spl | ✅ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

### 语言标记（x-lang）

指定当前翻译行（ts 行）或罗马音行（roma 行）的语言代码。放在对应的 ts 或 roma 行的 Actor 字段中。

TTML 文件遵循 IETF 的 BCP-47 语言代码标准。翻译行语言默认为 `zh-Hans`，音译行语言默认为原始歌词语言后追加 `-Latn`（如果原始语言为 `zh-Hans` 则默认 `zh-Latn-pinyin`，为 `zh-Hant` 则默认 `zh-Latn-jyutping`）。

**常用语言代码：**

| 语言代码 | 说明 |
|----------|------|
| `zh-Hans` | 简体中文 |
| `zh-Hant` | 繁体中文（粤语同样使用） |
| `zh-Latn-pinyin` | 中文拼音（不分繁简） |
| `zh-Latn-jyutping` | 粤语注音 |
| `en` | 英文 |
| `ja` | 日语 |
| `ja-Latn` | 日语罗马音 |
| `ko` | 韩语 |
| `ko-Latn` | 韩语罗马音 |

TTML V2 支持更丰富的语言代码校验，包括上述全部代码以及 BCP-47 标准中其他常见语言代码。

**支持情况：**

| 脚本 | x-lang |
|------|:---:|
| ass2spl | ✅ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

### 延音标记（x-fermata）

**仅 TTML V2 支持。** 用于标记音符的延音，控制歌词行的持续时间。

```
x-fermata             → 默认延音
x-fermata-3           → 延音 3 单位
```

**支持情况：**

| 脚本 | x-fermata |
|------|:---:|
| ass2spl | ❌ |
| ass2ttml | ❌ |
| ass2ttml.v2 | ✅ |

---

### 替换行标记（x-replace）

放在翻译行（ts 行）的 Actor 字段中，将该行从"翻译行"变更为"罗马音行"处理。用于某些翻译内容实际上应该作为罗马音输出的情况。

```
# 在 ts 行的 Actor 中加入：
x-replace            → 该 ts 行将被视为 roma 行处理
```

**支持情况：**

| 脚本 | x-replace |
|------|:---:|
| ass2spl | ✅ |
| ass2ttml | ✅ |
| ass2ttml.v2 | ✅ |

---

## 卡拉OK内联特效标记

这些标记嵌入在 Aegisub 的 `\k` 卡拉OK标签中，控制音节的时长和行为。格式为 `{\-标记名}`，放在音节开始处。

> [!IMPORTANT]
>
> 与 Aegisub 原生行为不同：Aegisub 中内联特效默认会持续影响后续所有音节，直到被覆盖或取消；但在这几个脚本中，内联标记**仅作用于当前音节**，不会影响后续音节。因此每个需要特殊处理的音节都需单独标记。

### 合并音节（\-merge / \-M）

将当前音节与前一个音节合并，不产生新的时间戳。

```
{\k10}今{\k10\-merge}天    → "今天" 合并为一个音节
```

### 纯文本音节（\-text / \-T）

标记当前音节为纯文本，不附带时间信息。适用于念白或不需要逐字高亮的文本。

```
{\k10}歌{\k10\-text}词     → "词" 不会产生时间标记
```

### 零时长音节（\-zero / \-Z）

将音节时长归零，脚本会自动根据前后音节和字符宽度为它计算合理的时间。

```
{\k10}A{\k10\-zero}        → "A" 时长归零，由脚本自动计算
```

常用于标点符号、半角引号等不需要完整时长的字符。脚本会智能检测引号方向（前引号对齐后一音节，后引号对齐前一音节）。

**支持情况：**

| 脚本 | \-merge/-M | \-text/-T | \-zero/-Z |
|------|:---:|:---:|:---:|
| ass2spl | ✅ | ✅ | ✅ |
| ass2ttml | ✅ | ✅ | ✅ |
| ass2ttml.v2 | ✅ | ✅ | ✅ |

---

## ASS 样式约定

三个脚本按 **Style** 字段区分行的用途：

| Style | 用途 | 说明 |
|-------|------|------|
| `orig` | 原始歌词行 | 必需，歌曲的原始语言歌词 |
| `ts` | 翻译行 | 可选的翻译/译文，放在对应 orig 行之后 |
| `roma` | 罗马音行 | 可选的音译/罗马字，放在对应 orig 行之后 |

**行的排列顺序：** 每组歌词按 `orig` → `roma` → `ts` 的顺序排列，以相邻的 `orig` 行作为每个歌词组的开始。

---

## ASS 信息字段

在 Aegisub 的 **脚本信息（Script Info）** 中设定以下字段：

| 字段 | 说明 | 示例 |
|------|------|------|
| `Title` | 歌曲标题 | `Title: 晴天` |
| `Update Details` | 时间偏移量（毫秒） | `Update Details: +500[整体提前500ms]` |
| `Original Script` | 原始歌词语言代码 | `Original Script: zh-Hans` |

时间偏移支持正负值，方括号内的注释会被忽略。

---

## 使用方法

1. 将对应的 `.lua` 脚本文件放入 Aegisub 的 `automation/autoload/` 目录
2. 重启 Aegisub，在 **自动化（Automation）** 菜单中找到对应脚本
3. 按照上述标记约定，在 ASS 字幕中设置 Actor 字段和卡拉OK特效
4. 运行脚本，选择导出路径或复制到剪贴板

TTML V2 还提供了独立的**配置菜单**，可在运行前设置输出路径和 GitHub 账户信息。
