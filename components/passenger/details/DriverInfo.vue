<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title >
                <v-flex xs12>
                    <v-flex xs12>
                        <div class="display-1 mb-0 font-weight-thin"> {{ driver.first_name }} <v-icon
                        :dark="theme.theme.theme_dark || theme.theme.theme_text == 'white--text'"
                        :light="theme.theme.theme_light"
                        size="1em">{{ genderIcon }}</v-icon></div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">{{ age }} anos</div>
                    </v-flex>
                </v-flex>
                <v-flex v-if="trip.status == 'approved'" xs12>
                    <v-flex xs12 py-2>
                        <v-divider />
                    </v-flex>
                    <v-flex xs12>
                        <div class="headline mb-0 font-weight-thin">Contato</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">Celular: <v-tooltip top><span style="cursor: pointer;" slot="activator" @click="copyPhone()"><b>{{ formatPhone(driver.profile.phone) }}</b>  <v-icon>fas fa-copy</v-icon></span><span>{{ copyText }}</span></v-tooltip></div>
                    </v-flex>
                    <v-flex xs12 py-2>
                        <v-divider />
                    </v-flex>
                    <v-flex xs12>
                        <div class="headline mb-0 font-weight-thin">Carro</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>{{ capitalize(driver.driver.car_make) }} {{ capitalize(driver.driver.car_model) }}</b></div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>Cor: </b>{{ capitalize(driver.driver.car_color) }}</div>
                    </v-flex>
                </v-flex>
                <v-flex xs12>
                    <v-flex xs12 py-2>
                        <v-divider />
                    </v-flex>
                    <v-flex xs12>
                        <div class="headline mb-0 font-weight-thin">Ensino</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>{{ getUniversity(driver.student.university) }}</b></div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>{{ capitalize(driver.student.course) }} {{ driver.student.enroll_year }}</b></div>
                    </v-flex>
                </v-flex>
                <v-flex xs12>
                    <v-flex xs12 py-2>
                        <v-divider />
                    </v-flex>
                    <v-flex xs12>
                        <div class="headline mb-0 font-weight-thin">Preferências</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>Animais:</b> {{ driverPrefs.likes_pets }}</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>Fumar:</b> {{ driverPrefs.likes_smoking }}</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>Conversar:</b> {{ driverPrefs.likes_talking }}</div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin"><b>Música:</b> {{ driverPrefs.likes_music }}</div>
                    </v-flex>
                </v-flex>
            </v-card-title>
        </template>
    </BaseCard>
</template>
<script>
import BaseCard from '~/components/cards/BaseCard.vue'

export default {
    components: { BaseCard },
    props: {
        trip: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            copyText: 'copiar'
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.trip.datetime).calendar()
        },
        genderIcon() {
            let map = {
                male: 'fas fa-mars',
                female: 'fas fa-venus',
                na: 'fas fa-rainbow',
                other: 'fas fa-rainbow'
            }
            return map[this.driver.profile.gender]
        },
        age() {
            return this.$moment().diff(
                this.driver.profile.birthday,
                'years',
                false
            )
        },
        driver() {
            if (this.trip.status == 'approved') return this.trip.driver
            return this.trip.driver_basic
        },
        driverPrefs() {
            if (this.trip.status == 'approved') return this.driver.driver
            return this.driver.preferences
        }
    },
    methods: {
        capitalize(text) {
            if (!text) return
            return text.replace(/^\w/, c => c.toUpperCase())
        },
        formatPhone(phone) {
            if (phone.startsWith('+55')) phone = phone.slice(3)
            if (phone.length == 11)
                phone = `(${phone.slice(0, 2)})${phone.slice(
                    2,
                    7
                )}-${phone.slice(7)}`
            else if (phone.length == 9)
                phone = `${phone.slice(0, 5)}-${phone.slice(5)}`
            return phone
        },
        copyPhone() {
            this.$copyText(this.formatPhone(this.driver.profile.phone))
            this.copyText = 'copiado!'
        }
    }
}
</script>
