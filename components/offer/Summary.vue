<template>
    <v-layout row wrap>
        <v-flex d-flex xs12>
            <v-card>
                <v-container>
                    <v-card-title class="display-1 font-weight-thin">Resumo</v-card-title>
                    <v-divider />
                    <v-list v-if="formData">
                        <v-list-tile
                        v-for="(value, key) in formData"
                        v-if="mapKey(key)"
                        :key="key"
                        class="mt-2">
                            <v-list-tile-content>
                                <v-list-tile-title class="font-weight-light" v-text="mapValue(key, value)"/>
                                <v-list-tile-sub-title v-text="mapKey(key)"/>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list>
                </v-container>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
export default {
    props: {
        formData: {
            type: Object,
            required: true
        }
    },
    methods: {
        mapKey(key) {
            let map = {
                origin: 'Origem',
                destination: 'Destino',
                date: 'Data e hora',
                price: 'Preço',
                details: 'Detalhes',
                auto_approve: 'Aprovação Automática',
                max_seats: 'Lugares'
            }
            if (!(key in map)) return false
            return map[key]
        },
        mapValue(key, value) {
            switch (key) {
                case 'origin':
                case 'destination':
                    return value.split('-')[0]
                case 'date':
                    return this.$moment(
                        value + 'T' + this.formData['time']
                    ).calendar()
                case 'price':
                    return value + ' reais'
                case 'details':
                    if (!value) return 'Sem detalhes'
                    let words = value.split(' ')
                    if (words.length > 15)
                        return words.slice(0, 16).join(' ') + '...'
                    return words.join(' ')
                case 'auto_approve':
                    if (value) return 'Ativado'
                    return 'Desativado'
                case 'max_seats':
                    return value
            }
        }
    }
}
</script>
