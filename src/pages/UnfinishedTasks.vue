<template>
  <div class="text-center">
    <v-container fluid style="min-height: 0;" grid-list-lg>
      <v-layout column wrap>
          <v-flex xs12 v-for="task in tasks" :key="task.ID">
            <v-card>
              <v-card-title primary-title>
                <div class="headline">
                  <span>{{task.FROM}}</span>
                  <span>{{task.END}}</span>
                </div>
              </v-card-title>
              <v-card-text>
                <p class="headline">{{task.CONTENT}}</p>
              </v-card-text>
            </v-card>
          </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
  import apiClient from '../modules/apiClient'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        tasks: ['TEST']
      }
    },
    computed: {
      ...mapState(['userName'])
    },
    methods: {
      checkUnfinishedTasks () {
        let self = this
        apiClient.post('/receive', {userName: this.userName, status: 0}).then(function ({data}) {
          self.tasks = data
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
