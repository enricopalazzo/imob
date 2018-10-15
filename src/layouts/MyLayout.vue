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
        <q-list-header>Aquí va el logo</q-list-header>
        <q-item to="/usuarios">
          <q-item-side icon="person" />
          <q-item-main label="Usuarios" />
        </q-item>
        <q-item to="/urbanizaciones">
          <q-item-side icon="person" />
          <q-item-main label="Urbanizaciones" />
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
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
