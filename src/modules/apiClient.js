// import Vue from 'vue'
import axios from 'axios'
import config from './config'

var apiClient = axios.create({
  timeout: 5000,
  withCredentials: true,
  baseURL: config.apiUrl,
  headers: {'Content-Type': 'application/json;charset=UTF-8'}
})

export default apiClient
