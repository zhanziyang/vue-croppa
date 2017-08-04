<template>
  <div id="index">
    <h2>
      <span class="header">Vue</span>
      <span class="header">Croppa</span>
      <span class="subheader">A simple straightforward customizable lightweight mobile-friendly image cropper for Vue 2.0.</span>
    </h2>
    <div class="text-xs-center">
      <v-chip class="orange white--text">
        What You See Is What You Get
        <v-icon right>star</v-icon>
      </v-chip>
      <v-chip class="orange white--text">
        24kb In Total
        <v-icon right>star</v-icon>
      </v-chip>
      <v-chip class="orange white--text">
        Hightly Customizable
        <v-icon right>star</v-icon>
      </v-chip>
      <v-chip class="orange white--text">
        Mobile Friendly
        <v-icon right>star</v-icon>
      </v-chip>
    </div>
    <br>
    <v-card class="teal darken-2 white--text">
      <v-container fluid
                   grid-list-lg>
        <v-layout row-md
                  column>
          <v-flex md4>
            <div>
              <p class="tip">
                <i class="headline iconfont icon-pc"> on comptuters</i>
                <li class="subheading">Drag and drop a file</li>
                <li class="subheading">Click to choose a file</li>
                <li class="subheading">Drag to move</li>
                <li class="subheading">Scroll to zoom</li>
              </p>
              <br>
              <p class="tip">
                <i class="headline iconfont icon-mobile"> on mobile devices</i>
                <li class="subheading">Tab to choose a file</li>
                <li class="subheading">Drag to move</li>
                <li class="subheading">Pinch with two fingers to zoom</li>
                <li class="subheading">Rotate with two fingers</li>
              </p>
            </div>
          </v-flex>
          <v-flex md8>
            <img src=""
                 class="preload"
                 ref="preload">
            <croppa v-model="myCroppa"
                    :width="+width"
                    :height="+height"
                    :canvas-color="canvasColor"
                    :placeholder="placeholder"
                    :placeholder-font-size="+placeholderFontSize"
                    :placeholder-color="placeholderColor"
                    :disabled="disabled"
                    :prevent-white-space="preventWhiteSpace"
                    :reverse-scroll-to-zoom="reverseScrollToZoom"
                    :show-remove-button="showRemoveButton"
                    :remove-button-color="removeButtonColor"
                    :remove-button-size="+removeButtonSize"
                    @file-choose="handleCroppaFileChoose"
                    @file-size-exceed="handleCroppaFileSizeExceed"
                    @file-type-mismatch="handleCroppaFileTypeMismatch"
                    @image-remove="handleImageRemove"
                    @move="handleCroppaMove"
                    @zoom="handleCroppaZoom">
              <img crossOrigin="anonymous"
                   :src="initialImageSrc"
                   slot="initial"
                   v-if="withInitialImage">
            </croppa>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  
    <br>
    <v-layout>
      <v-flex xs12
              order-md1>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-slider v-model="width"
                      label="width"
                      thumb-label
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-slider v-model="height"
                      label="height"
                      thumb-label
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-select :items="['', 'black', 'grey', '#00bcd4', 'rgb(205, 220, 57)']"
                      v-model="canvasColor"
                      @input="onInput"
                      label="canvasColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch :label="`set initial image`"
                      v-model="withInitialImage"></v-switch>
          </v-flex>
          <v-flex md8>
            <v-text-field name="initialImageSrc"
                          label="initial image url"
                          v-model="initialImageSrc"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-text-field name="placeholder"
                          label="placeholder"
                          v-model="placeholder"></v-text-field>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-text-field name="placeholderFontSize"
                          label="placeholderFontSize (px)"
                          type="number"
                          v-model="placeholderFontSize"></v-text-field>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-select :items="['', 'white', 'grey', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="placeholderColor"
                      label="placeholderColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch :label="`disabled`"
                      v-model="disabled"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch :label="`preventWhiteSpace`"
                      v-model="preventWhiteSpace"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-switch :label="`reverseScrollToZoom`"
                      v-model="reverseScrollToZoom"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex md4
                  xs12>
            <v-switch :label="`showRemoveButton`"
                      v-model="showRemoveButton"></v-switch>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-select :items="['red', 'black', 'purple', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="removeButtonColor"
                      label="removeButtonColor"></v-select>
          </v-flex>
          <v-flex md4
                  xs12>
            <v-text-field name="removeButtonSize"
                          label="removeButtonSize (px)"
                          type="number"
                          v-model="removeButtonSize"></v-text-field>
          </v-flex>
        </v-layout>
        <v-btn block
               secondary
               large
               dark>More Customizations</v-btn>
        <br>
      </v-flex>
    </v-layout>
  
    <br>
    <pre v-highlightjs="code"><code class="html" style="margin-bottom: 16px"></code></pre>
    <div class="headline">Browser Support</div>
    <v-divider></v-divider>
    <ul class="bs-list pt-2">
      <li>IE 10+</li>
      <li>Firefox 3.6+</li>
      <li>Chrome 6+</li>
      <li>Safari 6+</li>
      <li>Opera 11.5+</li>
      <li>iOS Safari 6.1+</li>
      <li>Android Browser 3+</li>
    </ul>
    <br>
    <div class="headline">License</div>
    <v-divider></v-divider>
    <p class="pt-2">ISC License (ISC)
      <br> Copyright 2017 Chris Chan</p>
  
  </div>
