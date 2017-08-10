<template>
  <v-app standalone>
    <v-navigation-drawer persistent
                         v-model="drawer"
                         :mini-variant.sync="mini"
                         light
                         overflow>
      <v-toolbar flat
                 class="transparent">
        <v-list class="pa-0">
  
          <v-list-tile avatar
                       tag="ul">
            Vue Croppa</v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="py-0">
        <template v-for="(item, index) in items">
          <v-divider v-if="item.divider"
                     :key="index"></v-divider>
          <v-list-tile v-else
                       :class="[{'active': $route.path == item.link}]"
                       router
                       :href="'#' + item.link"
                       :key="index">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
  
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar dark>
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>{{page ? pageFormatted : 'Introduction'}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn class="grey darken-3"
             href="https://github.com/zhanziyang/vue-croppa"
             tag="a">
        GITHUB
      </v-btn>
      <v-btn class="grey darken-3"
             href="https://github.com/zhanziyang/vue-croppa/blob/master/README.md#documentation"
             tag="a">DOC</v-btn>
    </v-toolbar>
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        drawer: true,
        items: [
          { divider: true },
          { title: 'Introduction', icon: 'dashboard', link: '/' },
          { title: 'Quick Start', icon: 'question_answer', link: '/quick-start' },
          { divider: true },
          { title: 'Registration', icon: 'power', link: '/registration' },
          { title: 'Customization', icon: 'settings', link: '/customization' },
          { title: 'File Input', icon: 'file_download', link: '/file-input' },
          { title: 'Manipulation', icon: 'content_cut', link: '/manipulation' },
          { title: 'File Output', icon: 'file_upload', link: '/file-output' },
          { divider: true },
          { title: 'Help', icon: 'help', link: '/help' },
          { title: 'Demos', icon: 'content_copy', link: '/demos' }
        ],
        mini: false,
        right: null
      }
    },

    computed: {
      page () {
        return this.$route.path.slice(1)
      },

      pageFormatted () {
        return this.page.split('-').map(word => {
          var letters = word.split('')
          letters[0] = letters[0].toUpperCase()
          return letters.join('')
        }).join(' ')
      }
    },

    beforeMount () {
      let windowWidth = window.innerWidth
      if (windowWidth < 400) {
        this.drawer = false
      }
    }
  }
</script>

<style lang="stylus">
code
  font-size: 14px
  font-family: Consolas, Monaco, monospace
.preload
  width: 0
  height: 0
  visibility: 0
  display: block
.navigation-drawer li.active .icon
  color: #41b883
</style>
