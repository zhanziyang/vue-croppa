<template>
  <v-app>
    <v-layout row
              wrap>
      <v-flex xs6>
        <h2>Vue Croppa</h2>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="width"
                      label="width"
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="width"
                          readonly
                          type="number"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="height"
                      label="height"
                      :max="500"
                      :min="100"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="height"
                          readonly
                          type="number"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-select v-bind:items="['default', 'black', 'grey', '#00bcd4', 'rgb(205, 220, 57)']"
                      v-model="canvasColor"
                      label="canvasColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="placeholder"
                          label="placeholder"
                          v-model="placeholder"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-text-field name="placeholderFontSize"
                          label="placeholderFontSize (px)"
                          type="number"
                          v-model="placeholderFontSize"></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-select v-bind:items="['default', 'white', 'grey', '#ffc107', 'rgb(0, 150, 136)']"
                      v-model="placeholderColor"
                      label="placeholderColor"></v-select>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="quality"
                      label="quality"
                      :max="5"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="quality"
                          readonly></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-slider v-model="zoomSpeed"
                      label="zoomSpeed"
                      :max="10"
                      :min="1"
                      :step="1"></v-slider>
          </v-flex>
          <v-flex xs2>
            <v-text-field v-model="zoomSpeed"
                          readonly></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`noWhiteSpace: ${noWhiteSpace.toString()}`"
                      v-model="noWhiteSpace"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout row
                  wrap>
          <v-flex xs9>
            <v-switch v-bind:label="`showRemoveButton: ${showRemoveButton.toString()}`"
                      v-model="showRemoveButton"></v-switch>
          </v-flex>
        </v-layout>
      </v-flex>
  
      <v-flex xs6>
        <croppa :width="width"
                :height="height"
                :canvas-color="canvasColor"
                :placeholder="placeholder"
                :placeholder-font-size="placeholderFontSize"
                :placeholder-color="placeholderColor"
                :quality="quality"
                :zoom-speed="zoomSpeed"
                :no-white-space="noWhiteSpace"
                :show-remove-button="showRemoveButton"
                @init="onCroppaInit"></croppa>
      </v-flex>
  
      <button @click="getDataUrl">获取地址</button>
      <button @click="reset">重置</button>
    </v-layout>
  </v-app>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        myCroppa: null,
        width: 400,
        height: 400,
        canvasColor: 'default',
        placeholder: 'Click To Upload',
        placeholderFontSize: 0,
        placeholderColor: 'default',
        quality: 2,
        zoomSpeed: 3,
        noWhiteSpace: false,
        showRemoveButton: false
      }
    },

    methods: {
      onCroppaInit (myCroppa) {
        this.myCroppa = myCroppa
      },

      getDataUrl () {
        this.myCroppa && console.log(this.myCroppa.generateDataUrl())
      },

      reset () {
        this.myCroppa && this.myCroppa.reset()
      }
    }
  }
</script>

<style lang="stylus">
  #app
    padding: 16px
</style>