</template>

<script>
  export default {
    data () {
      return {
        myCroppa: {},
        width: 350,
        height: 350,
        canvasColor: '',
        placeholder: 'Choose an image',
        placeholderFontSize: 0,
        placeholderColor: '',
        disabled: false,
        preventWhiteSpace: false,
        disablePinchToZoom: false,
        reverseScrollToZoom: false,
        showRemoveButton: true,
        removeButtonColor: 'red',
        removeButtonSize: 0,
        withInitialImage: false,
        initialImageSrc: 'https://zhanziyang.github.io/vue-croppa/static/initial-image.png'
      }
    },

    computed: {
      code () {
        return `\
  <!-- Sync with your customizations above! -->
  <croppa v-model="myCroppa"
          :width="${this.width}"
          :height="${this.height}"
          canvas-color="${this.canvasColor}"
          placeholder="${this.placeholder}"
          :placeholder-font-size="${this.placeholderFontSize}"
          placeholder-color="${this.placeholderColor}"
          :disabled="${this.disabled}"
          :prevent-white-space="${this.preventWhiteSpace}"
          :reverse-scroll-to-zoom="${this.reverseScrollToZoom}"
          :show-remove-button="${this.showRemoveButton}"
          remove-button-color="${this.removeButtonColor}"
          :remove-button-size="${this.removeButtonSize}"
          @file-choose="handleCroppaFileChoose"
          @file-size-exceed="handleCroppaFileSizeExceed"
          @file-type-mismatch="handleCroppaFileTypeMismatch"
          @image-remove="handleImageRemove"
          @move="handleCroppaMove"
          @zoom="handleCroppaZoom">\
    ${this.withInitialImage ? `
    <img crossOrigin="anonymous"
         src="${this.initialImageSrc}"
         slot="initial">` : ''
          }
  </croppa > `
      }
    },

    beforeMount () {
      let windowWidth = window.innerWidth
      if (windowWidth < 400) {
        this.width = 250
        this.height = 250
      }
    },

    mounted () {
      this.$refs.preload.src = 'https://zhanziyang.github.io/vue-croppa/static/initial-image.png'
    },

    watch: {
      withInitialImage: function () {
        this.refresh()
      },
      initialImageSrc: function () {
        this.refresh()
      }
    },

    methods: {
      getDataUrl () {
        alert(this.myCroppa.generateDataUrl())
      },

      async printBlob () {
        let blob = await this.myCroppa.promisedBlob()
        console.log(blob)
      },

      refresh () {
        this.myCroppa.refresh()
      },

      remove () {
        this.myCroppa.remove()
      },

      zoomIn () {
        this.myCroppa.zoomIn()
      },

      chooseFile () {
        this.myCroppa.chooseFile()
      },

      moveUp () {
        this.myCroppa.moveUpwards(5)
      },

      handleCroppaInit () {
        console.log('init')
      },

      handleCroppaFileChoose (file) {
        console.log('file chose')
        console.log(file)
      },

      handleCroppaFileSizeExceed (file) {
        console.log('file size exceeded')
        console.log(file)
      },

      handleCroppaFileTypeMismatch (file) {
        console.log('file type mismatch')
        console.log(file)
      },

      handleImageRemove () {
        console.log('image removed')
      },

      handleCroppaMove () {
        console.log('moved')
      },

      handleCroppaZoom () {
        console.log('zoomed')
      },

      onInput () {
        console.log('sdjfk')
      }
    }

  }
</script>


<style lang="stylus">
  @font-face {
    font-family: 'Black Ops One';
    font-style: normal;
    font-weight: 400;
    src: local('Black Ops One'), local('BlackOpsOne-Regular'), url(https://fonts.gstatic.com/s/blackopsone/v7/2XW-DmDsGbDLE372KrMW1TxObtw73-qQgbr7Be51v5c.woff2) format('woff2');
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;
  }
  h2
    position: relative
    text-align: center
    @media screen and (max-width: 600px)
      padding-bottom: 1px
      margin-bottom: 4px
    span.header
      font-family: 'Black Ops One', cursive
    span.header:first-child
      color: #41b883
    span.header:nth-child(2)
      color: #35495e
    img
      position: absolute
      right: 12px
      width: 60px
      bottom: 0px
      transition: all .3s
      &:hover
        opacity: .7
  .subheader
    padding: 0
    font-size: 20px
    margin: 10px 0
    text-align: center
    display: block
    height: auto
    @media screen and (max-width: 600px)
      font-size: 14px
      margin: 4px 0
  .croppa-container
    float: right
</style>
