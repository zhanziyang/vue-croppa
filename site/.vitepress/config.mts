import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Vue Croppa',
  description: 'A simple, customizable, mobile-friendly image cropper for Vue.',
  base: '/vue-croppa/',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#0f766e' }],
    ['link', { rel: 'icon', href: '/vue-croppa/logo.svg', type: 'image/svg+xml' }],
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Vue Croppa',
    search: { provider: 'local' },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/' },
      { text: 'API', link: '/api/' },
      {
        text: 'v1.3.8',
        items: [
          { text: 'Vue 2 · current release', link: '/guide/getting-started#version-status' },
          { text: 'Vue 3 · v2 reboot', link: 'https://github.com/zhanziyang/vue-croppa/pull/251' },
        ],
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Input & loading', link: '/guide/input' },
            { text: 'Manipulation & state', link: '/guide/manipulation' },
            { text: 'Output & upload', link: '/guide/output' },
          ],
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [{ text: 'Live demos', link: '/examples/' }],
        },
      ],
      '/api/': [
        {
          text: 'Reference',
          items: [{ text: 'API', link: '/api/' }],
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
