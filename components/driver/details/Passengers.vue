<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title>
                <v-flex pb-0 xs12>
                    <h3 class="display-1 font-weight-thin">
                        <span v-if="!passengers.length">Sem</span> Passageiros
                        <v-btn
                        v-if="passengers.length"
                        :to="`/trips/driver/${trip.id}/passengers/`"
                        outline
                        color="primary"
                        nuxt
                        >
                            Ver todos
                        </v-btn>
                    </h3>
                </v-flex>
            </v-card-title>
            <template v-if="passengers.length">
                <v-divider />
                <v-list
                :dark="
                    theme.theme.theme_dark ||
                        theme.theme.theme_text == 'white--text'
                "
                :light="theme.theme.theme_light"
                :class="[
                    theme.theme.theme_color,
                    theme.theme.theme_modifier
                ]"
                two-line
                >
                    <template v-for="(passenger, i) in passengers">
                        <Passenger
                        :key="i"
                        :passenger="passenger"
                        @passengerModified="passengerModified()"
                        />
                        <v-divider v-if="i + 1 < passengers" :key="i" />
                    </template>
                </v-list>
            </template>
        </template>
    </BaseCard>
</template>

<script>
import BaseCard from '~/components/cards/BaseCard.vue'
import Passenger from './Passenger.vue'

export default {
    components: { BaseCard, Passenger },
    props: {
        trip: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            passengers: []
        }
    },
    async mounted() {
        this.passengers = await this.loadPassengers()
    },
    methods: {
        loadPassengers() {
            let endpoint = this.trip.passengers
            return this.$auth
                .request(endpoint)
                .then(res => {
                    return res.results
                })
                .catch(e => {
                    return []
                })
        },
        async passengerModified() {
            this.passengers = await this.loadPassengers()
            this.$emit('passengerModified')
        }
    }
}
</script>
