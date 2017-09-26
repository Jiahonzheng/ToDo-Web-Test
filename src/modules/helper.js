import Vue from 'vue'
import inflector from 'i'

const storage = window.localStorage
let helper = {}

helper.i = inflector()

helper.localStorageManager = {
  set (key, value) {
    storage.setItem(key, JSON.stringify(value))
  },
  get (key, defaultValue) {
    let value = storage.getItem(key)
    if (value === null || value === 'undefined' || value === '') {
      value = defaultValue
    } else {
      value = JSON.parse(value)
    }
    return value
  },
  clear () {
    storage.clear()
  }
}

helper.store = (key, value) => {
  if (arguments.length < 2) {
    return helper.localStorageManager.get(key)
  } else {
    return helper.localStorageManager.set(key, value)
  }
}

helper.dateArithmetic = {
  toLocal (utcString) {
    var date
    if (arguments.length === 0) {
      date = new Date()
    } else {
      date = new Date(utcString)
    }
    return date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getDate()
  },
  between (begin, end) {
    var beginDate = new Date(begin)
    var endDate = new Date(end)
    return parseInt(endDate - beginDate) / 1000 / 60 / 60 / 24
  }
}

Vue.directive('back', (el, binding) => {
  el.onclick = () => window.history.go(-1)
})

export default helper
