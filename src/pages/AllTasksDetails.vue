<template>
  <v-layout row>
    <v-flex xs12 sm6 offset-sm3>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 来自： {{task.FROM}}</div>
        </v-card-title>
      </v-card>

      <v-card>
        <v-card-title primary-title>
          <div class="headline"> 送至： {{task.TO}}</div>
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
    created () {
      window.scrollTo(0, 0)
      this.initDetailsFragment()
    }
  }
</script>
