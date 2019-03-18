<template>
    <v-fade-transition>
        <v-card v-show="installDialog && canInstall" id="installDialog" class="elevation-5">
            <v-container>
                <v-layout>
                    <v-flex xs3>
                        <v-img
                        :src="$store.state.theme.appColor == 'dark' ? '/img/logo_white.svg' : '/img/logo_black.svg'"
                        height="5em"
                        class="mt-4"
                        contain/>
                    </v-flex>
                    <v-flex xs9>
                        <v-card-title primary-title>
                            <div class="headline">Instale o Unicaronas</div><br>
                            <div>Quer adicionar o Unicaronas à sua página principal?</div>
                        </v-card-title>
                    </v-flex>
                </v-layout>
                <v-card-actions>
                    <v-layout justify-end>
                        <v-btn flat color="primary" @click="dontInstallApp()">Não, valeu</v-btn>
                        <v-btn color="primary" @click="installApp()">Quero!</v-btn>
                    </v-layout>
                </v-card-actions>
            </v-container>
        </v-card>
    </v-fade-transition>
</template>
<script>
export default {
    data() {
        return {
            canInstall: false,
            installDialog: false,
            deferredPrompt: null,
            lastScroll: 0
        }
    },
    mounted() {
        if (
            this.$auth.loggedIn &&
            !this.$store.state.installPromptTimeout.timeout
        ) {
            window.addEventListener(
                'beforeinstallprompt',
                this.handleInstallPrompt
            )
        }
    },
    created() {
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    },
    beforeDestroy() {
        window.addEventListener('beforeinstallprompt', this.handleInstallPrompt)
    },
    methods: {
        handleInstallPrompt(e) {
            this.installStatus = 'beforeinstallprompt'
            e.preventDefault()
            this.deferredPrompt = e
            this.canInstall = true
        },
        handleScroll() {
            this.installDialog = this.lastScroll >= window.scrollY
            this.lastScroll = window.scrollY
        },
        installApp() {
            this.deferredPrompt.prompt()
            this.canInstall = false
            this.deferredPrompt.userChoice.then(res => {
                if (res.outcome === 'accepted') {
                    this.$ga.event('install prompt', 'accept')
                } else {
                    this.$store.commit('setPromptTimout')
                }
                window.removeEventListener(
                    'beforeinstallprompt',
                    this.handleInstallPrompt
                )
            })
        },
        dontInstallApp() {
            this.$store.commit('setPromptTimout')
            this.$ga.event('install prompt', 'deny')
            this.canInstall = false
            window.removeEventListener(
                'beforeinstallprompt',
                this.handleInstallPrompt
            )
        }
    }
}
</script>
<style scoped>
#installDialog {
    position: fixed;
    bottom: 0px;
    z-index: 1;
}
</style>
