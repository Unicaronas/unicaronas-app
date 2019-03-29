<template>
    <BaseCard>
        <template slot="card" slot-scope="theme">
            <v-card-title primary-title>
                <v-flex xs12>
                    <div class="display-1 font-weight-thin">
                        Você é {{ gender }} motorista
                    </div>
                </v-flex>
            </v-card-title>
        </template>
    </BaseCard>
</template>
<script>
import BaseCard from '~/components/cards/BaseCard.vue'

export default {
    components: { BaseCard },
    props: {
        trip: {
            type: Object,
            required: true
        }
    },
    computed: {
        gender() {
            let map = {
                male: 'o',
                female: 'a',
                na: 'x',
                other: 'x'
            }
            return map[this.$auth.user.profile.gender]
        }
    }
}
</script>
