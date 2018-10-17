<template>
  <q-page padding>
   <div>
    <q-toggle v-model="currentUser" />
    {{currentUser}}
  </div>
  </q-page>
</template>

<script>
export default {
  computed: {
    currentUser: {
      get () {
        return this.$store.state.mainstore.currentUser
      },
      set (val) {
        this.$store.commit('mainstore/updateCurrentUser', val)
      }
    }
  }
}
</script>
<style>
</style>
