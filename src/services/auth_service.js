import { api } from 'boot/axios'
import { useAuthStore } from 'stores/auth'

class AuthService {
  constructor () {
    this.authStore = useAuthStore()
  }

  async logout () {
    api
      .post('auth/logout-session')
      .then((response) => {})
      .catch((err) => console.log(err))
      .finally(() => {
        this.authStore.logout()
      })
  }

  async whoami () {
    api
      .post('auth/whoami')
      .then((response) => this.authStore.setUser(response.data))
      .catch((err) => console.log(err))
      .finally(() => {})
  }

  getUser () {
    return this.authStore.getUser
  }
}

export default AuthService
