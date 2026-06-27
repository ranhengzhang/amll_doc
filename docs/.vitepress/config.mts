import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: '/amll_doc/',
  head: [
    ['link', { rel: 'icon', href: '/amll_doc/favicon.ico' }]
  ],
  markdown: {
    math: true
  },
  title: "AMLL Project Document",
  description: "Documents of my own amll-project",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outline: 'deep',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'AMLL Player Plugins', link: '/amll-plugins/' },
      { text: 'Aegisub Automation Scripts', link: '/aegisub-automation/' },
      { text: 'AMLL C++ Qt', link: '/amll-cpp-qt/' }
    ],

    sidebar: [
      {
        text: 'AMLL Plugins',
        items: [
          { text: '总览', link: '/amll-plugins/' },
          { text: 'UI Reset', link: '/amll-plugins/ui-reset' },
          { text: 'Font Plus', link: '/amll-plugins/font-plus' },
          { text: 'Append Folder', link: '/amll-plugins/append-folder' }
        ]
      },
      {
        text: 'Aegisub Automation Scripts',
        items: [
          { text: '总览', link: '/aegisub-automation/' },
          { text: 'Ass → Lyric', link: '/aegisub-automation/ass2lyric' },
          { text: 'Helper Scripts', link: '/aegisub-automation/helper-scripts' },
          { text: 'Other Scripts', link: '/aegisub-automation/other-scripts' }
        ]
      },
      {
        text: 'AMLL C++ Qt 项目',
        items: [
          { text: '总览', link: '/amll-cpp-qt/' },
          { text: 'LyricParser', link: '/amll-cpp-qt/lyric-parser' },
          { text: 'TTML Trans Tool', link: '/amll-cpp-qt/ttml-tool' },
          { text: 'TTML Converter', link: '/amll-cpp-qt/ttml-converter' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ranhengzhang' }
    ],

    footer: {
      message: '本作品采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh" target="_blank">CC BY-SA 4.0</a> 进行许可。<br>Bilibili <a href="https://space.bilibili.com/79936905" target="_blank">@普拉诺格涅斯(Πλανηγενής)</a>。',
      copyright: `© ${new Date().getFullYear()} ranhengzhang`
    }
  }
})
