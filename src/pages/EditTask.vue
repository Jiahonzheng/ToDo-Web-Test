<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>

      <v-card>
        <v-card-text>
          <div class="headline"> 来自： {{task.FROM}}</div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <div style="font-size:24px;line-height:32px">
            <label>送至：</label>
            <input style="outline:none;border-style:none;width:calc(100% - 80px)" v-model="task.TO" required autofocus list="usersName"></input>
            <datalist id="usersName">
              <option v-for="user in users">{{user.NAME}}</option>
            </datalist>
          </div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <div style="font-size:24px;line-height:32px">
            <label>截止日期：</label>
            <input style="outline:none;border-style:none;width:calc(100% - 128px)"type="date" v-model="task.END"></input>
          </div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <div style="font-size:24px">
            <textarea rows="8" placeholder="内容" style="outline:none;border-style:none;width:100%" v-model="task.CONTENT"></textarea>
          </div>
        </v-card-text>
      </v-card>

    </v-flex>

    <v-snackbar :timeout="3000" :right="true" v-model="toastMessage.show">{{toastMessage.body}}</v-snackbar>

  </v-layout>
</template>


<script>
  import apiClient from '../modules/apiClient'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        task: {
          ID: null,
          FROM: null,
          TO: null,
          CONTENT: null,
          BEGIN: null,
          END: null
        },
        toastMessage: {
          body: null,
          show: false
        },
        users: []
      }
    },
    methods: {
      initDetailsFragment () {
        this.task = this.tempTask
      },
      getUsers () {
        let self = this
        apiClient.post('/users', {userName: this.userName}).then(function ({data}) {
          self.users = []
          for (var i = 0; i < data.length; i++) {
            self.users.push(data[i])
          }
        }).catch(function (error) {
          self.toastMessage.body = '请与管理员联系'
          self.toastMessage.show = true
          console.log(error)
        })
      }
    },
    computed: {
      ...mapState(['tempTask'])
    },
    watch: {
      task: {
        handler: function () {
          this.$store.dispatch('setTempTask', this.task)
        },
        deep: true
      }
    },
    created () {
      window.scrollTo(0, 0)
      this.initDetailsFragment()
      this.getUsers()
    }
  }
</script>
