import Vue from 'vue'

let mixin = {
    methods: {
        getAddrComp(trip, source, component, short) {
            // Get the address component from the trip
            try {
                return trip[source].filter(comp =>
                    comp.types.includes(component)
                )[0][short]
            } catch(err) {
                return null
            }
        },
        getOriginCity(trip) {
            return this.getAddrComp(
                trip,
                'origin_address_components',
                'administrative_area_level_2',
                'long_name'
            )
        },
        getDestinationCity(trip) {
            return this.getAddrComp(
                trip,
                'destination_address_components',
                'administrative_area_level_2',
                'long_name'
            )
        },
        getOriginState(trip) {
            return this.getAddrComp(
                trip,
                'origin_address_components',
                'administrative_area_level_1',
                'short_name'
            )
        },
        getDestinationState(trip) {
            return this.getAddrComp(
                trip,
                'destination_address_components',
                'administrative_area_level_1',
                'short_name'
            )
        },
        getOriginHood(trip) {
            return this.getAddrComp(
                trip,
                'origin_address_components',
                'sublocality_level_1',
                'long_name'
            )
        },
        getDestinationHood(trip) {
            return this.getAddrComp(
                trip,
                'destination_address_components',
                'sublocality_level_1',
                'long_name'
            )
        },
        buildGenericGeoText(hood, city, state, maxLen=30) {
            if (hood && city) {
                let hoodCity = hood + ', ' + city
                if (hoodCity.length <= maxLen) {
                    return hoodCity
                }
            }
            if (city && state) {
                let cityState = city + ', ' + state
                if (cityState.length <= maxLen) {
                    return cityState
                }
                return city
            }
            return state
        },
        getOriginText(trip, maxLen=30) {
            let city = this.getOriginCity(trip)
            let state = this.getOriginState(trip)
            let hood = this.getOriginHood(trip)
            return this.buildGenericGeoText(hood, city, state, maxLen)
        },
        getDestinationText(trip, maxLen=30) {
            let city = this.getDestinationCity(trip)
            let state = this.getDestinationState(trip)
            let hood = this.getDestinationHood(trip)
            return this.buildGenericGeoText(hood, city, state, maxLen)
        }
    }
}

Vue.mixin(mixin)
