# Append Folder (导入文件夹)

用于一次性导入文件夹中所有音频文件并自动创建播放列表。

> [!CAUTION]
>
> 由于 AMLL Player 已经更新使用后端存储播放列表等数据，如果使用的是旧版本的 AMLL Player 请回退到旧提交并自行编译。

## 下载

- 从 [Github Actions](https://github.com/ranhengzhang/amll-player-append-folder/actions/workflows/auto-build.yml) 页面下载自动构建的结果；
- 克隆 [仓库](https://github.com/ranhengzhang/amll-player-append-folder) 到本地之后，执行 `pnpm i & pnpm build` 命令。

## 安装

将 `.js` 文件复制到 AMLL Player 插件文件夹中，重启 AMLL Player。

## 使用

![image-20260619014544274](/amll-plugins/img/append-folder/image-20260619014544274.png)

粘贴或点击按钮选择目标文件夹后，选择自动创建播放列表的方式，按下「开始导入」按钮后等待导入完成。

> 支持按照「歌手」「专辑」「文件夹名」自动创建播放列表，也可以选择直接附加到已有播放列表中。