export default defineNuxtConfig({
    devtools: { enabled: false },

    modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/i18n', '@pinia/nuxt'],

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
        vueI18n: './i18n.config.ts',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'i18n_redirected',
            redirectOn: 'root', // recommended for better SEO
        },
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
