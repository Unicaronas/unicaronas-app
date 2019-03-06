<template>
    <div v-if="queries.length > 0">
        <h4 class="display-1 font-weight-thin mb-3 ml-3">Pesquisas anteriores:</h4>
        <v-layout v-for="query in queries" :key="query.id" row wrap d-flex>
            <v-flex text-xs-center text-lg-left>
                <pastSearchesButtom
                :origin="query[0]"
                :destination="query[1]"
                @clicked="$emit('clicked', $event)"
                />
            </v-flex>
        </v-layout>
    </div>
</template>
<script>
import pastSearchesButtom from '~/components/search/pastSearchesButtom.vue'

export default {
    components: { pastSearchesButtom },
    computed: {
        queries() {
            return this.$store.state.pastSearches.queries
        }
    }
}
</script>
