<template>
  <v-app :dark="dark" standalone="standalone">

    <v-navigation-drawer v-model="drawer" persistent light overflow :dark="dark" enable-resize-watcher>

      <div class="pa-3 text-xs-center" v-show="!mini">
        <div class="display-2 py-4">{{userName}}</div>
        <!-- <div style="padding-left:5em;">
          <v-switch :label="(!dark ? 'Light' : 'Dark') + ' Theme'" v-model="dark" :dark="dark" hide-details="hide-details"></v-switch>
        </div> -->
        <div>
          <v-btn dark="dark" @click.native.stop="logoutButtonPressed" primary="primary">
            <span>注销</span></v-btn>
        </div>
      </div>

      <v-divider></v-divider>

      <v-list dense="dense">

        <template v-for="item in menu">
          <v-list-tile :to="item.href" :titile="item.title" router ripple :exact="true">

            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{(item.title) }}</v-list-tile-title>
            </v-list-tile-content>

          </v-list-tile>
        </template>

      </v-list>

    </v-navigation-drawer>

    <v-toolbar class="darken-1" fixed="fixed" dark="dark" :class="theme">

      <v-toolbar-side-icon v-if="isDetailsFragment || isAddTaskFragment || isEditTaskFragment" dark="dark" @click="backButtonPressed">
        <v-icon>chevron_left</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-side-icon v-else dark="dark" @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>

      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon dark v-if="!isDetailsFragment && !isAddTaskFragment && !isEditTaskFragment" @click="addButtonPressed">
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isAddTaskFragment" @click="addTask">
        <v-icon>check</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isEditTaskFragment" @click="editTask">
        <v-icon>check</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isUnfinishedTasksDetailsFragment" @click.stop="achieveButtonPressed">
        <v-icon>check</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isSupervisorDetailsFragment && !isEditTaskFragment" @click.native.stop="editButtonPressed">
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isSupervisorDetailsFragment && !isEditTaskFragment" @click.stop="deleteButtonPressed">
        <v-icon>delete</v-icon>
      </v-btn>

    </v-toolbar>

    <main>
      <v-container class="pa-4" fluid="fluid">
        <div class="py-2">
          <!--<v-slide-y-transition mode="out-in">-->
            <router-view></router-view>
          <!--</v-slide-y-transition>-->
        </div>
      </v-container>
    </main>

    <v-snackbar :timeout="3000" :top="true" :success="toastMessage.success" :error="!toastMessage.success" v-model="toastMessage.show">{{toastMessage.body}}</v-snackbar>

    <v-dialog v-model="dialogMessage.show">
      <v-card>
        <v-card-title class="headline">{{dialogMessage.body}}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="dialogMessage.show = false">取消</v-btn>
          <v-btn flat @click.native="dialogHandler">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="logoutDialogMessage.show">
      <v-card>
        <v-card-title class="headline">{{logoutDialogMessage.body}}</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat @click.native="logoutDialogMessage.show = false">取消</v-btn>
          <v-btn flat @click.native="logout">确定</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
  import {mapState} from 'vuex'
  import menu from '../modules/menu'
  import apiClient from '../modules/apiClient'
  export default {
    data () {
      return {
        theme: 'primary',
        mini: false,
        drawer: true,
        toastMessage: {
          body: null,
          show: false,
          success: null
        },
        dialogMessage: {
          body: null,
          show: false
        },
        logoutDialogMessage: {
          body: null,
          show: false
        }
      }
    },
    computed: {
      ...mapState(['menu', 'pageTitle', 'userName', 'tempTask']),
      isAddTaskFragment () {
        if (this.$route.path.indexOf('add') > -1) {
          return true
        }
        return false
      },
      isEditTaskFragment () {
        if (this.$route.path.indexOf('edit') > -1) {
          return true
        }
        return false
      },
      isDetailsFragment () {
        return !!this.$route.params.id
      },
      isUnfinishedTasksDetailsFragment () {
        if (this.$route.path.indexOf('unfinishedTasks') > -1 && this.$route.path.indexOf('/', 2) > -1) {
          return true
        }
        return false
      },
      isSupervisorDetailsFragment () {
        if (this.$route.path.indexOf('supervisor') > -1 && this.$route.path.indexOf('/', 2) > -1) {
          return true
        }
        return false
      },
      isAllTasksDetailsFragment () {
        if (this.$route.path.indexOf('allTasks') > -1 && this.$route.path.indexOf('/', 2) > -1) {
          return true
        }
        return false
      },
      dark: {
        get: function () {
          return this.$store.state.dark
        },
        set: function (dark) {
          this.$store.dispatch('setDark', dark)
        }
      }
    },
    methods: {
      addTask () {
        let self = this
        if (this.tempTask.TO && this.tempTask.CONTENT && this.tempTask.END && global.helper.dateArithmetic.between(this.tempTask.BEGIN, this.tempTask.END) >= 0) {
          apiClient.post('/send', {FROM: this.tempTask.FROM, TO: this.tempTask.TO, CONTENT: this.tempTask.CONTENT, BEGIN: this.tempTask.BEGIN, END: this.tempTask.END}).then(function ({data}) {
            if (data.status === 1) {
              self.toastMessage.body = '成功发送任务'
              self.toastMessage.success = true
              self.toastMessage.show = true
            } else {
              self.toastMessage.body = '请与管理员联系'
              self.toastMessage.success = false
              self.toastMessage.show = true
            }
          }).catch(function (error) {
            self.toastMessage.body = '请与管理员联系'
            self.toastMessage.success = false
            self.toastMessage.show = true
            console.log(error)
          })
          this.$router.go(-1)
        } else {
          self.toastMessage.body = '请检查输入'
          self.toastMessage.success = false
          self.toastMessage.show = true
        }
      },
      editTask () {
        let self = this
        console.log(1)
        apiClient.post('/update', {ID: this.tempTask.ID, TO: this.tempTask.TO, CONTENT: this.tempTask.CONTENT, END: this.tempTask.END}).then(function ({data}) {
          if (data.status === 1) {
            self.toastMessage.body = '成功编辑任务'
            self.toastMessage.success = true
            self.toastMessage.show = true
          } else {
            self.toastMessage.body = '请与管理员联系'
            self.toastMessage.success = false
            self.toastMessage.show = true
          }
        }).catch(function (error) {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.success = false
          self.toastMessage.show = true
          console.log(error)
        })
        this.$router.go(-2)
      },
      addButtonPressed () {
        this.$router.push({path: '/add'})
      },
      logoutButtonPressed () {
        this.logoutDialogMessage.show = true
        this.logoutDialogMessage.body = '确定注销？'
      },
      logout () {
        this.$store.dispatch('clearAuth')
        this.$router.push({path: '/login'})
      },
      backButtonPressed () {
        this.$router.go(-1)
      },
      achieveButtonPressed () {
        this.dialogMessage.show = true
        this.dialogMessage.body = '确定完成此项任务？'
      },
      editButtonPressed () {
        let id = this.$route.params.id
        this.$router.push({path: `/supervisor/${id}/edit`})
      },
      deleteButtonPressed () {
        this.dialogMessage.show = true
        this.dialogMessage.body = '确定删除此项任务？'
      },
      dialogHandler () {
        if (this.$route.path.indexOf('unfinishedTasks') > -1) {
          this.achieveUnfinishedTask()
        } else {
          this.deleteSupervisedTask()
        }
      },
      achieveUnfinishedTask () {
        let self = this
        apiClient.post('/achieve', {ID: this.$route.params.id}).then(({data}) => {
          if (data.status === 1) {
            self.toastMessage.body = '成功完成任务'
            self.toastMessage.success = true
            self.toastMessage.show = true
            self.$router.go(-1)
          } else {
            self.toastMessage.body = '请与管理员联系'
            self.toastMessage.success = false
            self.toastMessage.show = true
          }
        }).catch((error) => {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.success = false
          self.toastMessage.show = true
          console.log(error)
        })
        this.dialogMessage.show = false
      },
      deleteSupervisedTask () {
        let self = this
        apiClient.post('/delete', {ID: this.$route.params.id}).then(({data}) => {
          if (data.status === 1) {
            self.toastMessage.body = '成功删除任务'
            self.toastMessage.success = true
            self.toastMessage.show = true
            self.$router.go(-1)
          } else {
            self.toastMessage.body = '请与管理员联系'
            self.toastMessage.success = false
            self.toastMessage.show = true
          }
        }).catch((error) => {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.success = false
          self.toastMessage.show = true
          console.log(error)
        })
        this.dialogMessage.show = false
      }
    },
    created () {
      this.$store.dispatch('checkAuth')
      this.$store.dispatch('checkDark')
      this.$store.commit('setMenu', menu)
      this.$store.dispatch('checkPageTitle', this.$route.path)
    }
  }
</script>
