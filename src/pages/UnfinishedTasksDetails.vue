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
          <label>开始日期：</label>
          <input readonly style="outline:none;border-style:none;width:calc(100% - 128px)" v-model="task.BEGIN"></input>
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <div style="font-size:24px;line-height:32px">
          <label>截止日期：</label>
          <input readonly style="outline:none;border-style:none;width:calc(100% - 128px)" v-model="task.END"></input>
        </div>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-text>
        <div style="font-size:24px">
          <textarea readonly rows="8" style="outline:none;border-style:none;width:100%" v-model="task.CONTENT"></textarea>
        </div>
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
