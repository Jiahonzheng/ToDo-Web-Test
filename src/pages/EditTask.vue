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
            <input style="outline:none;border-style:none;width:calc(100% - 80px)" v-model="task.TO" required autofocus></input>
          </div>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-text>
          <div style="font-size:24px;line-height:32px">
            <label>截止日期：</label>
            <input style="outline:none;border-style:none;width:calc(100% - 128px)" v-model="task.END"></input>
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
