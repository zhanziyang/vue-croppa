<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Prevent Whitespace</div>
      <div class="pt-2 pl-2">
        You can prevent white space from revealing while user is moving or zooming image. Just set the prop
        <code>prevent-white-space</code> to
        <code>true</code>.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                initial-image="/vue-croppa/static/500.jpeg"
                :prevent-white-space="preventWS"
                class="ml-1">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <v-layout>
            <v-flex>
              <v-switch v-model="preventWS"
                        label="preventWhiteSpace"></v-switch>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  export default {
    data () {
      return {
        croppa: {},
        preventWS: true
      }
    },
    props: {
      expand: Boolean
    },
    computed: {
      templateCode () {
        return `\
 <croppa v-model="croppa"
          initial-image="/vue-croppa/static/500.jpeg"
          :prevent-white-space="${this.preventWS}">
  </croppa>`
      }
    }
  }
</script>

