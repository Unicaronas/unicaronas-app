<template>
    <form>
        <v-radio-group v-model="source_type" required>
            <div slot="label">
                <strong>Onde</strong> pesquisar as caronas?
            </div>
            <v-radio value="local">
                <div slot="label">
                    No Unicaronas
                </div>
            </v-radio>
            <v-radio value="external">
                <div slot="label">
                    Fora do Unicaronas
                </div>
            </v-radio>
        </v-radio-group>

        <template v-if="source_type == 'external'">
            <label
            aria-hidden="true"
            class="v-label"
            style="left: 0px; right: auto; position: relative;"
            ><div>Quais fontes usar na pesquisa?</div></label>
            <label
            aria-hidden="true"
            class="v-label red--text"
            style="left: 0px; right: auto; position: relative;"
            >
                {{
                    errors.collect('sources')[0]
                        ? 'Escolha pelo menos uma fonte'
                        : ''
                }}
            </label>
            <v-checkbox
            v-for="(option, i) in source_options"
            :key="i"
            v-model="sources"
            v-validate="'required|is_not:[]'"
            :value="option.toLowerCase()"
            :label="option"
            data-vv-as="Fontes"
            data-vv-name="sources"
            />
        </template>

        <AutocompleteInput
        v-model="origin"
        v-validate="'required|max:500'"
        :error-messages="errors.collect('origin')"
        data-vv-as="Origem"
        data-vv-name="origin"
        label="De onde você vai sair?"
        />
        <AutocompleteInput
        v-model="destination"
        v-validate="'required|max:500'"
        :error-messages="errors.collect('destination')"
        data-vv-as="Destino"
        data-vv-name="destination"
        label="Para onde você vai?"
        />

        <v-layout row wrap>
            <v-flex d-flex xs12 sm5>
                <v-text-field
                v-model="price"
                v-validate="'required|min_value:0|numeric|max_value:32767'"
                :error-messages="errors.collect('price')"
                type="number"
                data-vv-as="Preço máximo"
                data-vv-name="price"
                label="Preço máximo"
                required
                />
            </v-flex>
            <v-flex v-if="source_type == 'local'" d-flex xs12 offset-sm1 sm6>
                <v-text-field
                v-model="seatsLeft"
                v-validate="'required|min_value:1|max_value:10|numeric'"
                :error-messages="errors.collect('seatsLeft')"
                type="number"
                data-vv-as="Numero de vagas"
                data-vv-name="seatsLeft"
                label="# de vagas"
                required
                />
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex d-flex xs12 sm6>
                <v-menu
                v-model="minDateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                lazy
                transition="slide-y-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
                >
                    <v-text-field
                    ref="minDate"
                    slot="activator"
                    v-model="computedMinDate"
                    v-validate="'required|date_format:dd/MM/yyyy'"
                    :error-messages="errors.collect('minDate')"
                    data-vv-as="Data mínima"
                    data-vv-name="minDate"
                    label="Data mínima"
                    prepend-icon="event"
                    readonly
                    required
                    />
                    <v-date-picker
                    v-model="minDate"
                    :min="new Date().toISOString().substr(0, 10)"
                    locale="pt-br"
                    @input="minDateMenu = false"
                    />
                </v-menu>
            </v-flex>
            <v-flex d-flex xs12 sm6>
                <v-menu
                ref="minTimeMenu"
                v-model="minTimeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                :return-value.sync="minTime"
                lazy
                transition="slide-y-transition"
                offset-y
                full-width
                max-width="290px"
                min-width="290px"
                >
                    <v-text-field
                    slot="activator"
                    v-model="minTime"
                    v-validate="{
                        required: true,
                        regex: '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
                    }"
                    :error-messages="errors.collect('minTime')"
                    data-vv-as="Hora mínima"
                    data-vv-name="minTime"
                    label="Hora mínima"
                    prepend-icon="access_time"
                    readonly
                    required
                    />
                    <v-time-picker
                    v-if="minTimeMenu"
                    v-model="minTime"
                    format="24hr"
                    full-width
                    @change="$refs.minTimeMenu.save(minTime)"
                    />
                </v-menu>
            </v-flex>
        </v-layout>

        <v-switch v-model="advancedOptions" label="Mais opções" />

        <template v-if="advancedOptions">
            <v-layout row wrap>
                <v-flex d-flex xs12 sm6>
                    <v-menu
                    v-model="maxDateMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    lazy
                    transition="slide-y-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                    >
                        <v-text-field
                        slot="activator"
                        v-model="computedMaxDate"
                        v-validate="
                            'required|date_format:dd/MM/yyyy|after:minDate,true'
                        "
                        :error-messages="errors.collect('maxDate')"
                        data-vv-as="Data máxima"
                        data-vv-name="maxDate"
                        label="Data máxima"
                        prepend-icon="event"
                        readonly
                        required
                        />
                        <v-date-picker
                        v-model="maxDate"
                        :min="new Date().toISOString().substr(0, 10)"
                        locale="pt-br"
                        @input="maxDateMenu = false"
                        />
                    </v-menu>
                </v-flex>
                <v-flex d-flex xs12 sm6>
                    <v-menu
                    ref="maxTimeMenu"
                    v-model="maxTimeMenu"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="maxTime"
                    lazy
                    transition="slide-y-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                    >
                        <v-text-field
                        slot="activator"
                        v-model="maxTime"
                        v-validate="{
                            required: true,
                            regex:
                                '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$'
                        }"
                        :error-messages="errors.collect('maxTime')"
                        data-vv-as="Hora máxima"
                        data-vv-name="maxTime"
                        label="Hora máxima"
                        prepend-icon="access_time"
                        readonly
                        required
                        />
                        <v-time-picker
                        v-if="maxTimeMenu"
                        v-model="maxTime"
                        format="24hr"
                        full-width
                        @change="$refs.maxTimeMenu.save(maxTime)"
                        />
                    </v-menu>
                </v-flex>
            </v-layout>
            <template v-if="source_type == 'local'">
                <v-radio-group v-model="auto_approve" required>
                    <div slot="label">
                        Tipo de carona
                    </div>
                    <v-radio value="any">
                        <div slot="label">
                            Qualquer uma
                        </div>
                    </v-radio>
                    <v-radio value="on">
                        <div slot="label">
                            Com aprovação automática
                        </div>
                    </v-radio>
                </v-radio-group>

                <v-layout row wrap>
                    <v-flex d-flex xs12 sm6>
                        <v-text-field
                        v-model="originRadius"
                        v-validate="
                            'required|min_value:0.05|max_value:20|decimal'
                        "
                        :error-messages="errors.collect('originRadius')"
                        type="number"
                        step="0.01"
                        data-vv-as="Raio da origem (em km)"
                        data-vv-name="originRadius"
                        label="Raio da origem (em km)"
                        required
                        />
                    </v-flex>
                    <v-flex v-if="source_type == 'local'" d-flex xs12 sm6>
                        <v-text-field
                        v-model="destinationRadius"
                        v-validate="
                            'required|min_value:0.05|max_value:20|decimal'
                        "
                        :error-messages="
                            errors.collect('destinationRadius')
                        "
                        type="number"
                        step="0.01"
                        data-vv-as="Raio do destino (em km)"
                        data-vv-name="destinationRadius"
                        label="Raio do destino (em km)"
                        required
                        />
                    </v-flex>
                </v-layout>
            </template>
        </template>
        <div class="text-xs-center">
            <v-btn
            :loading="loading"
            :disabled="loading"
            color="primary"
            class="white--text"
            large
            round
            @click="submit()"
            >
                <v-icon left dark>
                    search
                </v-icon>
                Pesquisar
            </v-btn>
            <v-btn color="info" class="white--text" round large @click="clear">
                <v-icon left dark>
                    clear
                </v-icon>
                Limpar
            </v-btn>
        </div>
    </form>
