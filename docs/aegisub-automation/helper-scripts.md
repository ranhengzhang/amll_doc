# 辅助脚本

本目录下的 Lua 脚本用于 Aegisub 自动化，辅助 AMLL 歌词制作工作流。脚本需放置在 Aegisub 的 `automation/autoload/` 目录下。

所有脚本的 GitHub 源文件链接格式为 `https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/<脚本名>.lua`。

## 标记与标签

### add-num — 添加行编号

**源码：** [add-num.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/add-num.lua)

为所有 `orig` 行自动添加序号标记（`L_1`、`L_2` 等），写入到 `actor` 字段中。非 `orig` 行或背景行会被标记为 `____`。遇到 `x-chor` 标记时序号会自动 +2（为合唱行预留位置）。

**使用方法：**
- 直接运行「Add line num - 添加行编号」宏，无需选中行
- 作用于整个字幕文件的所有行

### add-tag — 添加 TTML 标记

**源码：** [add-tag.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/add-tag.lua)

为选中行的 `actor` 字段添加 TTML 标记。

**支持的标记：**

| 标记 | 含义 | 适用行样式 |
|------|------|-----------|
| `x-bg` | 背景和声 | orig |
| `x-duet` | 对唱 | orig |
| `x-solo` | 独唱 | orig |
| `x-anti` | 反声 | orig |
| `x-fade` | 淡入淡出 | orig |
| `x-whis` | 气声/耳语 | orig |
| `x-chor` | 合唱 | orig |
| `x-other` | 其它 | orig |
| `x-person` | 个人 | orig |
| `x-group` | 团体 | orig |
| `x-role` | 角色（需填值） | orig |
| `x-lang` | 语言（需填值） | ts / roma |
| `x-replace` | 替换标记 | ts / roma |

**使用方法：**
1. 选中需要标记的行
2. 运行「Add TTML Tag - 添加 TTML 标记」宏
3. 在下拉框中选择标记类型
4. 如需要（`x-lang`、`x-role` 等），填写对应的值

### set-part — 标记歌词部分

**源码：** [set-part.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/set-part.lua)

为选中行添加 `x-part` 标记，用于标注歌词的段落类型（主歌、副歌等）。

**支持的段落类型：**
- Verse（主歌）
- Chorus（副歌）
- PreChorus（预副歌）
- Rise（短推）
- Bridge（桥段）
- Intro（前奏）
- Outro（尾奏）
- Refrain（叠句）
- Instrumental（器乐）
- Interlude（间奏）
- Transition（过渡）
- Hook（钩子）
- Reprise（再现）
- DevelopedChorus（发展副歌）
- FalseChorus（伪副歌）
- FinalChorus（最终副歌）

**使用方法：**
1. 选中 **1 行** `orig` 样式且非 `x-bg` 的行
2. 运行「Set Part - 标记歌词部分」宏
3. 在下拉框中选择段落类型，点击 Set

### set-role — 设置角色

**源码：** [set-role.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/set-role.lua)

分为两个子菜单：**设置**（配置角色列表）和**标记**（应用角色到选中行）。

**设置角色列表：**
1. 运行「Set Role/设置」
2. 在输入框中填写角色名称，可点击「添加」增加条目、「删除」移除最后一个条目
3. 点击「确认」保存列表

**标记角色：**
1. 选中 `orig` 行
2. 运行「Set Role/标记」
3. 勾选要分配的角色（支持多选）
4. 点击「确认」，`x-role:"角色名"` 将被写入 `actor` 字段

## 时间同步

### auto-sync-time — 自动逐字同步

**源码：** [auto-sync-time.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/auto-sync-time.lua)

根据 `orig` 行中的 `{\k...}` 时间标签，自动将翻译行（`ts`）或罗马音行（`roma`）的文本按字符/音节拆分并同步对应的时间码。包含三个子功能：

- **auto sync translation**：处理 `ts`（翻译）行，按字符逐个匹配 `\k` 标签，适用于中文繁简体之间的逐字翻译
- **auto sync translation/japan**：处理 `roma`（罗马音）行，适用于日语，按假名音节拆分匹配
- **auto sync translation/other**：处理 `roma`（罗马音）行，通用模式，按空格分词匹配，适用于韩语、汉语等一字一音的语言

**工作原理：**
将翻译/音译行的文本逐词（或逐音节）替换原始 `\k` 标签中的时间码，生成带时间的逐词歌词。原有的翻译/音译行会被注释掉，新生成的同步行会被插入。

**使用方法：**
1. 确保 `orig` 行已打好 `{\k...}` 时间标签
2. 确保紧跟在每个 `orig` 行之后有对应的 `ts` 或 `roma` 行
3. 选中需要处理的区域
4. 运行对应的子宏

## 导出与复制

### original-copy — 复制原文

**源码：** [original-copy.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/original-copy.lua)

将选中行的原文（`orig` 样式）复制到系统剪贴板。支持添加行号和段落标记。

**使用方法：**
1. 选中需要复制的行
2. 运行「copy original text - 复制原文」宏
3. 选择「是」添加行号和 `x-part` 段落标记，或「否」仅复制纯文本
4. 如剪贴板写入失败，会弹出文本框供手动复制

### original-copy-all — 复制所有原文

**源码：** [original-copy-all.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/original-copy-all.lua)

将所有选中行的 `text_stripped`（去除 ASS 标签后的纯文本）复制到剪贴板，不添加编号。

**使用方法：**
1. 选中行
2. 运行「copy all original text - 复制所有原文」宏
3. 若写入失败可手动复制

### pure-amll — AMLL 歌词格式转换（纯文本）

**源码：** [pure-amll.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/pure-amll.lua)

将整个字幕文件中所有 `orig` 行转换为 AMLL TTML 格式的歌词并复制到剪贴板。TTML 中包含逐音节的时间标签（`<span begin="..." end="...">`）。

**使用方法：**
- 直接运行「Pure TTML - AMLL歌词格式转换(纯文本)」宏，无需选中行
- 生成的 TTML 会自动写入剪贴板

### pure-sel-amll — AMLL 歌词格式转换（选中部分）

**源码：** [pure-sel-amll.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/pure-sel-amll.lua)

与 `pure-amll` 功能相同，但仅转换选中的 `orig` 行。会校验选中的行是否合法（必须是 `orig` 样式且效果为空或 `karaoke`）。

**使用方法：**
1. 选中需要导出的 `orig` 行
2. 运行「Pure TTML - AMLL歌词格式转换(选中部分)」宏
3. 生成的 TTML 写入剪贴板

## 重置

### reset-line — 还原行内容

**源码：** [reset-line.lua](https://github.com/ranhengzhang/amll-ttml-db-raw-data/raw/refs/heads/main/aegisub/reset-line.lua)

一键还原字幕行的状态：
- 删除所有 `effect` 为 `fx` 的行
- 将 `orig`、`ts`、`roma` 样式的行取消注释（恢复为非注释行）

通常在完成时间同步或测试后使用，用于恢复到初始可编辑状态。

**使用方法：**
- 直接运行「reset line - 还原行内容」宏，作用于整个字幕文件
