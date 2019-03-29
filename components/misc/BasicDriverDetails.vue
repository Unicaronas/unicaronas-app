<template>
    <v-layout row justify-center>
        <template v-if="$device.isMobile">
            <v-dialog
            v-model="dialog"
            fullscreen
            hide-overlay
            transition="dialog-bottom-transition"
            >
                <v-card>
                    <v-toolbar dark color="primary">
                        <v-btn icon dark @click.native="dialog = false">
                            <v-icon>close</v-icon>
                        </v-btn>
                        <v-toolbar-title>Sobre {{ firstName }}</v-toolbar-title>
                    </v-toolbar>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex xs12>
                                <v-card-text class="headline font-weight-light">
                                    {{ capitalize(genderNoun) }} tem
                                    {{ yearsOld }} anos e estuda
                                    {{ item.driver.student.course }} na
                                    {{ capitalUniversity }} desde
                                    {{ item.driver.student.enroll_year }}.
                                    <br>
                                    <br>
                                    {{ capitalize(petText) }}. Sobre cigarro,
                                    {{ smokingText }}.
                                    {{ capitalize(musicText) }} e
                                    {{ talkingText }}.
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-dialog>
        </template>
        <template v-else>
            <v-dialog v-model="dialog" max-width="500">
                <v-card>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex xs12>
                                <v-card-title
                                class="display-1 font-weight-thin"
                                >
                                    Sobre {{ firstName }}
                                </v-card-title>
                            </v-flex>
                            <v-flex d-flex xs12>
                                <v-card-text class="title font-weight-light">
                                    {{ capitalize(genderNoun) }} tem
                                    {{ yearsOld }} anos e estuda
                                    {{ item.driver.student.course }} na
                                    {{ capitalUniversity }} desde
                                    {{ item.driver.student.enroll_year }}.
                                    <br>
                                    <br>
                                    {{ capitalize(petText) }} Sobre cigarro,
                                    {{ smokingText }}.
                                    {{ capitalize(musicText) }} e
                                    {{ talkingText }}.
                                </v-card-text>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-dialog>
        </template>
    </v-layout>
</template>
<script>
export default {
    props: {
        showDialog: {
            type: Boolean,
            required: true
        },
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.item.datetime).calendar()
        },
        capitalUniversity() {
            return this.getUniversity(this.item.driver.student.university)
        },
        yearsOld() {
            return this.$moment().diff(
                this.item.driver.profile.birthday,
                'years',
                false
            )
        },
        genderNounEnd() {
            let map = {
                male: 'o',
                female: 'a',
                other: 'x',
                na: 'x'
            }
            return map[this.item.driver.profile.gender]
        },
        genderNounEnd2() {
            let map = {
                male: 'e',
                female: 'a',
                other: 'x',
                na: 'x'
            }
            return map[this.item.driver.profile.gender]
        },
        genderNoun() {
            let map = {
                male: 'ele',
                female: 'ela',
                other: 'elx',
                na: 'elx'
            }
            return map[this.item.driver.profile.gender]
        },
        firstName() {
            return this.item.driver.first_name
        },
        petText() {
            let map = {
                'Animais não, por favor':
                    'se você tiver um pet, não é uma boa ideia trazer pra a carona.',
                'Depende do animal':
                    'se você estiver pensando em levar um pet, fala com ' +
                    this.genderNoun +
                    ' antes, pois ' +
                    this.genderNoun +
                    ' só deixa alguns!',
                'Adoro animais!':
                    'tem pets? ' + this.firstName + ' aceita todos!'
            }
            return map[this.item.driver.preferences.likes_pets]
        },
        smokingText() {
            let map = {
                'Cigarro não, por favor': 'não é uma boa fumar nessa carona',
                'Às vezes permito fumar':
                    'antes de abrir um maço, bate um papo com ' +
                    this.firstName +
                    ' pra confirmar se pode',
                'Cigarro não me incomoda': 'é super de boa aqui'
            }
            return map[this.item.driver.preferences.likes_smoking]
        },
        musicText() {
            let map = {
                'Curto silêncio': 'o silêncio é uma virtude nesse carro',
                'Depende da música':
                    this.firstName + ' tem gostos musicais bem seletivos',
                'Adoro música!':
                    'tem sugestões de música? ' +
                    this.capitalize(this.genderNoun) +
                    ' aceita todas'
            }
            return map[this.item.driver.preferences.likes_music]
        },
        talkingText() {
            let map = {
                'Gosto de paisagens':
                    'é um pouco introspectiv' + this.genderNounEnd,
                'Às vezes curto conversar':
                    'é abert' +
                    this.genderNounEnd +
                    ' a papos, mas curte ficar na del' +
                    this.genderNounEnd2 +
                    ' de vez em quando',
                'Adoro conversar!': 'vai falar a viagem inteira'
            }
            return map[this.item.driver.preferences.likes_talking]
        }
    },
    watch: {
        showDialog(n, o) {
            if (!o) {
                this.dialog = true
            }
        }
    },
    methods: {
        capitalize(text) {
            if (!text) return
            return text.replace(/^\w/, c => c.toUpperCase())
        }
    }
}
</script>
