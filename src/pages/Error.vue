<template>
  <div class="text-center">
    <div class="jc">
      <v-card class="blue darken-1 white--text ma-4">
        <v-card-text>
          <div class="display-2">{{code}}</div>
          <p>{{message}}</p>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        code: this.$route.query.code || 404,
        message: this.$route.query.message || 'Page Not Found.'
      }
    }
  }
</script>
