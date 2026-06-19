// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'
import ImageCompareSlider from './components/ImageCompareSlider.vue'
import ImageCarousel from './components/ImageCarousel.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('ImageCompareSlider', ImageCompareSlider)
    app.component('ImageCarousel', ImageCarousel)
  }
} satisfies Theme