</template>

<script>
import AutocompleteInput from '~/components/misc/AutocompleteInput.vue'

export default {
    components: { AutocompleteInput },
    props: {
        loading: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    data() {
        return {
            advancedOptions: false,

            source_type: null,
            sources: [],
            origin: '',
            destination: '',
            minDateMenu: null,
            minDate: null,
            minTimeMenu: null,
            minTime: null,
            maxDateMenu: null,
            maxDate: null,
            maxTimeMenu: null,
            maxTime: null,
            price: null,
            seatsLeft: null,
            auto_approve: null,
            originRadius: null,
            destinationRadius: null,

            source_options: ['Facebook', 'BlaBlaCar']
        }
    },
    computed: {
        computedMinDate() {
            return this.formatDate(this.minDate)
        },
        computedMaxDate() {
            return this.formatDate(this.maxDate)
        },
        today() {
            return this.$moment()
        },
        tomorrow() {
            return this.today.add(1, 'days')
        }
    },
    mounted() {
        this.clear()
        this.initWithQuery()
        if (this.$route.query) {
            this.submit()
        }
    },
    methods: {
        formatDate(date) {
            if (!date) return null

            const [year, month, day] = date.split('-')
            return `${day}/${month}/${year}`
        },
        submit() {
            this.$validator.validateAll().then(result => {
                if (result) {
                    let data = this.getCleanData()
                    let query = data.data
                    query['source_type'] = this.source_type
                    query['advancedOptions'] = this.advancedOptions
                    if (this.sources) query['sources'] = this.sources.join(' ')
                    this.$router.push({ query: query })
                    this.$store.commit('setSearchData', data)
                    this.$store.commit('pastSearches/append', [
                        this.origin,
                        this.destination
                    ])
                    this.$emit('search')
                    this.$ga.event('trips', 'search', this.source_type)
                    this.$fb.track('Search')
                    if (this.$device.isMobileOrTablet)
                        this.$vuetify.goTo('#searchResults', {
                            duration: 1000,
                            offset: 0
                        })
                }
            })
        },
        initWithQuery() {
            this.advancedOptions =
                this.$route.query.advancedOptions == 'true' ||
                this.advancedOptions

            this.source_type = this.$route.query.source_type || this.source_type

            if (this.$route.query.sources)
                this.sources = this.$route.query.sources.split(' ') || []
            this.origin = this.$route.query.origin || this.origin
            this.destination = this.$route.query.destination || this.destination

            if (this.$route.query.datetime__gte)
                this.minDate = this.$route.query.datetime__gte.substr(0, 10)

            if (this.$route.query.datetime__gte)
                this.minTime = this.$route.query.datetime__gte.substr(11, 5)

            if (this.$route.query.datetime__lte)
                this.maxDate = this.$route.query.datetime__lte.substr(0, 10)

            if (this.$route.query.datetime__lte)
                this.maxTime = this.$route.query.datetime__lte.substr(11, 5)

            this.price = this.$route.query.price || this.price
            this.seatsLeft = this.$route.query.seats_left__gte || this.seatsLeft

            if (this.$route.query.auto_approve) this.auto_approve = 'on'

            this.originRadius =
                this.$route.query.origin_radius || this.originRadius
            this.destinationRadius =
                this.$route.query.destination_radius || this.destinationRadius
        },
        clear() {
            let today = this.$moment()
            let tomorrow = this.$moment().add(1, 'days')
            this.advancedOptions = false
            this.source_type = 'local'
            this.origin = ''
            this.destination = ''
            this.minDateMenu = false
            this.minDate = today.format().substr(0, 10)
            this.minTimeMenu = false
            this.minTime = today.format().substr(11, 3) + '00'
            this.maxDateMenu = false
            this.maxDate = tomorrow.format().substr(0, 10)
            this.maxTimeMenu = false
            this.maxTime = tomorrow.format().substr(11, 3) + '00'
            this.price = 40
            this.seatsLeft = 1
            this.auto_approve = 'any'
            this.originRadius = 10
            this.destinationRadius = 10
            this.$validator.reset()
        },
        getCleanData() {
            let date_gte = this.minDate + 'T' + this.minTime
            let data = {
                origin: this.origin,
                destination: this.destination,
                price__lte: this.price,
                datetime__gte: date_gte,
                datetime__lte: this.$moment(date_gte)
                    .add(1, 'days')
                    .format()
            }
            if (this.source_type == 'local') {
                data['seats_left__gte'] = this.seatsLeft
            } else {
                data['sources'] = this.sources.join(' ')
            }
            if (this.advancedOptions) {
                data['datetime__lte'] = this.maxDate + 'T' + this.maxTime
                if (this.source_type == 'local') {
                    if (this.auto_approve == 'on') data['auto_approve'] = true
                    data['origin_radius'] = this.originRadius
                    data['destination_radius'] = this.destinationRadius
                }
            }
            return {
                data: data,
                endpoint: this.source_type
            }
        },
        manualOriDest(event) {
            this.origin = event.origin
            this.destination = event.destination
            this.submit()
        }
    }
}
</script>
