<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Initial Image Position</div>
      <div class="pt-2 pl-2">
        <code>initial-position</code> works similar to css's background-position. It specifies the image's position relative to croppa container when it is first loaded.
      </div>
      <div class="pt-2 pl-2">It accepts one of these as its value:
      </div>
      <div class="pt-2 pl-2">
        <ul>
          <li>
            <code>'center'</code> (default value)</li>
          <li>
            <code>'30% 40%'</code> (similar to background-position in css)</li>
          <li>
            <code>'top'</code>
          </li>
          <li>
            <code>'bottom'</code>
          </li>
          <li>
            <code>'left'</code>
          </li>
          <li>
            <code>'right'</code>
          </li>
          <li>
            <code>'top left'</code> or
            <code>'left top'</code>
          </li>
          <li>
            <code>'top right'</code> or
            <code>'right top'</code>
          </li>
          <li>
            <code>'bottom left'</code> or
            <code>'left bottom'</code>
          </li>
          <li>
            <code>'bottom right'</code> or
            <code>'right bottom'</code>
          </li>
        </ul>
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                initial-image="https://unsplash.it/600/500"
                initial-size="natural"
                :initial-position="position"
                class="ml-1">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <br>
          <v-layout>
            <v-flex>
              <v-select :items="['center', '100% 20%', 'left', 'bottom', 'right bottom']"
                        v-model="position"
                        @input="onChange"
                        label="initialPosition"></v-select>
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
        position: 'center'
      }
    },
    props: {
      expand: Boolean
    },
    computed: {
      templateCode () {
        return `\
 <croppa v-model="croppa"
          initial-image="https://unsplash.it/600/500"
          initial-size="natural"
          initial-position="${this.position}">
  </croppa>`
      }
    },
    methods: {
      onChange () {
        this.croppa.refresh()
      }
    }
  }
</script>

