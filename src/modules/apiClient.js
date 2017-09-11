// import Vue from 'vue'
import axios from 'axios'

var apiClient = axios.create({
  timeout: 5000,
  withCredentials: true,
  headers: {'Content-Type': 'application/json;charset=UTF-8'}
})

// Vue.prototype.$http = apiClient
export default apiClient
