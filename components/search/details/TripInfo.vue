<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title>
                <div>
                    <h3 class="display-1 mb-3">
                        {{ formattedDatetime }}
                    </h3>
                </div>
                <v-flex pb-0 xs12>
                    <h3 class="headline mb-0">
                        Saída
                    </h3>
                </v-flex>
                <v-flex pt-0 xs12>
                    <div class="title mt-0 mb-3 font-weight-thin">
                        <a :href="originURL" target="_blank">
                            {{
                                trip.origin
                                    .split('-')
                                    .slice(0, 2)
                                    .join('-')
                            }}
                        </a>
                    </div>
                </v-flex>
                <v-flex pb-0 xs12>
                    <h3 class="headline mb-0">
                        Chegada
                    </h3>
                </v-flex>
                <v-flex pt-0 xs12>
                    <div class="title mt-0 mb-3 font-weight-thin">
                        <a :href="destinationURL" target="_blank">
                            {{
                                trip.destination
                                    .split('-')
                                    .slice(0, 2)
                                    .join('-')
                            }}
                        </a>
                    </div>
                </v-flex>
                <v-flex v-if="trip.details" pt-0 xs12>
                    <div class="title mb-3 font-weight-thin">
                        <i><ReadMore :text="trip.details" /></i>
                        - {{ trip.driver.first_name }}
                    </div>
                </v-flex>
            </v-card-title>
        </template>
    </BaseCard>
</template>
<script>
import BaseCard from '~/components/cards/BaseCard.vue'
import ReadMore from '~/components/misc/ReadMore.vue'

export default {
    components: { BaseCard, ReadMore },
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
        originURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.trip.origin_coordinates.latitude +
                ',' +
                this.trip.origin_coordinates.longitude
            )
        },
        destinationURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.trip.destination_coordinates.latitude +
                ',' +
                this.trip.destination_coordinates.longitude
            )
        }
    }
}
</script>
