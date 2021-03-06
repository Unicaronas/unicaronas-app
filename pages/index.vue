<template>
    <!-- Page -->
    <v-container pa-0 fluid>
        <!-- Layout -->
        <v-layout row wrap>
            <!-- Hero row -->
            <v-flex d-flex xs12>
                <!-- Big text column -->
                <v-layout row>
                    <v-flex ref="heroCard" class="hero" d-flex xs12 lg5>
                        <v-card color="primary" dark>
                            <v-container fill-height fluid>
                                <v-layout
                                class="hero-text"
                                align-center
                                justify-center
                                column
                                fill-height
                                >
                                    <h1 class="display-2 font-weight-thin mb-3">
                                        A maior plataforma de caronas
                                        universitárias
                                    </h1>
                                    <h4 class="subheading">
                                        O Unicaronas foi construído para atender
                                        às necessidades dos universitários que
                                        precisam ir e voltar de suas
                                        universidades para suas casas aos finais
                                        de semana
                                    </h4>
                                </v-layout>
                            </v-container>
                        </v-card>
                    </v-flex>
                    <v-flex d-flex md12 lg7>
                        <v-parallax
                        :height="heroHeight"
                        class="hidden-sm-and-down"
                        dark
                        src="/img/finger-up.jpeg"
                        />
                    </v-flex>
                </v-layout>
            </v-flex>
            <!-- Separator -->
            <v-container d-flex xs12>
                <v-layout class="vertical-separator" row align-center wrap>
                    <v-flex class="text-xs-center" xs12>
                        <v-icon color="red" size="100">
                            favorite
                        </v-icon>
                    </v-flex>
                    <v-flex xs12>
                        <h1 class="display-3 text-xs-center">
                            Caronas nunca foram tão fáceis
                        </h1>
                    </v-flex>
                    <v-flex class="text-xs-center text-sm-right" mt-5 sm6 xs12>
                        <v-btn color="primary" dark to="/search" vuex large>
                            Pesquisar Caronas
                        </v-btn>
                    </v-flex>
                    <v-flex class="text-xs-center text-sm-left" mt-5 sm6 xs12>
                        <v-btn color="secondary" dark to="/offer" vuex large>
                            Oferecer Caronas
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-container>

            <!-- Carousel -->

            <v-container d-flex xs12>
                <v-layout row align-center>
                    <v-flex xs12 md10 offset-md1 lg8 offset-lg2>
                        <CarouselQuotes :items="carouselItems" />
                    </v-flex>
                </v-layout>
            </v-container>
            <!-- First text row -->
            <v-flex d-flex xs12>
                <!-- Row itself -->
                <v-layout row align-center wrap>
                    <v-flex mt-5 mb-5 xs12 offset-sm1 md4>
                        <v-container>
                            <h1 class="display-3 font-weight-thin">
                                Uma plataforma para a todas unir
                            </h1>
                            <v-subheader>
                                Além das criadas no Unicaronas, pesquise por
                                caronas em grupos de Facebook e no BlaBlaCar
                            </v-subheader>
                            <v-btn
                            to="/search"
                            class="mt-3"
                            round
                            color="secondary"
                            nuxt
                            large
                            dark
                            >
                                Pesquisar caronas
                            </v-btn>
                        </v-container>
                    </v-flex>
                    <v-flex md7 xs12>
                        <v-img
                        :aspect-ratio="18 / 9"
                        src="/img/darjeeling.jpg"
                        class="grey lighten-2"
                        >
                            <v-layout
                            slot="placeholder"
                            fill-height
                            align-center
                            justify-center
                            ma-0
                            >
                                <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                                />
                            </v-layout>
                        </v-img>
                    </v-flex>
                </v-layout>
            </v-flex>

            <!-- Second text row -->
            <v-flex id="second_text_row" d-flex xs12>
                <!-- Row itself -->
                <v-layout row align-center wrap>
                    <v-flex md7 xs12>
                        <v-img
                        :aspect-ratio="18 / 9"
                        src="/img/time.jpg"
                        class="grey lighten-2"
                        >
                            <v-layout
                            slot="placeholder"
                            fill-height
                            align-center
                            justify-center
                            ma-0
                            >
                                <v-progress-circular
                                indeterminate
                                color="grey lighten-5"
                                />
                            </v-layout>
                        </v-img>
                    </v-flex>
                    <v-flex mt-5 mb-5 xs12 md4>
                        <v-container>
                            <h1 class="display-3 font-weight-thin">
                                Tenha suas viagens sob controle
                            </h1>
                            <v-subheader>
                                Controle cada detalhe da sua carona ou coloque
                                no piloto automático e nós cuidaremos de tudo
                                por você
                            </v-subheader>
                            <v-btn
                            to="/offer"
                            class="mt-3"
                            round
                            color="primary"
                            nuxt
                            large
                            dark
                            >
                                Oferecer caronas
                            </v-btn>
                        </v-container>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-container d-flex xs12>
                <v-layout class="vertical-separator" row align-center wrap>
                    <v-flex xs12>
                        <h1 class="display-2 text-xs-center">
                            <template v-if="$auth.loggedIn">
                                Controle sua conta
                            </template>
                            <template v-else>
                                Comece agora
                            </template>
                        </h1>
                    </v-flex>
                    <v-flex class="text-xs-center text-sm-center" mt-5 xs12>
                        <template v-if="$auth.loggedIn">
                            <v-btn
                            :href="SERVER_URL + '/accounts/profile/'"
                            color="primary"
                            dark
                            large
                            >
                                Abrir Minha Conta
                                <v-icon right dark>
                                    launch
                                </v-icon>
                            </v-btn>
                        </template>
                        <template v-else>
                            <v-btn
                            color="primary"
                            dark
                            large
                            @click="$auth.login()"
                            >
                                Experimente o Unicaronas
                            </v-btn>
                        </template>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-layout>
    </v-container>
