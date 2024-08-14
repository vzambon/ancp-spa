<template>
    <div class="box-wrap">
      <q-card flat bordered class="login-box">
        <q-img :src="logoUrl" width="50%"></q-img>
        <q-form
          @submit.prevent="handleSubmit"
          style="
            width: 100%;
            padding: 20px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          "
        >
          <q-input
            label="User"
            v-model="username"
            :rules="[(val) => !!val || 'Username is required']"
            filled
          />
          <q-input
            label="Password"
            v-model="password"
            type="password"
            :rules="[(val) => !!val || 'Password is required']"
            filled
          />
          <q-btn
            type="submit"
            label="Login"
            style="margin-inline: 25%; background-color: #0095da"
          />
        </q-form>
      </q-card>
    </div>
  </template>
<script setup>
import logoImage from 'assets/img/logo_ancp_no_text.png'

import { ref } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const { signin } = authStore

const logoUrl = ref(logoImage)
const username = ref('')
const password = ref('')

const handleSubmit = () => {
  if (username.value && password.value) {
    signin(username.value, password.value).then(() => {
      router.push('/app')
    })
  } else {
    console.log('Form is not valid')
  }
}
</script>
  <style lang="scss">
  .box-wrap {
    height: 100vh;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-content: center;
  }
  .login-box {
    width: 100%;
    max-width: 500px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 20px;
  }
  </style>
