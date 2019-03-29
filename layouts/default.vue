<template>
    <v-app
    :dark="$store.state.theme.appColor == 'dark'"
    :light="$store.state.theme.appColor == 'light'"
    >
        <NavDrawer />
        <Toolbar />
        <v-content>
            <nuxt />
        </v-content>
        <InstallPrompt />
        <EmailDialog />
        <Footer />
    </v-app>
</template>
<script>
import Toolbar from '~/components/layout/toolbar/Toolbar.vue'
import NavDrawer from '~/components/layout/nav_drawer/NavDrawer.vue'
import Footer from '~/components/layout/footer/Footer.vue'
import InstallPrompt from '~/components/layout/installPrompt/InstallPrompt.vue'
import EmailDialog from '~/components/layout/extraEmailDialog/extraEmailDialog.vue'

export default {
    components: {
        Toolbar,
        NavDrawer,
        Footer,
        InstallPrompt,
        EmailDialog
    }
}
</script>