</template>

<script>
import CarouselQuotes from '~/components/carousel_quotes/CarouselQuotes.vue'

export default {
    components: {
        CarouselQuotes
    },
    data() {
        return {
            SERVER_URL: process.env.SERVER_URL,
            loaded: false,
            carouselItems: [
                {
                    title:
                        '👏🏼👏🏼👏🏼👏🏼 meus parabéns pela iniciativa. Muito amor pelo unicaronas que não só me ajudou a rodar muito mais que o meu dinheiro permitia, mas me fez conhecer muita gente bacana pelo caminho.',
                    author: 'Juliana'
                },
                {
                    title: `Poxa aí sim!!!!

Fiquei viúvo do unicaronas que bom tá voltando! \\o/`,
                    author: 'Thiago'
                },
                {
                    title: `Vai melhorar a vida de muitos!`,
                    author: 'Eliel'
                },
                {
                    title: `Unicaronas voltou \\o/`,
                    author: 'Ramon'
                },
                {
                    title: `Desde o garfolher não existe invenção tão útil!`,
                    author: 'Mateus'
                },
                {
                    title: `Melhor notícia desde o surgimento do carro.`,
                    author: 'Mu'
                },
                {
                    title: `Razões pelas quais a Unicamp é a melhor universidade do Brasil`,
                    author: 'Fernanda'
                }
            ]
        }
    },
    computed: {
        heroHeight() {
            if (this.loaded && this.$refs.heroCard.clientHeight) {
                return this.$refs.heroCard.clientHeight
            }
            return 500
        }
    },
    mounted() {
        this.loaded = true
    },
    options: {
        auth: false
    }
}
</script>

<style scoped>
.vertical-separator {
    margin-top: 10em;
    margin-bottom: 10em;
}
#second_text_row {
    margin-top: 100px;
}
@media only screen and (max-width: 768px) {
    .hero {
        height: 30em;
        max-height: 100vh;
    }
    .display-3 {
        font-size: 40px !important;
    }
}
@media only screen and (min-width: 768px) {
    .hero {
        height: 50em;
        max-height: 80vh;
    }
    .hero-text {
        margin-left: 12em;
    }
}
</style>
