<template>
  <div id="demos">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Zoom Slider</div>
            <div class="pt-2 pl-2">
              <p data-height="416"
                 data-theme-id="19967"
                 data-slug-hash="EvXjXx"
                 data-default-tab="js,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa exif orientation"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/EvXjXx/">Vue Croppa exif orientation</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Upload</div>
            <div class="pt-2 pl-2">
              <p data-height="637"
                 data-theme-id="19967"
                 data-slug-hash="mMweXa"
                 data-default-tab="js,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa upload"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/mMweXa/">Vue Croppa upload</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Download</div>
            <div class="pt-2 pl-2">
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
      script.src = '/static/ei.js'
      document.body.appendChild(script)
    }
  }
</script>