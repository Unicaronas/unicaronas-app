<template>
    <v-toolbar
    :dark="$store.state.theme.toolbarColor == 'dark'"
    :light="$store.state.theme.toolbarColor == 'light'"
    fixed
    prominent
    clipped-left
    app
    >
        <v-toolbar-side-icon v-if="isMounted" @click="toggleDrawer()" />
        <v-avatar tile>
            <template v-if="!isMounted">
                <v-img contain>
                    <v-progress-circular
                    color="blue"
                    :size="46"
                    indeterminate
                    />
                </v-img>
            </template>
            <v-img
            v-else
            :src="
                $store.state.theme.toolbarColor == 'dark'
                    ? '/img/logo_white.svg'
                    : '/img/logo_black.svg'
            "
            contain
            />
        </v-avatar>
        <v-toolbar-title v-text="title" />
        <v-spacer />
        <v-toolbar-items v-if="$auth.loggedIn" class="hidden-md-and-down">
            <v-menu :nudge-width="100">
                <v-toolbar-title slot="activator">
                    <v-avatar
                    v-if="user.profile && user.profile.picture.original"
                    size="50"
                    >
                        <v-img
                        :src="user.profile.picture.small_64"
                        contain
                        />
                    </v-avatar>
                    <span v-else>{{
                        user.first_name ? 'Olá, ' + user.first_name + '!' : ''
                    }}</span>
                    <v-icon>arrow_drop_down</v-icon>
                </v-toolbar-title>

                <v-list>
                    <v-list-tile :href="SERVER_URL + '/accounts/profile/'">
                        <v-list-tile-title>
                            Sua conta
                            <v-icon size="20">
                                launch
                            </v-icon>
                        </v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="$auth.logout()">
                        <v-list-tile-title>
                            Sair
                        </v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar-items>
        <v-toolbar-items v-if="!$auth.loggedIn" class="hidden-sm-and-down">
            <v-btn flat @click="$auth.login()">
                Entrar no Unicaronas
            </v-btn>
        </v-toolbar-items>
    </v-toolbar>
</template>
<script>
export default {
    data() {
        return {
            isMounted: false,
            title: '',
            SERVER_URL: process.env.SERVER_URL
        }
    },
    computed: {
        user() {
            if (this.$auth.user) {
                return this.$auth.user
            }
            return {}
        }
    },
    mounted() {
        this.isMounted = true
    },
    methods: {
        toggleDrawer() {
            this.$store.commit('toggleDrawer')
        }
    }
}
</script>
