<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>

      <v-card>
        <v-card-title primary-title>
          <div class="headline" height="0"><v-text-field name="taskTO" single-line v-model="task.TO"></v-text-field></div>
        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 开始日期： {{task.BEGIN}}</div>
        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>
          <!--<div class="headline"> 开始日期： {{task.BEGIN}}</div>-->
          <div class="headline" height="0"><v-text-field name="taskEND" single-line v-model="task.END"></v-text-field></div>
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
        }
      }
    },
    methods: {
      initDetailsFragment () {
        this.task = this.tempTask
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
    }
  }
</script>
