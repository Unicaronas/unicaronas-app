<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title>
                <div>
                    <h3 class="display-1 mb-0">
                        {{ formattedDatetime }}
                    </h3>
                    <div>
                        Por <b>{{ item.price }}</b> reais
                    </div>
                </div>
            </v-card-title>
            <v-card-actions>
                <v-btn
                :href="item.url"
                :class="theme.theme.theme_text"
                :dark="theme.theme.theme_dark"
                :light="theme.theme.theme_light"
                flat
                >
                    Abrir no {{ item.source }}
                </v-btn>
            </v-card-actions>
        </template>
    </BaseCard>
</template>

<script>
import BaseCard from '~/components/cards/BaseCard.vue'

export default {
    components: { BaseCard },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    computed: {
        formattedDatetime() {
            return this.$moment(this.item.datetime).calendar()
        }
    }
}
</script>
