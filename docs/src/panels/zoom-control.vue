<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Zooming Control</div>
      <div class="pt-2 pl-2">
        You can adjust speed and direction of the zooming behavior through
        <code>zoom-speed</code> and
        <code>reverse-scroll-to-zoom</code> props. The default
        <code>zoom-speed</code> is
        <code>3</code>.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                initial-image="/vue-croppa/static/500.jpeg"
                :zoom-speed="+zoomSpeed"
                :reverse-scroll-to-zoom="reverse"
                class="ml-1">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <v-layout>
            <v-flex>
              <v-slider v-model="zoomSpeed"
                        label="speed"
                        thumb-label
                        :step="1"
                        :min="1"
                        :max="10"
                        snap></v-slider>
            </v-flex>
            <v-flex class="ml-5">
              <v-switch v-model="reverse"
                        label="reverseScrollToZoom"></v-switch>
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
        zoomSpeed: 5,
        reverse: false
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
          :zoom-speed="${this.zoomSpeed}"
          :reverse-scroll-to-zoom="${this.reverse}">
  </croppa>`
      }
    }
  }
</script>

