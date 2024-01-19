import { defineConfig } from 'vitepress'

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
    title: 'PayPax JS | PayPay Library',
    description: 'PayPay operations can be automated | PayPax JS',
    head: [
        ['link', { rel: 'icon', type: 'image/png', href: '../public/favicon.png' }],
        ['meta', { name: 'og:image', content: '../public/favicon.png' }],
        ['meta', { name: 'og:title', content: 'PayPax JS | PayPay Library' }],
        ['meta', { name: 'og:description', content: 'PayPay operations can be automated | PayPax JS' }],
        ['meta', { name: 'og:site_name', content: 'PayPax JS | PayPay Library' }],
        ['meta', { name: 'og:type', content: 'website' }],
        ['meta', { name: 'twitter:image', content: '../public/favicon.png' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:site', content: '@amex2189' }],
        ['meta', { name: 'twitter:creator', content: '@amex2189' }],
        ['meta', { name: 'twitter:title', content: 'PayPax JS | PayPay Library' }],
        ['meta', { name: 'twitter:description', content: 'PayPay operations can be automated | PayPax JS' }],
    ],
    base: "/docs",
})
