<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title>
                <v-flex xs12 md4>
                    <v-avatar
                    v-if="trip.driver.profile.picture.medium_128"
                    size="80"
                    >
                        <v-img
                        :src="trip.driver.profile.picture.medium_128"
                        contain
                        />
                    </v-avatar>
                    <v-flex xs12>
                        <div class="display-1 mb-0 font-weight-thin">
                            {{ trip.driver.first_name }}
                            <v-icon
                            :dark="
                                theme.theme.theme_dark ||
                                    theme.theme.theme_text == 'white--text'
                            "
                            :light="theme.theme.theme_light"
                            size="1em"
                            >
                                {{ genderIcon }}
                            </v-icon>
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            {{ age }} anos
                        </div>
                    </v-flex>
                </v-flex>
                <v-flex xs12 md4>
                    <v-flex hidden-md-and-up xs12 py-4>
                        <v-divider />
                    </v-flex>
                    <v-flex xs12>
                        <div class="headline mb-0 font-weight-thin">
                            Ensino
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            <b>{{
                                getUniversity(trip.driver.student.university)
                            }}</b>
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            <b>{{ capitalize(trip.driver.student.course) }}
                                {{ trip.driver.student.enroll_year }}</b>
                        </div>
                    </v-flex>
                </v-flex>
                <v-flex xs12 md4>
                    <v-flex xs12 hidden-md-and-up py-4>
                        <v-divider />
                    </v-flex>
                    <v-flex xs12>
                        <div class="headline mb-0 font-weight-thin">
                            Preferências
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            <b>Animais:</b>
                            {{ trip.driver.preferences.likes_pets }}
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            <b>Fumar:</b>
                            {{ trip.driver.preferences.likes_smoking }}
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            <b>Conversar:</b>
                            {{ trip.driver.preferences.likes_talking }}
                        </div>
                    </v-flex>
                    <v-flex xs12>
                        <div class="title mb-0 font-weight-thin">
                            <b>Música:</b>
                            {{ trip.driver.preferences.likes_music }}
                        </div>
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
            return map[this.trip.driver.profile.gender]
        },
        age() {
            return this.$moment().diff(
                this.trip.driver.profile.birthday,
                'years',
                false
            )
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
