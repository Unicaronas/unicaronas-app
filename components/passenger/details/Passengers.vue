<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title>
                <v-flex pb-0 xs12>
                    <h3 class="display-1 font-weight-thin">Passageiros aprovados</h3>
                </v-flex>
            </v-card-title>
            <v-divider/>
            <v-card-text v-if="trip.status != 'approved'">
                <v-flex pb-0 xs12>
                    <h3 class="title font-weight-thin">Dados dos passageiros não estão disponíveis</h3>
                </v-flex>
            </v-card-text>
            <v-list v-else :dark="theme.theme.theme_dark || theme.theme.theme_text == 'white--text'" :light="theme.theme.theme_light" :class="[theme.theme.theme_color, theme.theme.theme_modifier]" two-line>
                <template v-for="(passenger, i) in trip.approved_passengers">
                    <Passenger :key="i" :passenger="passenger"/>
                    <v-divider
                    v-if="i + 1 < trip.approved_passengers.length"
                    :key="i"
                    />
                </template>
            </v-list>
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
    }
}
</script>
