<template>
    <v-dialog v-model="dialog" persistent max-width="414">
        <v-card>
            <v-card-title class="headline">
                Adicione sua foto! 📷
            </v-card-title>
            <v-card-text class="subheading">
                Você ainda não colocou sua foto de perfil aqui no Unicaronas. Que tal colocar agora? É rapidinho! 😊
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn :disabled="load" color="red" flat @click="deny()">
                    Me lembre depois
                </v-btn>
                <v-btn
                :loading="load"
                :disabled="load"
                color="primary"
                @click="accept()"
                >
                    Adicionar!
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialog: false,
            load: false,
            SERVER_URL: process.env.SERVER_URL
        }
    },
    mounted() {
        window.setTimeout(() => {
            if (
                this.$auth.loggedIn &&
                !this.$auth.user.profile.picture.original &&
                this.$store.state.profilePicDialog.dialog
            ) {
                this.dialog = true
            }
        }, 1000)
    },
    methods: {
        deny() {
            this.$store.commit('profilePicDialog/deny')
            this.dialog = false
            this.$ga.event('profile pic dialog', 'deny')
        },
        accept() {
            this.$ga.event('profile pic dialog', 'accept')
            this.load = true
            window.location.href = this.SERVER_URL + '/accounts/profile/edit/'
        }
    }
}
</script>
