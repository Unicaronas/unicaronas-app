<template>
    <v-autocomplete
    :items="items"
    :value="value"
    :hide-no-data="loading || items.length > 0"
    :loading="loading && search"
    :search-input.sync="search"
    :label="label"
    :error="error"
    :error-count="errorCount"
    :error-messages="errorMessages"
    no-data-text="Endereço não encontrado"
    no-filter
    required
    @input="$emit('input', $event)"
    />
</template>

<script>
export default {
    props: {
        label: {
            type: String,
            required: true
        },
        value: {
            type: String,
            required: true
        },
        error: {
            type: Boolean,
            required: false,
            default: () => false
        },
        errorCount: {
            type: Number,
            required: false,
            default: () => 1
        },
        errorMessages: {
            type: Array,
            required: false,
            default: () => []
        }
    },
    data() {
        return {
            autocomplete: null,
            session: null,
            items: [],
            search: '',
            loading: false
        }
    },
    watch: {
        search(val) {
            this.searchGoogle(val)
        },
        value(n, o) {
            this.searchGoogle(this.value)
        }
    },
    mounted() {
        this.session = new google.maps.places.AutocompleteSessionToken()
        this.autocomplete = new google.maps.places.AutocompleteService()
    },
    methods: {
        searchGoogle(val) {
            if (!val) return
            if (process.env.NODE_ENV === 'development') {
                this.items = ['Unicamp', 'São Paulo']
                return
            }
            let data = {
                input: val,
                sessionToken: this.session,
                componentRestrictions: {
                    country: 'br'
                }
            }
            this.loading = true
            this.autocomplete.getPlacePredictions(
                data,
                (predictions, status) => {
                    if (
                        status ==
                        google.maps.places.PlacesServiceStatus.ZERO_RESULTS
                    ) {
                        this.items = this.value ? [this.value] : []
                    } else if (
                        status == google.maps.places.PlacesServiceStatus.OK
                    ) {
                        this.items = predictions.map(
                            prediction => prediction.description
                        )
                    } else {
                        console.log("Autocomplete error: " + status)
                    }
                    this.loading = false
                }
            )
        }
    }
}
</script>
