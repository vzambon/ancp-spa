import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    logged: null,
    user: null
  }),

  getters: {
    isLogged: (state) =>
      state.logged ?? JSON.parse(localStorage.getItem('logged')) ?? false,
    getUser: (state) =>
      state.user ?? JSON.parse(sessionStorage.getItem('user'))
  },

  actions: {
    signin (username, password) {
      return new Promise((resolve, reject) => {
        api
          .post('auth/signin', {
            username,
            password
          })
          .then((response) => {
            this.setUser(response.data.user)
            resolve(response.data)
          })
          .catch((err) => {
            console.log(err)
            reject(err)
          })
      })
    },
    logout () {
      this.setUser(null)
    },
    setUser (user) {
      this.logged = !!user
      this.user = user
      if (this.logged) {
        localStorage.setItem('logged', this.logged.toString())
        sessionStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('logged')
        sessionStorage.removeItem('user')
      }
    },
    fetchUser () {
      api.get('auth/whoami').then((response) => {
        this.setUser(response.data)
      })
    }
  }
})
