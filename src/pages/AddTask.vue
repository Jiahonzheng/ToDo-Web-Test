<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 来自： {{userName}}</div>
        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>

            <div class="headline" height="0"><v-text-field name="taskTo" single-line v-model="task.TO"></v-text-field></div>

          <!--<span>送至： <v-text-field name="taskTo" single-line></v-text-field></span>-->

        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 开始日期： {{task.BEGIN}}</div>
        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 截止日期： {{task.END}}</div>
        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 内容：</div>
        </v-card-title>
        <v-card-text>
          <p style="word-wrap: break-word" class="headline">
            {{task.CONTENT}}
          </p>
        </v-card-text>
      </v-card>

    </v-flex>

    <v-snackbar :timeout="3000" :right="true" v-model="toastMessage.show">{{toastMessage.body}}</v-snackbar>

  </v-layout>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        task: {
          FROM: null,
          TO: null,
          CONTENT: '123456',
          BEGIN: '2017-9-22',
          END: '2017-9-23'
        },
        toastMessage: {
          body: null,
          show: false
        }
      }
    },
    computed: {
      ...mapState(['userName'])
    },
    watch: {
      task: {
        handler: function () {
          this.$store.dispatch('setTempTask', this.task)
        },
        deep: true
      }
    },
    methods: {
    },
    created () {
      window.scrollTo(0, 0)
      this.task.FROM = this.userName
    }
  }
</script>
