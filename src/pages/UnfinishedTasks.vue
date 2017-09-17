<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>
      <v-list two-line v-if="!!tasks.length">
        <template v-for="(task, index) in tasks">
          <v-list-tile :key="index" avatar ripple @click="">

            <v-list-tile-content>
              <v-list-tile-title>{{task.FROM}}</v-list-tile-title>
              <v-list-tile-sub-title>{{task.CONTENT}}</v-list-tile-sub-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-list-tile-action-text>{{task.END}}</v-list-tile-action-text>

              <span>
                <v-btn icon fab>
                  <v-icon>check</v-icon>
                </v-btn>
              </span>

            </v-list-tile-action>
          </v-list-tile>
          <v-divider v-if="index + 1 < tasks.length"></v-divider>
        </template>
      </v-list>

    </v-flex>
  </v-layout>
</template>

<!--
<template>
  <div class="text-center">
    <v-container fluid style="min-height: 0;" grid-list-lg>
      <v-layout column wrap>
        <template v-if="!!tasks.length">
          <v-flex xs12 v-for="task in tasks" :key="task.ID">
            <v-card>
              <v-card-title secondary-title>
                <p class="headline">{{task.FROM}}</p>
                <p class="headline">{{task.END}}</p>
              </v-card-title>
              <v-card-text>
                <span>{{task.CONTENT}}</span>
              </v-card-text>
            </v-card>
          </v-flex>
        </template>
      </v-layout>
    </v-container>
  </div>
</template>
-->

<script>
  import apiClient from '../modules/apiClient'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        tasks: []
      }
    },
    computed: {
      ...mapState(['userName'])
    },
    methods: {
      checkUnfinishedTasks () {
        let self = this
        apiClient.post('/receive', {userName: this.userName, status: 0}).then(function ({data}) {
          // self.tasks = data
          for (var i = 0; i < data.length; i++) {
            data[i].BEGIN = global.helper.dateArithmetic.toLocal(data[i].BEGIN)
            data[i].END = global.helper.dateArithmetic.toLocal(data[i].END)
            self.tasks.push(data[i])
          }
        }).catch(function (error) {
          console.log(error)
        })
      }
    },
    created () {
      this.checkUnfinishedTasks()
    }
  }
</script>
