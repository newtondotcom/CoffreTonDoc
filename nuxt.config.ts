import wasm from 'vite-plugin-wasm';

export default defineNuxtConfig({
    devtools: { enabled: false },

    modules: [
        '@nuxt/ui',
        '@nuxtjs/tailwindcss',
        'shadcn-nuxt',
        '@nuxtjs/i18n',
        '@sidebase/nuxt-auth',
    ],

    auth: {
        provider: {
            type: 'authjs',
        },
    },

    shadcn: {
        prefix: '',
        componentDir: './components/ui',
    },

    tailwindcss: {
        cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'first' }],
        configPath: 'tailwind.config',
        exposeConfig: {
            level: 2,
        },
        viewer: false,
    },

    ssr: false,

    runtimeConfig: {
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_ORIGIN: process.env.AUTH_ORIGIN,
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
        APP_NAME: process.env.APP_NAME,
    },

    compatibilityDate: '2024-07-03',

    vite: {
        plugins: [wasm()],
    },
});
