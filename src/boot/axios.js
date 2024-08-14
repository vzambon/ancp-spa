import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'

function removeEmptyProps (obj) {
  const newObj = {}
  for (const key in obj) {
    if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

const baseConfig = {
  withCredentials: true,
  withXSRFToken: true
}

const api = axios.create({ ...baseConfig, baseURL: process.env.API_URL })
const web = axios.create({ ...baseConfig, baseURL: process.env.WEB_URL })

function isUnauthorizedError (error) {
  return error.response?.status === 401
}

api.interceptors.request.use((config) => {
  if (config.params) {
    config.params = removeEmptyProps(config.params)
  }

  return config
})

export default boot(({ app }) => {
  const authStore = useAuthStore()
  api.interceptors.response.use(
    (response) => {
      return response
    },
    function (error) {
      if (isUnauthorizedError(error)) {
        authStore.logout()
      }

      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$web = web
})

export { axios, api, web }
