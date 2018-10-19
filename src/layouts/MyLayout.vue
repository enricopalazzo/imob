<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toggle v-model="toggled" label="" @click="toggleUser" class="fixed-top-right" color="teal" style="margin-top:10px; margin-right:15px;"/>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
    >
      <q-list
        no-border
        link
        inset-delimiter
        id="elmenu"
      >
        <q-list-header> <img :src="imageSrc"></q-list-header>
        <q-item to="/usuarios">
          <q-item-side icon="person" />
          <q-item-main label="Usuarios" />
        </q-item>
        <q-item to="/urbanizaciones">
          <q-item-side icon="map" />
          <q-item-main label="Urbanizaciones" />
        </q-item>
        <q-item to="/viviendas" v-if="currentUser.rol === 2">
          <q-item-side icon="domain" />
          <q-item-main label="Viviendas" />
        </q-item>
        <q-item to="/sectores"  v-if="currentUser.rol === 2">
          <q-item-side icon="location_on" />
          <q-item-main label="Sectores" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { openURL } from 'quasar'

export default {
  computed: {
    toggleUser () {
      var data
      if (this.toggled === false) {
        data = {
          'id': 1,
          'rol': 1
        }
      } else {
        data = {
          'id': 3,
          'rol': 2
        }
      }
      console.log('seteamos' + data.id)
      this.$store.commit('mainstore/updateCurrentUser', data)
      return this.redirigir()
    },
    currentUser: {
      get () {
        console.log('getting')
        return this.$store.state.mainstore.currentUser
      },
      set (val) {
        console.log('seteamos' + val)
        let data
        if (val === false) {
          data = {
            'id': 1,
            'rol': 1
          }
        } else {
          data = {
            'id': 3,
            'rol': 2
          }
        }
        console.log('seteamos' + data.id)
        this.$store.commit('mainstore/updateCurrentUser', data)
      }
    }
  },
  name: 'MyLayout',
  data () {
    return {
      toggled: false,
      leftDrawerOpen: this.$q.platform.is.desktop,
      imageSrc: './assets/logoimo.png'
    }
  },
  methods: {
    openURL,
    redirigir () {
      this.$router.push('/')
    }
  }
}
</script>

<style>
</style>
