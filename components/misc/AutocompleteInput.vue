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
    methods: {
        searchGoogle(val) {
            if (!val) return
            if (process.env.NODE_ENV === 'development') {
                this.items = ['Unicamp', 'São Paulo']
                return
            }
            this.loading = true
            this.getGoogleAutocomplete(val)
                .then(results => {
                    if (results) {
                        this.items = results.map(
                            prediction => prediction.description
                        )
                    } else {
                        this.items = this.value ? [this.value] : []
                    }
                    this.loading = false
                })
                .catch(error => {
                    console.error(error)
                    this.loading = false
                })
        }
    }
}
</script>
