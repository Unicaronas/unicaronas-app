<template>
    <v-dialog v-model="dialog" persistent max-width="414">
        <v-card>
            <v-card-title class="headline">Topa mudar seu email?</v-card-title>
            <v-card-text class="subheading">Seu email primário é o seu <b>acadêmico</b>. Troque por outro que você entra com mais frequência pra não perder suas notificações de caronas 😊</v-card-text>
            <v-card-actions>
                <v-spacer/>
                <v-btn color="red" flat @click="deny()">Não, valeu</v-btn>
                <v-btn @click="accept()" color="primary">Topo sim!</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    data() {
        return {
            dialog: false,
            SERVER_URL: process.env.SERVER_URL
        }
    },
    mounted() {
        if (
            this.$auth.loggedIn &&
            this.$auth.user.email != this.$auth.user.student.university_email &&
            this.$store.state.extraEmailDialog.dialog
        ) {
            this.dialog = true
        }
    },
    methods: {
        deny() {
            this.$store.commit('denyExtraEmailDialog')
            this.dialog = false
        },
        accept() {
            this.$ga.event('user', 'change_email')
            window.location.href = this.SERVER_URL + '/accounts/email/'
        }
    }
}
</script>
