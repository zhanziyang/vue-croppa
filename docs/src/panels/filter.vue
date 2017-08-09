<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Input Filter</div>
      <div class="pt-2 pl-2">
        You can specify the formats and max size of files that users can choose from. And react to it when user chooses an invalid file.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <croppa v-model="croppa"
                placeholder="Choose a file > 100kb or drag and drop a non-png file"
                :placeholder-font-size="12"
                :width="380"
                :height="386"
                :accept="accept"
                :file-size-limit="+sizeLimit"
                @file-type-mismatch="onFileTypeMismatch"
                @file-size-exceed="onFileSizeExceed"
                class="ml-1">
        </croppa>
        <v-flex class="ml-2">
          <pre v-highlightjs="templateCode"><code class="html"></code></pre>
          <br>
          <pre v-highlightjs="scriptCode"><code class="javascript"></code></pre>
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
        accept: 'image/png',
        sizeLimit: 1024 * 100
      }
    },

    props: {
      expand: Boolean
    },

    computed: {
      templateCode () {
        return `\
 <croppa v-model="croppa"
          accept="${this.accept}"
          :file-size-limit="${this.sizeLimit}"
          @file-type-mismatch="onFileTypeMismatch"
          @file-size-exceed="onFileSizeExceed">
  </croppa>`
      },

      scriptCode () {
        return `\
 {
    methods: {
      onFileTypeMismatch (file) {
        alert('Invalid file type. Please choose a jpeg or png file.')
      },
      onFileSizeExceed (file) {
        alert('File size exceeds. Please choose a file smaller than 100kb.')
      }
    }
  }`
      }
    },

    methods: {
      onFileTypeMismatch (file) {
        alert('Invalid file type. Please choose a png file.')
      },
      onFileSizeExceed (file) {
        alert('File size exceeds. Please choose a file smaller than 100kb.')
      }
    }
  }
</script>


