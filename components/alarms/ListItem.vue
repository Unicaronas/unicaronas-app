<template>
    <div>
        <BaseCard>
            <template slot="card" slot-scope="theme">
                <v-card-title primary-title>
                    <div>
                        <v-flex pb-0 xs12>
                            <h3 class="headline mb-0">
                                Intervalo de tempo
                            </h3>
                        </v-flex>
                        <v-flex pt-0 xs12>
                            <div class="title mt-0 mb-3 font-weight-thin">
                                {{ dateTimeString }}
                            </div>
                        </v-flex>
                        <v-flex pb-0 xs12>
                            <h3 class="headline mb-0">
                                Saída aproximada <small>{{ item.origin_radius ? '(+/- ' + item.origin_radius + ' km)' : '' }}</small>
                            </h3>
                        </v-flex>
                        <v-flex pt-0 xs12>
                            <div class="title mt-0 mb-3 font-weight-thin">
                                <a :href="originURL" target="_blank">
                                    {{ item.origin.split('-')[0] }}
                                </a>
                            </div>
                        </v-flex>
                        <v-flex pb-0 xs12>
                            <h3 class="headline mb-0">
                                Chegada aproximada <small>{{ item.destination_radius ? '(+/- ' + item.destination_radius + ' km)' : '' }}</small>
                            </h3>
                        </v-flex>
                        <v-flex pt-0 xs12>
                            <div class="title mt-0 mb-3 font-weight-thin">
                                <a :href="destinationURL" target="_blank">
                                    {{ item.destination.split('-')[0] }}
                                </a>
                            </div>
                        </v-flex>
                        <v-chip
                        v-if="item.price__lte"
                        small
                        color="green"
                        text-color="white"><v-icon left>attach_money</v-icon>&lt;= {{ item.price__lte }} reais
                        </v-chip>
                        <v-chip
                        v-if="item.seats_left__gte"
                        small
                        color="blue"
                        text-color="white">
                            &gt;= {{ item.seats_left__gte }} assento {{ item.seats_left__gte > 1 ? 's' : '' }}
                        </v-chip>
                        <v-chip
                        v-if="item.auto_approve"
                        small
                        color="yellow"
                        text-color="black">
                            <v-icon left>offline_bolt</v-icon>
                            Auto aprovação
                        </v-chip>
                    </div>
                </v-card-title>
                <v-card-actions>
                    <v-container>
                        <v-layout row wrap>
                            <v-flex d-flex sm4/>
                            <v-flex d-flex offset-sm0 sm4/>
                            <v-flex d-flex xs12 sm4>
                                <v-btn
                                :loading="deleting"
                                :disabled="deleting"
                                color="red"
                                class="white--text"
                                ripple
                                raised
                                @click="dialog = true">
                                    Apagar!
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-actions>
            </template>
        </BaseCard>
        <v-dialog v-model="dialog" max-width="450">
            <v-card>
                <v-container>
                    <v-card-text class="display-1 font-weight-thin text-xs-center">Apagar esse alarme?</v-card-text>
                    <v-card-text class="headline font-weight-thin">
                        Tem certeza? Não há como recuperá-lo depois!
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer/>

                        <v-btn color="primary" flat="flat" @click="dialog = false" >
                            Não, pera
                        </v-btn>

                        <v-btn color="error" flat="flat" @click="deleteItem()" >
                            Apagar!
                        </v-btn>
                    </v-card-actions>
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
        item: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            deleting: false
        }
    },
    computed: {
        dateTimeString() {
            if (!this.item.datetime__lte && !this.item.datetime__gte) {
                // No datetimes were defined
                return 'A qualquer momento'
            }
            if (this.item.datetime__gte && !this.item.datetime__lte) {
                // No end time defined
                return (
                    'A partir de ' +
                    this.formatDateTime(this.item.datetime__gte)
                )
            }
            if (!this.item.datetime__gte && this.item.datetime__lte) {
                // No start time defined
                return (
                    'De agora até ' +
                    this.formatDateTime(this.item.datetime__lte)
                )
            }
            // Both defined
            return (
                'De ' +
                this.formatDateTime(this.item.datetime__gte) +
                ' até ' +
                this.formatDateTime(this.item.datetime__lte)
            )
        },
        originURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.item.origin_coordinates.latitude +
                ',' +
                this.item.origin_coordinates.longitude
            )
        },
        destinationURL() {
            return (
                'https://www.google.com/maps/place/' +
                this.item.destination_coordinates.latitude +
                ',' +
                this.item.destination_coordinates.longitude
            )
        }
    },
    methods: {
        formatDateTime(date) {
            return this.$moment(date).calendar()
        },
        async deleteItem() {
            this.deleting = true
            this.dialog = false
            try {
                let endpoint = this.item.url
                let payload = {
                    method: 'delete',
                    url: endpoint
                }
                await this.$auth.request(payload)
                this.$ga.event('alarms', 'delete')
                this.$emit('delete', this.item.id)
            } catch (err) {}
            this.deleting = false
        }
    }
}
</script>
