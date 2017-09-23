<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-list two-line v-if="!!tasks.length">
        <template v-for="(task, index) in tasks">
          <v-list-tile :key="index" ripple>

            <v-list-tile-content @click="showDetailsFragment(task.ID, index)">
              <v-list-tile-title>来自： {{task.FROM}}</v-list-tile-title>
              <v-list-tile-sub-title>{{task.CONTENT}}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{task.END}}</v-list-tile-action-text>
              <span>
                <v-btn icon fab @click.native.stop="achieveButtonPressed(task.ID)">
                  <v-icon>check</v-icon>
                </v-btn>
              </span>
            </v-list-tile-action>

          </v-list-tile>
          <v-divider v-if="index + 1 < tasks.length"></v-divider>
        </template>
      </v-list>
    </v-flex>

    <v-snackbar :timeout="3000" :right="true" v-model="toastMessage.show">{{toastMessage.body}}</v-snackbar>

    <v-dialog v-model="dialogMessage.show">
      <v-card>
        <v-card-title class="headline">{{dialogMessage.body}}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="dialogMessage.show = false">取消</v-btn>
          <v-btn flat @click.native="achieveUnfinishedTask">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
  import apiClient from '../modules/apiClient'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        tasksList: [],
        toastMessage: {
          body: null,
          show: false
        },
        dialogMessage: {
          body: null,
          show: false
        },
        tempID: null
      }
    },
    computed: {
      ...mapState(['userName', 'scrollPosition']),
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
      checkUnfinishedTasks () {
        let self = this
        apiClient.post('/receive', {userName: this.userName, status: 0}).then(function ({data}) {
          self.tasks = []
          for (var i = 0; i < data.length; i++) {
            data[i].BEGIN = global.helper.dateArithmetic.toLocal(data[i].BEGIN)
            data[i].END = global.helper.dateArithmetic.toLocal(data[i].END)
            self.tasksList.push(data[i])
          }
          if (self.tasks.length === 0) {
            self.toastMessage.body = '暂无未完成任务'
            self.toastMessage.show = true
          }
        }).catch(function (error) {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.show = true
          console.log(error)
        })
        this.initScrollPosition()
      },
      showDetailsFragment (id, index) {
        this.$store.dispatch('setTempTask', this.tasks[index])
        this.$router.push({
          path: this.$route.path + '/' + id
        })
      },
      initScrollPosition () {
        window.scrollTo(0, 0)
      },
      achieveButtonPressed (id) {
        this.tempID = id
        this.dialogMessage.show = true
        this.dialogMessage.body = '确定完成此项任务？'
      },
      achieveUnfinishedTask () {
        let self = this
        apiClient.post('/achieve', {ID: this.tempID}).then(({data}) => {
          if (data.status === 1) {
            self.toastMessage.body = '成功完成任务'
            self.toastMessage.show = true
            self.checkUnfinishedTasks()
          } else {
            self.toastMessage.body = '请与管理员联系'
            self.toastMessage.show = true
          }
        }).catch((error) => {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.show = true
          console.log(error)
        })
        this.dialogMessage.show = false
      }
    },
    created () {
      this.checkUnfinishedTasks()
    }
  }
</script>
