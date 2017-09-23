<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-list two-line v-if="!!tasks.length">
        <template v-for="(task, index) in tasks">
          <v-list-tile :key="index" ripple>

            <v-list-tile-content @click="showDetailsFragment(task.ID, index)">
              <v-list-tile-title>来自： {{task.FROM}} <v-spacer></v-spacer> 送至： {{task.TO}}</v-list-tile-title>
              <v-list-tile-sub-title>{{task.CONTENT}}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{task.END}}</v-list-tile-action-text>
            </v-list-tile-action>

          </v-list-tile>
          <v-divider v-if="index + 1 < tasks.length"></v-divider>
        </template>
      </v-list>
    </v-flex>

    <v-snackbar :timeout="3000" :right="true" v-model="toastMessage.show">{{toastMessage.body}}</v-snackbar>

  </v-layout>
</template>

<script>
  import apiClient from '../modules/apiClient'
  export default {
    data () {
      return {
        tasksList: [],
        toastMessage: {
          body: null,
          show: false
        }
      }
    },
    computed: {
      tasks: {
        get: function () {
          return this.tasksList
        },
        set: function (newValue) {
          this.tasksList = newValue
        }
      }
    },
    methods: {
      showDetailsFragment (id, index) {
        this.$store.dispatch('setTempTask', this.tasks[index])
        this.$router.push({
          path: this.$route.path + '/' + id
        })
      },
      initScrollPosition () {
        window.scrollTo(0, 0)
      },
      checkAllTasks () {
        let self = this
        apiClient.post('/receive', {userName: this.userName, status: 2}).then(function ({data}) {
          self.tasks = []
          for (var i = 0; i < data.length; i++) {
            data[i].BEGIN = global.helper.dateArithmetic.toLocal(data[i].BEGIN)
            data[i].END = global.helper.dateArithmetic.toLocal(data[i].END)
            self.tasksList.push(data[i])
          }
          if (self.tasks.length === 0) {
            self.toastMessage.body = '暂无任务'
            self.toastMessage.show = true
          }
        }).catch(function (error) {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.show = true
          console.log(error)
        })
        this.initScrollPosition()
      }
    },
    created () {
      this.checkAllTasks()
    }
  }
</script>
