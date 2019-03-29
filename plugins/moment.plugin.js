/* eslint-disable */

import Vue from 'vue'
import moment from 'moment-timezone'

// <%= options.locales.map(l => `import 'moment/locale/${l}'`).join('\n') %>

if (!Vue.prototype.hasOwnProperty('$moment')) {
    Object.defineProperty(Vue.prototype, '$moment', {
        get() {
            moment.tz.guess()
            moment.updateLocale('pt-br', {
                calendar: {
                    sameDay: '[Hoje às] LT',
                    nextDay: '[Amanhã às] LT',
                    nextWeek: 'dddd [às] LT',
                    lastDay: '[Ontem às] LT',
                    lastWeek: function () {
                        return (this.day() === 0 || this.day() === 6) ?
                            '[Último] dddd [às] LT' : // Saturday + Sunday
                            '[Última] dddd [às] LT'; // Monday - Friday
                    },
                    sameElse: function(now) {
                        // If the date is in the past or the date is in the next year
                        if (now.isAfter(this) || this.year() > now.year())
                            return 'L [às] LT'
                        return 'D [de] MMMM [às] LT'

                    }
                }
            })
            return moment
        }
    })
}
