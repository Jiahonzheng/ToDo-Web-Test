import Vue from 'vue'
import axios from 'axios'
import config from './config'

var apiClient = axios.create({
  baseUrl: config.apiUrl,
  timeout: 1000,
  withCredentials: true
})

apiClient.interceptors.request.use(function (request) {
  return request
}, function (error) {
  return Promise.reject(error)
})

apiClient.interceptors.response.use(function (response) {
  const request = response.config
  console.log('>>>', request.method.toUpperCase(), request.url, request.params, '\n  ', response.status, response.data)
  return response
}, function (error) {
  let {response, config: request} = error
  if (request) {
    console.log('>>>', request.method.toUpperCase(), request.url, request.params, '\n  ',response.status, response.data)
  }
  return Promise.reject(error)
})

Vue.prototype.$apiClient = apiClient
