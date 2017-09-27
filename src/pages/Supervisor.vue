<template>
<v-layout row>
  <v-flex xs12 sm6 offset-sm3>
    <v-list two-line v-if="!!tasks.length">
      <template v-for="(task, index) in tasks">
          <div v-bind:class="task.DEADLINE < 0 ? 'task_item_out_of_date' : task.DEADLINE <= 1 ? 'task_item_ddl_1' : task.DEADLINE <= 2 ? 'task_item_ddl_2': 'task_item_default' ">
          <v-list-tile :key="index" ripple>

            <v-list-tile-content @click="showDetailsFragment(task.ID, index)">
              <v-list-tile-title>送至： {{task.TO}}</v-list-tile-title>
              <v-list-tile-sub-title>{{task.CONTENT}}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{task.END}}</v-list-tile-action-text>
              <span>
                <v-btn icon fab @click.native.stop="deleteButtonPressed(task.ID)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </span>
            </v-list-tile-action>

          </v-list-tile>
          <v-divider v-if="index + 1 < tasks.length"></v-divider>
          </div>
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
        <v-btn flat @click.native="deleteSupervisedTask">确定</v-btn>
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
      ...mapState(['userName']),
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
      checkSupervisedTasks () {
        let self = this
        apiClient.post('/receive', {userName: this.userName, status: 1}).then(function ({data}) {
          self.tasks = []
          for (var i = 0; i < data.length; i++) {
            data[i].BEGIN = global.helper.dateArithmetic.toLocal(data[i].BEGIN)
            data[i].END = global.helper.dateArithmetic.toLocal(data[i].END)
            data[i].DEADLINE = global.helper.dateArithmetic.between(Date(), data[i].END)
            self.tasksList.push(data[i])
          }
          if (self.tasks.length === 0) {
            self.toastMessage.body = '暂无未完成的已分发任务'
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
      deleteButtonPressed (id) {
        this.tempID = id
        this.dialogMessage.show = true
        this.dialogMessage.body = '确定删除此项任务？'
      },
      deleteSupervisedTask () {
        let self = this
        apiClient.post('/delete', {ID: this.tempID}).then(({data}) => {
          if (data.status === 1) {
            self.toastMessage.body = '成功删除任务'
            self.toastMessage.show = true
            self.checkSupervisedTasks()
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
      this.checkSupervisedTasks()
    }
  }
</script>
