<template>
  <v-expansion-panel expand
                     dark>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Appearance</div>
      <div class="pt-2 pl-2">
        You can change croppa's default appearance through some props or css.
      </div>
      <div class="pt-2 pl-2">
        Note 1:
        <code>canvas-color</code> affects the output image - it will fill out the transparent parts of the image. So if you want the transparent part remain transparent, you should use css to change the background color. Since v0.2.0,
        <code>canvas-color</code> is transparent by default.
      </div>
      <div class="pt-2 pl-2">
        Note 2: CSS style won't have any effect on the output image.
      </div>
      <div class="pt-2 pl-2">
        Note 3: You can still call
        <code>remove()</code> method to remove current image after hiding the default "remove button".
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                :width="+width"
                :height="+height"
                :placeholder="placeholder"
                :placeholder-color="placeholderColor"
                :placeholder-font-size="+placeholderFontSize"
                :canvas-color="canvasColor"
                :show-remove-button="showRemoveButton"
                :remove-button-color="removeButtonColor"
                :remove-button-size="+removeButtonSize"
                class="ml-1">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <br>
          <pre v-highlightjs="cssCode"><code class="css"></code></pre>
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
              <v-text-field v-model="canvasColor"
                            label="canvasColor"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-text-field v-model="placeholder"
                            label="placeholder"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="placeholderColor"
                            label="placeholderColor"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="placeholderFontSize"
                            label="placeholderFontSize"></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout>
            <v-flex>
              <v-switch v-model="showRemoveButton"
                        label="showRemoveButton"></v-switch>
            </v-flex>
            <v-flex>
              <v-text-field v-model="removeButtonSize"
                            label="removeButtonSize"></v-text-field>
            </v-flex>
            <v-flex>
              <v-text-field v-model="removeButtonColor"
                            label="removeButtonColor"></v-text-field>
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
        width: 350,
        height: 630,
        placeholder: 'Yes, you can modify the text here',
        placeholderColor: '#000',
        placeholderFontSize: 16,
        canvasColor: 'transparent',
        showRemoveButton: true,
        removeButtonColor: 'black',
        removeButtonSize: ''
      }
    },

    props: {
      expand: Boolean
    },

    computed: {
      templateCode () {
        return `\
 <croppa v-model="croppa"
          :width="${this.width}"
          :height="${this.height}"
          placeholder="${this.placeholder}"
          placeholder-color="${this.placeholderColor}"
          :placeholder-font-size="${this.placeholderFontSize}"
          canvas-color="${this.canvasColor}"
          :show-remove-button="${this.showRemoveButton}"
          remove-button-color="${this.removeButtonColor}"
          :remove-button-size="${this.removeButtonSize}">
  </croppa>`
      },

      cssCode () {
        return `\
 .croppa-container {
    background-color: lightblue;
    border: 2px solid grey;
    border-radius: 8px;
  }
  
  .croppa-container:hover {
    opacity: 1;
    background-color: #8ac9ef;
  }`
      }
    }
  }
</script>

<style scoped>
  .croppa-container {
    border-radius: 4px;
    /* background: url('~/static/dashed-border.png') center/94% 94% no-repeat; */
    background-color: lightblue;
    border: 2px solid grey;
  }
  
  .croppa-container>>>canvas {
    border-radius: 2px;
  }
  
  .croppa-container:hover {
    opacity: 1;
    background-color: #8ac9ef;
  }
</style>



