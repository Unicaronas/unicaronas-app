<template>
    <v-footer height="auto" dark class="mt-5 py-4">
        <v-container>
            <v-layout wrap row justify-center>
                <v-flex d-flex xs12 offset-md1 md10>
                    <v-container>
                        <v-layout wrap row justify-center>
                            <v-flex align-center xs12 md5 text-xs-center mr-2>
                                <v-btn
                                v-for="link in links"
                                :key="link.title"
                                :to="link.to"
                                :href="link.href"
                                flat
                                nuxt
                                mdall
                                round
                                >
                                    {{ link.title }}
                                </v-btn>
                            </v-flex>
                            <v-divider vertical hidden-md-and-up />
                            <v-flex
                            py-3
                            text-xs-center
                            text-md-left
                            ml-2
                            md5
                            xs12
                            >
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <h3 class="title font-weight-thin">
                                            Unicaronas App
                                        </h3>

                                        <h3 class="body mt-3 font-weight-thin">
                                            Aplicativo web oficial do Unicaronas
                                        </h3>
                                    </v-flex>
                                </v-layout>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-flex>
                <v-spacer />
                <v-flex xs12 md4 mt-3 text-xs-center>
                    Made with
                    <v-icon color="red" mdall>
                        favorite
                    </v-icon>
                    by
                    <a
                    style="color: white"
                    href="https://github.com/Maronato"
                    >Maronato</a>
                </v-flex>
            </v-layout>
        </v-container>
    </v-footer>
</template>
<script>
export default {
    data: () => ({
        links: [
            { title: 'Início', to: '/' },
            { title: 'Pesquisar', to: '/search' },
            { title: 'Oferecer', to: '/offer' },
            { title: 'O Unicaronas', href: process.env.SERVER_URL },
            {
                title: 'Código fonte',
                href: 'https://github.com/Unicaronas/unicaronas-app'
            },
            {
                title: 'Contato',
                href: 'mailto:contato@unicaronas.com'
            }
        ]
    })
}
</script>
