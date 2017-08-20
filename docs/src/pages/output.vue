<template>
  <div id="manipulation">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Base64 data url</div>
            <div class="pt-2 pl-2">
              Use method
              <code>generateDataUrl (mimetype, compressionRate)</code> to get the base64 data url. You can specify mimetype and compressionRate to compress the file size.
              <v-layout>
                <v-flex>
                  <p data-height="300"
                     data-theme-id="19967"
                     data-slug-hash="gxmXMJ"
                     data-default-tab="html,result"
                     data-user="zhanziyang"
                     data-embed-version="2"
                     data-pen-title="Vue Croppa data url"
                     class="codepen">See the Pen
                    <a href="https://codepen.io/zhanziyang/pen/gxmXMJ/">Vue Croppa data url</a> by Chris (
                    <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                    <a href="https://codepen.io">CodePen</a>.</p>
                </v-flex>
              </v-layout>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Blob</div>
            <div class="pt-2 pl-2">
              <blockquote>A Blob object represents a file-like object of immutable, raw data. Blobs represent data that isn't necessarily in a JavaScript-native format. The File interface is based on Blob, inheriting blob functionality and expanding it to support files on the user's system.</blockquote>
            </div>
            <div class="pt-2 pl-2 pb-2">
              Use methods:
              <ul>
                <li>
                  <code>generateBlob(callback, mimeType, compressionRate)</code>. The callback function has the resulting Blob object as a single argument. You can specify mimetype and compressionRate to compress the file size. This method is a wrapper around
                  <a href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob">HTMLCanvasElement.toBlob()</a>.</li>
                <li>
                  <code>(async) promisedBlob(mimeType, compressionRate)</code>. Same as above except it returns a Promise wrapping around generateBlob(), so that you can use async/await syntax instead of a callback to get blob data, it's simpler.</li>
              </ul>
              <v-layout>
                <v-flex>
                  <p data-height="300"
                     data-theme-id="19967"
                     data-slug-hash="qXrpmW"
                     data-default-tab="js,result"
                     data-user="zhanziyang"
                     data-embed-version="2"
                     data-pen-title="Vue Croppa data url"
                     class="codepen">See the Pen
                    <a href="https://codepen.io/zhanziyang/pen/qXrpmW/">Vue Croppa data url</a> by Chris (
                    <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                    <a href="https://codepen.io">CodePen</a>.</p>
                </v-flex>
              </v-layout>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  export default {
    mounted () {
      var script = document.createElement('script')
      script.src = '/vue-croppa/static/ei.js'
      document.body.appendChild(script)
    }
  }
</script>
