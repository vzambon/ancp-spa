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

        <q-btn-dropdown flat no-caps class="cursor-pointer">
          <template v-slot:label>
            <q-avatar class="user-menu">
              <q-img
                :src="user?.profilePicture ?? 'javascript:void(0)'"
                style="height: 100%; width: 100%"
              >
                <template v-slot:error>
                  <q-icon
                    name="person"
                    style="width: 100%; height: 100%"
                    size="2rem"
                    color="black"
                  />
                </template>
              </q-img>
            </q-avatar>
          </template>

          <q-list>
            <q-item clickable v-ripple>
              <q-item-section> Profile </q-item-section>
            </q-item>
            <q-item clickable v-ripple>
              <q-item-section> Settings </q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="onOptionClick('LOGOUT')">
              <q-item-section> Logout </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
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
import { ref, computed } from 'vue'
import EssentialLink from 'components/EssentialLink.vue'
import AuthService from 'src/services/auth_service'
import logoImage from 'assets/img/logo_ancp.png'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'MainLayout'
})

const router = useRouter()

const authService = new AuthService()
const user = computed(() => authService.getUser())

const linksList = [
  {
    title: 'Users',
    caption: '',
    icon: 'groups',
    level: 0,
    nav: '/users'
  }
]

const leftDrawerOpen = ref(false)
const logoUrl = ref(logoImage)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function onOptionClick (option) {
  switch (option) {
    case 'LOGOUT':
      authService.logout()
      router.push('/login')
      break
  }
}
</script>
<style scoped lang="scss">
.user-menu {
  background-color: white;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  :hover {
    cursor: pointer;
  }
}
</style>
