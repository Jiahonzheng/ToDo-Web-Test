<template>
  <v-app :dark="dark" standalone="standalone">

    <v-navigation-drawer v-model="drawer" persistent light overflow :dark="dark" enable-resize-watcher>

      <div class="pa-3 text-xs-center" v-show="!mini">
        <div class="display-2 py-4">{{userName}}</div>
        <div style="padding-left:5em;">
          <v-switch :label="(!dark ? 'Light' : 'Dark') + ' Theme'" v-model="dark" :dark="dark" hide-details="hide-details"></v-switch>
        </div>
        <div>
          <v-btn dark="dark" tag="a" @click.native.stop="logoutButtonPressed" primary="primary">
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

      <v-toolbar-side-icon v-if="isDetailsFragment" dark="dark" @click="backButtonPressed">
        <v-icon>chevron_left</v-icon>
      </v-toolbar-side-icon>

      <v-toolbar-side-icon v-else dark="dark" @click.stop="drawer = !drawer">
      </v-toolbar-side-icon>

      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon dark v-if="!isUnfinishedTasksDetailsFragment && !isSupervisorDetailsFragment && !isAllTasksDetailsFragment">
        <v-icon>add</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isUnfinishedTasksDetailsFragment" @click.native.stop="achieveButtonPressed">
        <v-icon>check</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isSupervisorDetailsFragment">
        <v-icon>edit</v-icon>
      </v-btn>

      <v-btn icon dark v-if="isSupervisorDetailsFragment" @click.native.stop="deleteButtonPressed">
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

    <v-snackbar :timeout="3000" :right="true" v-model="toastMessage.show">{{toastMessage.body}}</v-snackbar>

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

  </v-app>
</template>

<script>
  import {mapState} from 'vuex'
  import menu from '../modules/menu'
  import apiClient from '../modules/apiClient'
  export default {
    data () {
      return {
        dark: false,
        theme: 'primary',
        mini: false,
        drawer: true,
        toastMessage: {
          body: null,
          show: false
        },
        dialogMessage: {
          body: null,
          show: false
        }
      }
    },
    computed: {
      ...mapState(['menu', 'pageTitle', 'userName']),
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
        console.log('hell')
        return false
      }
    },
    methods: {
      logoutButtonPressed () {
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
      deleteButtonPressed () {
        this.dialogMessage.show = true
        this.dialogMessage.body = '确定完成此项任务？'
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
            self.toastMessage.show = true
            self.$router.go(-1)
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
      },
      deleteSupervisedTask () {
        let self = this
        apiClient.post('/delete', {ID: this.$route.params.id}).then(({data}) => {
          if (data.status === 1) {
            self.toastMessage.body = '成功删除任务'
            self.toastMessage.show = true
            self.$router.go(-1)
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
      this.$store.dispatch('checkAuth')
      this.$store.commit('setMenu', menu)
      this.$store.dispatch('checkPageTitle', this.$route.path)
    }
  }
</script>
