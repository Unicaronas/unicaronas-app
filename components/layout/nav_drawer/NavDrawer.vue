<template>
    <div>
        <v-navigation-drawer
        v-model="$store.state.showDrawer"
        :dark="$store.state.theme.navColor == 'dark'"
        :light="$store.state.theme.navColor == 'light'"
        fixed
        clipped
        app>
            <v-list>
                <v-list-tile
                v-for="(item, i) in items"
                :to="item.to"
                :key="i"
                :href="item.href"
                router
                nuxt
                exact>
                    <v-list-tile-action>
                        <v-icon v-html="item.icon" />
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title v-text="item.title" />
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="$auth.loggedIn" @click="showThemeDialog = true">
                    <v-list-tile-action>
                        <v-icon>color_lens</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Tema</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider />
                <v-list-tile v-if="$auth.loggedIn" @click="$auth.logout()">
                    <v-list-tile-action>
                        <v-icon>cancel</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Sair</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile v-if="!$auth.loggedIn" @click="$auth.login()">
                    <v-list-tile-action>
                        <v-icon>cake</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>Entrar no Unicaronas</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <ThemeChooser :show-dialog="showThemeDialog"/>
    </div>
</template>
<script>
import ThemeChooser from './ThemeChooser.vue'

export default {
    components: { ThemeChooser },
    data() {
        return {
            showThemeDialog: false
        }
    },
    computed: {
        items() {
            let items = [{ icon: 'home', title: 'Início', to: '/' }]
            if (this.$auth.loggedIn) {
                items.push({
                    icon: 'search',
                    title: 'Pesquisar Caronas',
                    to: '/search'
                })
                items.push({
                    icon: 'add',
                    title: 'Oferecer Caronas',
                    to: '/offer'
                })
                items.push({
                    icon: 'list',
                    title: 'Caronas Pegas',
                    to: '/trips/passenger'
                })
                items.push({
                    icon: 'time_to_leave',
                    title: 'Caronas Oferecidas',
                    to: '/trips/driver'
                })
                items.push({
                    icon: 'notifications',
                    title: 'Seus Alarmes',
                    to: '/alarms'
                })
                items.push({
                    icon: 'account_circle',
                    title: 'Sua Conta',
                    href: process.env.SERVER_URL + '/accounts/profile/'
                })
            }
            return items
        }
    },
    watch: {
        showThemeDialog(n, old) {
            if (!old) {
                setTimeout(() => (this.showThemeDialog = false), 100)
            }
        }
    }
}
</script>
