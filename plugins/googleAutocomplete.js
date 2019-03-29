import Vue from 'vue'

let session = new google.maps.places.AutocompleteSessionToken(),
    autocomplete = new google.maps.places.AutocompleteService()

let mixin = {
    methods: {
        getGoogleAutocomplete(input) {
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
