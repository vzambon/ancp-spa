<template>
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar style="background-color: #0095DA">
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />

          <q-toolbar-title> </q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
        <q-list>
          <div style="display: flex; align-items: center; margin: 10px 0 0 10px">
            <q-img :src="logoUrl" width="240px"></q-img>
          </div>
          <q-item-label header> Menu </q-item-label>
          <q-separator />

          <EssentialLink
            v-for="link in linksList"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-drawer>

      <q-page-container>
        <router-view />
      </q-page-container>
    </q-layout>
  </template>

<script setup>
import { ref } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import logoImage from 'assets/img/logo_ancp.png'

defineOptions({
  name: 'MainLayout'
})

const linksList = [
  {
    title: 'Serviços',
    caption: '',
    icon: 'work_outline',
    level: 0,
    children: [
      {
        title: 'Consulta Pública',
        caption: '',
        icon: 'content_paste_search',
        level: 1,
        nav: '/free/consulta-publica/'
      }
    ]
  }
]

const leftDrawerOpen = ref(false)
const logoUrl = ref(logoImage)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>
<style scoped lang="scss">

</style>
