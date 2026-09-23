<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Initial Image Size</div>
      <div class="pt-2 pl-2">
        <code>initial-size</code> works similar to css's background-size. It specifies the image's size when it is first loaded on croppa.
      </div>
      <div class="pt-2 pl-2">It accepts one of these three strings as its value:
        <code>'cover'</code> (default value),
        <code>'contain'</code> and
        <code>'natural'</code>.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                initial-image="/vue-croppa/static/500.jpeg"
                :initial-size="size"
                class="ml-1">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <br>
          <v-layout>
            <v-radio v-for="item in ['cover', 'contain', 'natural']"
                     :key="item"
                     v-model="size"
                     :value="item"
                     :label="item"
                     hide-details
                     @change="onChange"></v-radio>
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
        size: 'cover'
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
          initial-size="${this.size}">
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

