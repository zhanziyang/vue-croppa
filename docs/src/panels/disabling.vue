<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Disablings</div>
      <div class="pt-2 pl-2">
        You can turn off one or all built-in features through some props.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <div>
          <croppa v-model="croppa"
                  :width="380"
                  :height="440"
                  :disabled="disabled"
                  :disable-click-to-choose="disabledClickToChoose"
                  :disable-drag-and-drop="disabledDragAndDrop"
                  :disable-drag-to-move="disabledDragToMove"
                  :disable-scroll-to-zoom="disableScrollToZoom"
                  :disable-pinch-to-zoom="disablePinchToZoom"
                  :disable-rotation="disableRotation"
                  class="ml-1">
          </croppa>
          <br>
          <v-btn @click.native="rotate">rotate</v-btn>
        </div>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <br>
          <v-layout>
            <v-flex>
              <v-switch v-model="disabled"
                        label="disabled (all)"></v-switch>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-switch v-model="disabledClickToChoose"
                        label="disabledClickToChoose"></v-switch>
            </v-flex>
            <v-flex>
              <v-switch v-model="disabledDragAndDrop"
                        label="disabledDragAndDrop"></v-switch>
            </v-flex>
            <v-flex>
              <v-switch v-model="disabledDragToMove"
                        label="disabledDragToMove"></v-switch>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-switch v-model="disableScrollToZoom"
                        label="disableScrollToZoom"></v-switch>
            </v-flex>
            <v-flex>
              <v-switch v-model="disablePinchToZoom"
                        label="disablePinchToZoom"></v-switch>
            </v-flex>
            <v-flex>
              <v-switch v-model="disableRotation"
                        label="disableRotation"></v-switch>
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
        disabled: true,
        disabledClickToChoose: true,
        disabledDragAndDrop: true,
        disabledDragToMove: true,
        disableScrollToZoom: true,
        disablePinchToZoom: true,
        disableRotation: true
      }
    },

    props: {
      expand: Boolean
    },

    computed: {
      templateCode () {
        return `\
 <croppa v-model="croppa"
          :disabled="${this.disabled}"
          :disable-click-to-choose="${this.disabledClickToChoose}"
          :disable-drag-and-drop="${this.disabledDragAndDrop}"
          :disable-drag-to-move="${this.disabledDragToMove}"
          :disable-scroll-to-zoom="${this.disableScrollToZoom}"
          :disable-pinch-to-zoom="${this.disablePinchToZoom}"
          :disable-rotation="${this.disableRotation}">
  </croppa>`
      }
    },

    methods: {
      rotate () {
        this.croppa.rotate()
      }
    }
  }
</script>


