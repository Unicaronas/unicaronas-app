import Vue from 'vue'

function universityMap(university) {
    let map = {
        unicamp: 'Unicamp',
        pucc: 'PUC-Campinas',
        usp: 'USP',
        ifsp: 'IFSP',
        unesp: 'Unesp',
        unifesp: 'Unifesp'
    }
    return map[university] || university
}

export default universityMap

let mixin = {
    methods: {
        getUniversity(university) {
            return universityMap(university)
        }
    }
}

Vue.mixin(mixin)
