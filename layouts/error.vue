<template>
    <v-container fluid fill-height>
        <v-layout align-center justify-center>
            <v-layout row wrap>
                <v-flex d-flex xs12>
                    <v-icon size="7em">
                        error_outline
                    </v-icon>
                </v-flex>
                <v-flex d-flex xs12>
                    <h1 class="display-2 font-weight-thin mb-3 text-xs-center">
                        {{ code }}
                    </h1>
                </v-flex>
                <v-flex d-flex xs12>
                    <h1 class="header font-weight-thin mb-3 text-xs-center">
                        {{ message
                        }}<template v-if="code == 404">
                            <br>Ela provavelmente foi apagada por seu motorista :(
                        </template>
                        <template v-if="code != 400">
                            <br>Com problemas? Manda um
                            <a href="mailto:contato@unicaronas.com">email</a> ou
                            fala pelo
                            <a href="https://telegram.me/maronato">Telegram</a>
                        </template>
                    </h1>
                </v-flex>
            </v-layout>
        </v-layout>
    </v-container>
</template>

<script>
export default {
    props: {
        error: {
            type: Object,
            default: null
        }
    },
    head() {
        return {
            title: this.message
        }
    },
    computed: {
        message() {
            return this.error.message || `<%= messages.client_error %>`
        },
        code() {
            return (this.error && this.error.statusCode) || 500
        }
    }
}
</script>
