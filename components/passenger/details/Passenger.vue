<template>
    <v-list-tile ripple>
        <v-list-tile-content>
            <template v-if="passenger.user_id == $auth.user.user_id">
                <v-list-tile-title><b>Você!</b></v-list-tile-title>
                <v-list-tile-sub-title>
                    Reservou {{ passenger.seats }} assento{{
                        passenger.seats != 1 ? 's' : ''
                    }}
                </v-list-tile-sub-title>
            </template>
            <template v-else>
                <v-list-tile-title>
                    <v-avatar
                    v-if="passenger.profile.picture.small_64"
                    class="mr-1"
                    size="32"
                    >
                        <v-img
                        :src="passenger.profile.picture.small_64"
                        contain
                        />
                    </v-avatar>
                    <b>{{ capitalize(passenger.first_name) }}</b>
                    <v-icon size="1em">
                        {{ genderIcon }}
                    </v-icon>, {{ age }} anos
                </v-list-tile-title>
                <v-list-tile-sub-title>
                    {{ passenger.student.course }} na
                    {{ getUniversity(passenger.student.university) }} desde
                    {{ passenger.student.enroll_year }}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>
                    Reservou {{ passenger.seats }} assento{{
                        passenger.seats != 1 ? 's' : ''
                    }}
                </v-list-tile-sub-title>
            </template>
        </v-list-tile-content>
    </v-list-tile>
</template>
<script>
export default {
    props: {
        passenger: {
            type: Object,
            required: true
        }
    },
    computed: {
        genderIcon() {
            let map = {
                male: 'fas fa-mars',
                female: 'fas fa-venus',
                na: 'fas fa-rainbow',
                other: 'fas fa-rainbow'
            }
            return map[this.passenger.profile.gender]
        },
        age() {
            return this.$moment().diff(
                this.passenger.profile.birthday,
                'years',
                false
            )
        }
    },
    methods: {
        capitalize(text) {
            if (!text) return
            return text.replace(/^\w/, c => c.toUpperCase())
        }
    }
}
</script>
