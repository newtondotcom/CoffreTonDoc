export default defineNuxtConfig({
    devtools: { enabled: false },

    modules: ['@nuxt/ui', '@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/i18n'],

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

    i18n: {
        vueI18n: './i18n.config.ts', // if you are using custom path, default
    },

    ssr: false,

    runtimeConfig: {
        ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
        APP_NAME: process.env.APP_NAME,

        public: {
            ETH_ADDRESS: process.env.ETH_ADDRESS,
        },
    },

    compatibilityDate: '2024-07-03',
});
