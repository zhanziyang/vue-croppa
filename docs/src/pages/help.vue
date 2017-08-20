<template>
  <div id="help">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Output file size too big!!!</div>
            <div class="pt-2 pl-2">
              If you encounter this problem, you can either
              <router-link to="/customization?sec=image-size">decrease the image size</router-link> (visual size, not file size) or
              <router-link to="/file-output">specify the compression rate in output methods</router-link>.
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Cross Origin Error!!!</div>
            <div class="pt-2 pl-2">
              You can use a remote image link as initial image on croppa, but if the image is not host on your server(or not under the same domain as your site to be exact), you might come acros CORS problems.
            </div>
            <div class="pt-2 pl-2 title">What should I do?</div>
            <div class="pt-2 pl-2">
              1. Make sure the server response of the image has the header
              <code>Access-Control-Allow-Origin</code> set to
              <code>*</code>, otherwise it means the resource can not be accessed from other domains (basically it means "you can't use my images on your site") and there is nothing you can do about it.
            </div>
            <div class="pt-2 pl-2">
              2. If
              <code>Access-Control-Allow-Origin</code> is set to
              <code>*</code> already, you can do like following:
            </div>
            <div class="pt-2 pl-2">
              <ul>
                <li>
                  <p>Use
                    <code>initial-image</code> with a straight-up url to set initial image. This way croppa will do the trick for you so you don't need to do nothing else.</p>
                </li>
                <li>
                  <p>If for some reason you have to use the
                    <code>initial</code> slot to set initial image. You should add
                    <code>crossOrigin="anonymous"</code> attribute to the
                    <code>&lt;img&gt;</code> tag and
                    <strong>remember to write it before
                      <code>src</code> attribute.</strong>
                  </p>
                </li>
              </ul>
            </div>
            <div class="pt-2 pl-2">
              <router-link to="/customization?sec=initial-image">More about this</router-link>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="false">
            <div slot="header"
                 class="title">Photos with EXIF orientation displayed incorrectly!!!</div>
            <div class="pt-2 pl-2">
              First, please upgrade to v0.2.0+.
              <strong>Starting from this version, croppa supports correctly displaying locally-uploaded image file with EXIF orientation. </strong>
            </div>
            <div class="pt-2 pl-2">
              But as for initial images, croppa can not detect its EXIF data, so you need to specify the orientation number for it to be shown correctly. Just add a
              <code>data-exif-orientation</code> attribute to it.
            </div>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="EvXjxB"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa exif orientation"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/EvXjxB/">Vue Croppa exif orientation</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
            <br>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="aywOOe"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa exif orientation 2"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/aywOOe/">Vue Croppa exif orientation 2</a> by Chris (
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
      script.src = '/vue-croppa/static/ei.js'
      document.body.appendChild(script)
    }
  }
</script>