const pkg = require('./package')

require('dotenv').config()

module.exports = {
    mode: 'spa',

    /*
     ** Headers of the page
     */
    head: {
        title: process.env.APP_NAME,
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: pkg.description
            }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            {
                rel: 'stylesheet',
                href:
                    'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
            },
            {
                rel: 'stylesheet',
                href: 'https://use.fontawesome.com/releases/v5.5.0/css/all.css'
            }
        ]
    },

    /*
     ** Customize the progress-bar color
     */
    loading: { color: '#fff' },

    /*
     ** Global CSS
     */
    css: [
        '~/assets/style/app.styl',
        '~/assets/style/light_and_dark_links.scss'
    ],

    /*
     ** Plugins to load before mounting the App
     */
    plugins: [
        '@/plugins/vuetify',
        { src: '~/plugins/localStorage.js', ssr: false },
        { src: '~/plugins/cookieStorageSession.js', ssr: false },
        { src: '~/plugins/cookieStorage7.js', ssr: false },
        { src: '~/plugins/cookieStorage30.js', ssr: false },
        { src: '~/plugins/universityMap', ssr: false},
        { src: '~/plugins/tripData', ssr: false},
        { src: '~/plugins/googleAutocomplete', ssr: false}
    ],

    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://github.com/nuxt-community/axios-module#usage
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
        '@nuxtjs/auth',
        '@nuxtjs/dotenv',
        'nuxt-clipboard2',
        '@nuxtjs/pwa',
        [
            '@nuxtjs/google-analytics',
            {
                id: process.env.GOOGLE_ANALYTICS,
                autoTracking: {
                    exception: true
                },
                debug: {
                    sendHitTask: process.env.NODE_ENV === 'production'
                }
            }
        ],
        [
            'nuxt-validate',
            {
                lang: 'pt_BR',
                locale: 'pt_BR'
            }
        ],
        'nuxt-device-detect',
        ['~/plugins/moment', ['pt-br']],
        [
            'nuxt-facebook-pixel-module',
            {
                /* module options */
                track: 'PageView',
                pixelId: process.env.FACEBOOK_PIXEL_ID,
                disabled: false
            }
        ],
        'nuxt-google-maps-module'
    ],
    /*
     ** Axios module configuration
     */
    axios: {
        // See https://github.com/nuxt-community/axios-module#options
    },

    /*
     ** Build configuration
     */
    build: {
        watch: ['api', 'db', 'webhooks'],
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {
            // Run ESLint on save
            if (ctx.isDev && ctx.isClient) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                    options: {
                        fix: true
                    }
                })
            }
        }
    },
    /*
     * Router definitions
     */
    router: {
        middleware: ['auth']
    },
    serverMiddleware: [
        '~/webhooks/index.js',
        '~/api/index.js',
        '~/db/index.js'
    ],
    env: {
        SERVER_URL: process.env.SERVER_URL,
        API_VERSION: process.env.API_VERSION,
        CLIENT_ID: process.env.CLIENT_ID,
        APP_NAME: process.env.APP_NAME,
        BASE_URL: process.env.BASE_URL,
        GOOGLE_AUTOCOMPLETE_KEY: process.env.GOOGLE_AUTOCOMPLETE_KEY
    },

    // Sentry stuff
    sentry: {
        public_key: process.env.SENTRY_KEY,
        project_id: process.env.SENTRY_ID,
        config: {
            // Additional config
        }
    },

    // PWA options
    meta: {
        name: process.env.APP_NAME,
        theme_color: '#2979FF',
        lang: 'pt-BR',
        ogHost: 'https://app.unicaronas.com',
        ogImage: '/img/og-image.jpg',
        nativeUI: true
    },
    manifest: {
        name: process.env.APP_NAME,
        short_name: 'Unicaronas',
        theme_color: '#2979FF',
        lang: 'pt-BR'
    },

    // Google Maps settings
    maps: {
        key: process.env.GOOGLE_AUTOCOMPLETE_KEY,
        libraries: ['places&language=pt-BR&region=BR']
    },

    // OAuth2 options
    auth: {
        redirect: {
            callback: '/oauth/callback/'
        },
        strategies: {
            unicaronas: {
                _scheme: 'oauth2',
                authorization_endpoint:
                    process.env.SERVER_URL + '/o/authorize/',
                access_token_endpoint: process.env.SERVER_URL + '/o/token/',
                refresh_endpoint: process.env.SERVER_URL + '/o/token/',
                userinfo_endpoint:
                    process.env.SERVER_URL +
                    '/api/' +
                    process.env.API_VERSION +
                    '/user/',
                scope: [
                    'basic:read',
                    'profile:read',
                    'phone:read',
                    'email:read',
                    'student:read',
                    'driver:read',
                    'driver:preferences:read',
                    'alarms:read',
                    'alarms:write',
                    'trips:read',
                    'trips:driver:read',
                    'trips:driver:write',
                    'trips:passenger:read',
                    'trips:passenger:write'
                ],
                response_type: 'code',
                client_id: process.env.CLIENT_ID,
                grant_type: 'authorization_code',
                token_key: 'access_token',
                token_type: 'Bearer'
            },
            local: false
        },
        resetOnError: false,
        fullPathRedirect: true,
        rewriteRedirects: true
    }
}
