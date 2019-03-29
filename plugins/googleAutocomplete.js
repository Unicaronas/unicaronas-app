import Vue from 'vue'

let session = null,
    autocomplete = null

let mixin = {
    methods: {
        getGoogleAutocomplete(input) {
            if (!session) {
                session = new this.$google.maps.places.AutocompleteSessionToken()
            }
            if (!autocomplete) {
                autocomplete = new this.$google.maps.places.AutocompleteService()
            }
            let data = {
                input: input,
                sessionToken: session,
                componentRestrictions: {
                    country: 'br'
                }
            }
            return new Promise(resolve => {
                return autocomplete.getPlacePredictions(data, resolve)
            })
        }
    }
}

Vue.mixin(mixin)
