import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/ranhengzhang' }
    ],

    footer: {
      message: '本作品采用 <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.zh" target="_blank">CC BY-SA 4.0</a> 进行许可。',
      copyright: `© ${new Date().getFullYear()} ranhengzhang`
    }
  }
})
