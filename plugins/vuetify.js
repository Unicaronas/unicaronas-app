import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
    theme: {
        primary: '#2979FF',
        secondary: '#388E3C',
        accent: '#1565C0',
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: '#B00020',
        success: colors.green.accent3
    }
})
