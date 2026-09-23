import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'

const base = process.env.DOCS_BASE || '/vue-croppa/'

export default defineConfig({
  vite: {
    resolve: {
      alias: [
        { find: /^vue$/, replacement: fileURLToPath(new URL('../node_modules/vue/dist/vue.runtime.esm-bundler.js', import.meta.url)) },
        { find: /^vue\/server-renderer$/, replacement: fileURLToPath(new URL('../node_modules/vue/server-renderer/index.mjs', import.meta.url)) },
      ],
    },
  },
  title: 'Vue Croppa',
  description: 'A simple, customizable, mobile-friendly image cropper for Vue.',
  base,
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', href: `${base}logo.svg`, type: 'image/svg+xml' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Vue Croppa',
    search: { provider: 'local' },
    nav: [
      { text: 'Guide', link: '/v2-guide' },
      { text: 'Live preview', link: '/v2-lab' },
      { text: 'API', link: '/v2-api' },
      {
        text: 'Versions',
        items: [
          { text: 'Vue 3 · v2', link: '/v2-guide' },
          { text: 'Vue 2 · v1 archive', link: '/guide/getting-started' },
          { text: 'v1 examples', link: '/examples/' },
        ],
      },
    ],
    sidebar: {
      '/v2-guide': [
        { text: 'Vue 3', items: [
          { text: 'Guide', link: '/v2-guide' },
          { text: 'Live preview', link: '/v2-lab' },
          { text: 'API', link: '/v2-api' },
        ] },
      ],
      '/v2-api': [
        { text: 'Vue 3', items: [
          { text: 'Guide', link: '/v2-guide' },
          { text: 'Live preview', link: '/v2-lab' },
          { text: 'API', link: '/v2-api' },
        ] },
      ],
      '/v2-lab': [
        { text: 'Vue 3', items: [
          { text: 'Guide', link: '/v2-guide' },
          { text: 'Live preview', link: '/v2-lab' },
          { text: 'API', link: '/v2-api' },
        ] },
      ],
      '/guide/': [
        {
          text: 'Vue 2 · v1 guide',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Input & loading', link: '/guide/input' },
            { text: 'Manipulation & state', link: '/guide/manipulation' },
            { text: 'Output & upload', link: '/guide/output' },
            { text: 'Customization', link: '/guide/customization' },
            { text: 'Troubleshooting', link: '/guide/troubleshooting' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [{ text: 'v1 live demos', link: '/examples/' }],
        },
      ],
      '/api/': [
        {
          text: 'Reference',
          items: [{ text: 'v1 API', link: '/api/' }],
        },
      ],
    },
    outline: { level: [2, 3], label: 'On this page' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/zhanziyang/vue-croppa' },
    ],
    editLink: {
      pattern: 'https://github.com/zhanziyang/vue-croppa/edit/master/site/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the ISC License.',
      copyright: 'Vue Croppa',
    },
  },
})
