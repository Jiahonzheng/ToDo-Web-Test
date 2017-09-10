<template>
  <v-app :dark="dark" standalone="standalone">
    <v-navigation-drawer v-model="drawer" persistent light overflow :dark="dark" enable-resize-watcher>
      <div class="pa-3 text-xs-center" v-show="!mini">
        <div class="display-2 py-4">Adminify</div>
        <p>{{'An admin dashboard based on Vuetify'}}</p>
        <div style="padding-left:5em;">
          <v-switch :label="(!dark ? 'Light' : 'Dark') + ' Theme'" v-model="dark" :dark="dark" hide-details="hide-details"></v-switch>
        </div>
        <div>
          <v-btn dark="dark" tag="a" href="https://github.com/wxs77577/adminify" primary="primary">
            <v-icon left="left" dark="dark">star</v-icon>
            <span>注销</span></v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list dense="dense">
        <template v-for="item in menu">
          <v-list-tile :to="item.href" router="router" ripple="ripple" :title="item.title">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{(item.title) }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="darken-1" fixed="fixed" dark="dark" :class="theme">
      <v-toolbar-side-icon dark="dark" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{pageTitle}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y="offset-y">
        <v-btn icon="icon" dark="dark" slot="activator">
          <v-icon dark="dark">format_paint</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile v-for="n in colors" :key="n" :class="n" @mouseover.native="theme = n"></v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>
    <main>
      <v-container class="pa-4" fluid="fluid">
        <v-alert v-bind="message" v-model="message.body" dismissible="dismissible">{{message.body}}</v-alert>
        <div class="py-2">
          <v-slide-y-transition mode="out-in">
            <router-view></router-view>
          </v-slide-y-transition>
        </div>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data () {
      return {
        dark: false,
        theme: 'primary',
        mini: false,
        drawer: true,
        colors: ['blue', 'green', 'purple', 'red']
      }
    },
    computed: {
      ...mapState(['message', 'menu', 'pageTitle'])
    },
    methods: {
      fetchMenu () {
      }
    },
    created () {
      this.fetchMenu()
    }
  }
</script>
