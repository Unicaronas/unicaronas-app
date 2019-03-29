<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" max-width="600px">
            <v-card>
                <v-container>
                    <v-card-title>
                        <span class="display-2 font-weight-thin">Tema</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout wrap>
                                <v-flex xs12>
                                    <span
                                    class="pb-0 md-0 headline font-weight-thin"
                                    >Geral</span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-radio-group
                                    v-model="app"
                                    row
                                    >
                                        <v-radio label="Escuro" value="dark" />
                                        <v-radio label="Claro" value="light" />
                                    </v-radio-group>
                                </v-flex>
                                <v-flex xs12>
                                    <span
                                    class="pb-0 md-0 headline font-weight-thin"
                                    >Barra superior</span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-radio-group
                                    v-model="toolbar"
                                    row
                                    >
                                        <v-radio label="Escuro" value="dark" />
                                        <v-radio label="Claro" value="light" />
                                    </v-radio-group>
                                </v-flex>
                                <v-flex xs12>
                                    <span
                                    class="headline font-weight-thin"
                                    >Barra lateral</span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-radio-group
                                    v-model="navbar"
                                    row
                                    >
                                        <v-radio label="Escuro" value="dark" />
                                        <v-radio label="Claro" value="light" />
                                    </v-radio-group>
                                </v-flex>
                                <v-flex xs12>
                                    <span
                                    class="headline font-weight-thin"
                                    >Cartões</span>
                                </v-flex>
                                <v-flex xs12>
                                    <v-radio-group
                                    v-model="cards"
                                    row
                                    >
                                        <v-radio label="Escuro" value="dark" />
                                        <v-radio label="Claro" value="light" />
                                        <v-radio
                                        label="Colorido"
                                        value="random"
                                        />
                                    </v-radio-group>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                        color="blue darken-1"
                        flat
                        @click.native="dialog = false"
                        >
                            Fechar
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
export default {
    props: {
        showDialog: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            dialog: false
        }
    },
    computed: {
        toolbar: {
            get() {
                return this.$store.state.theme.toolbarColor
            },
            set(value) {
                this.$store.commit(
                    'theme/setToolbarTheme',
                    value
                )
            }
        },
        navbar: {
            get() {
                return this.$store.state.theme.navColor
            },
            set(value) {
                this.$store.commit(
                    'theme/setNavTheme',
                    value
                )
            }
        },
        cards: {
            get() {
                return this.$store.state.theme.cardColor
            },
            set(value) {
                this.$store.commit(
                    'theme/setCardsTheme',
                    value
                )
            }
        },
        app: {
            get() {
                return this.$store.state.theme.appColor
            },
            set(value) {
                this.$store.commit(
                    'theme/setAppTheme',
                    value
                )
            }
        }
    },
    watch: {
        showDialog(n, o) {
            if (!o) {
                this.dialog = true
            }
        }
    }
}
</script>
