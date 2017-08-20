<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Output Image Size</div>
      <div class="pt-2 pl-2">NOTIC: We are talking about
        <strong>image visual size like 200X200 etc</strong>, not file size like xxx kb.</div>
      <div class="pt-2 pl-2">There are three props that determine the output image size:
        <code>width</code>,
        <code>height</code> and
        <code>quality</code>.
      </div>
      <div class="pt-2 pl-2">
        <code>width</code> and
        <code>height</code> is the component's size, i.e. the size you see, while
        <code>quality</code> describes how many times larger the output image will be than the size you see.
      </div>
      <div class="pt-2 pl-2">
        So,
        <code>output_image_width = width * quality</code>, and
        <code>output_image_height = height * quality</code>
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                initial-image="/vue-croppa/static/500.jpeg"
                :width="+width"
                :height="+height"
                :quality="+quality"
                class="ml-1"
                @image-remove="outputUrl = ''">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="sizeCroppaCode"><code class="html"></code></pre>
          <v-layout>
            <v-flex>
              <v-text-field v-model="width"
                            type="number"
                            label="width"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="height"
                            type="number"
                            label="height"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="quality"
                            type="number"
                            label="quality"></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn @click.native="sizeCroppaPreview"
                 class="teal ml-0 white--text">view output</v-btn>
        </v-flex>
      </v-layout>
      <img :src="outputUrl"
           class="ma-2">
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  export default {
    data () {
      return {
        croppa: {},
        width: 250,
        height: 250,
        quality: 2,
        outputUrl: ''
      }
    },

    props: {
      expand: Boolean
    },

    computed: {
      sizeCroppaCode () {
        return `\
 <croppa v-model="croppa"
          initial-image="/vue-croppa/static/500.jpeg"
          :width="${this.width}"
          :height="${this.height}"
          :quality="${this.quality}">
  </croppa>`
      }
    },

    watch: {
      'width': function () {
        this.croppa.refresh()
        this.outputUrl = ''
      },
      'height': function () {
        this.croppa.refresh()
        this.outputUrl = ''
      },
      'quality': function () {
        this.croppa.refresh()
        this.outputUrl = ''
      }
    },

    methods: {
      sizeCroppaPreview () {
        this.outputUrl = this.croppa.generateDataUrl()
      }
    }
  }
</script>


