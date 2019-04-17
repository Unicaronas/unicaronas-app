<template>
    <div>
        <BaseCard>
            <template slot="card" slot-scope="theme">
                <v-card-title primary-title>
                    <v-flex pb-0 xs6>
                        <h3 class="display-2 text-xs-center">
                            R${{ trip.price }}
                        </h3>
                        <label
                        :class="{
                            'text--lighten-2':
                                theme.theme.theme_text == 'white--text',
                            'text--darken-2':
                                theme.theme.theme_text == 'black--text'
                        }"
                        aria-hidden="true"
                        class="v-label text-xs-center grey--text"
                        style="left: 0px; right: auto; position: relative;"
                        ><div>Por vaga</div></label>
                    </v-flex>
                    <v-flex pb-0 xs6>
                        <h3 class="display-2 text-xs-center">
                            {{ trip.seats_left }}
                        </h3>
                        <label
                        :class="{
                            'text--lighten-2':
                                theme.theme.theme_text == 'white--text',
                            'text--darken-2':
                                theme.theme.theme_text == 'black--text'
                        }"
                        aria-hidden="true"
                        class="v-label text-xs-center grey--text"
                        style="left: 0px; right: auto; position: relative;"
                        ><div>
                            Vaga{{ trip.seats_left != 1 ? 's' : '' }}
                            sobrando
                        </div></label>
                    </v-flex>
                    <v-flex xs12 pt-3>
                        <v-flex xs12>
                            <v-divider />
                        </v-flex>
                        <v-container>
                            <v-flex xs12 text-xs-center>
                                <div
                                class="headline text-xs-center font-weight-thin"
                                >
                                    {{
                                        trip.auto_approve
                                            ? 'Aprovação automática'
                                            : 'Aprovação manual'
                                    }}
                                </div>
                                <br>
                                <v-btn
                                v-if="
                                    $moment(trip.datetime).isAfter(
                                        $moment()
                                    )
                                "
                                ripple
                                color="error"
                                @click="dialog = true"
                                >
                                    Apagar Carona
                                </v-btn>
                            </v-flex>
                        </v-container>
                    </v-flex>
                </v-card-title>
            </template>
        </BaseCard>
        <v-dialog v-model="dialog" :persistent="deleting" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Apagar carona?
                    </v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Tem certeza? Não há como recuperá-la!
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer />

                        <v-btn
                        v-if="!deleting"
                        color="primary"
                        flat="flat"
                        @click="dialog = false"
                        >
                            Não, pera
                        </v-btn>

                        <v-btn
                        :loading="deleting"
                        :disabled="deleting"
                        color="error"
                        flat="flat"
                        @click="deleteTrip()"
                        >
                            Apagar!
                        </v-btn>
                    </v-card-actions>
                </v-container>
            </v-card>
        </v-dialog>
        <v-dialog v-model="deleted" max-width="450" persistent>
            <v-card>
                <v-container>
                    <v-card-text
                    class="display-1 font-weight-thin text-xs-center"
                    >
                        Pronto!
                    </v-card-text>
                    <v-card-text class="text-xs-center">
                        <v-btn color="primary" to="/trips/driver">
                            voltar
                        </v-btn>
                    </v-card-text>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
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
            deleting: false,
            deleted: false,
            dialog: false
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
    },
    methods: {
        async deleteTrip() {
            this.deleting = true
            try {
                let endpoint = this.trip.url
                let payload = {
                    method: 'delete',
                    url: endpoint
                }
                await this.$auth.request(payload)
                this.$store.commit('significantEvent/trigger')
                this.$ga.event('trips', 'delete')
                this.dialog = false
                this.deleted = true
            } catch (err) {}
            this.deleting = false
        }
    }
}
</script>
