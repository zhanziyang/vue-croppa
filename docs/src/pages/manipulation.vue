<template>
  <div id="manipulation">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Move</div>
            <div class="pt-2 pl-2">By default, image on croppa can be moved by
              <strong>dragging it with mouse or one finger (on mobile)</strong>. You can disable this feature by setting
              <code>:disable-drag-to-move="true"</code> -
              <router-link to="/customization?sec=disablings">Try here</router-link>.</div>
            <v-layout class="pt-2 pl-2">
              <div class="mr-2"
                   style="width: 388.88px">
                <video autoplay=""
                       loop=""
                       width="100%">
                  <source type="video/mp4"
                          src="https://i.imgur.com/tbMCe1M.mp4">
                </video>
              </div>
              <div style="height: 315px">
                <video autoplay=""
                       loop=""
                       height="100%">
                  <source type="video/mp4"
                          src="https://i.imgur.com/YPBtFaq.mp4">
                </video>
              </div>
            </v-layout>
            <div class="pt-2 pl-2">
              You can also move image by calling these methods:
              <code>moveUpwards(px)</code>,
              <code>moveDownwards(px)</code>,
              <code>moveLeftwards(px)</code>,
              <code>moveRightwards(px)</code>.
            </div>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="preWzY"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa move"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/preWzY/">Vue Croppa move</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
            <div class="pt-2 pl-2 pb-2">
              Related event: move
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Zoom</div>
            <div class="pt-2 pl-2">By default, image on croppa can be zoomed by
              <strong>scrolling or pinching with two fingers (on mobile)</strong>. </div>
            <div class="pt-2 pl-2">You can disable them by setting
              <code>:disable-scroll-to-zoom="true"</code> and
              <code>:disable-pinch-to-zoom</code> -
              <router-link to="/customization?sec=disablings">Try here</router-link>.</div>
            <div class="pt-2 pl-2">
              You can also change zooming direction and speed with
              <code>reverse-scroll-to-zoom</code> and
              <code>zoom-speed</code> -
              <router-link to="/customization?sec=zoom-control">Try here</router-link>.</div>
            <v-layout class="pt-2 pl-2">
              <div class="mr-2"
                   style="width: 395px">
                <video autoplay=""
                       loop=""
                       width="100%">
                  <source type="video/mp4"
                          src="https://i.imgur.com/MOsxBnj.mp4">
                </video>
              </div>
              <div style="height: 315px">
                <video autoplay=""
                       loop=""
                       height="100%">
                  <source type="video/mp4"
                          src="https://i.imgur.com/Vt301a9.mp4">
                </video>
              </div>
            </v-layout>
            <div class="pt-2 pl-2">
              You can also zoom image by calling these methods:
              <code>zoomIn()</code>,
              <code>zoomOut()</code>
            </div>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="eEvGWN"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa zoom"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/eEvGWN/">Vue Croppa zoom</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
            <div class="pt-2 pl-2 pb-2">
              Related event: zoom
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Rotate</div>
            <div class="pt-2 pl-2">Unlike move and zoom, there is no built-in rotate gesture recognizer. But since v0.2.0 we can rotate the image by calling methods. They are:</div>
            <div class="pt-2 pl-2">
              <ul>
                <li>
                  <code>rotate(step)</code>: 1 step = 90 deg, positive number - rotates clockwise, negative number - rotates counterclockwise.</li>
                <li>
                  <code>flipX()</code>: horizontally flip image.</li>
                <li>
                  <code>flipY()</code>: vertically flip image.</li>
              </ul>
            </div>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="WEpZme"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa rotate"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/WEpZme/">Vue Croppa rotate</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Save state and retrieve it</div>
            <div class="pt-2 pl-2">Inspired by
              <a href="https://github.com/zhanziyang/vue-croppa/issues/24">this issue</a>, since v0.3.0, you can get the metadata that describes current user manipulations (moving, zooming, rotating), save it somewhere, and later you can apply it to retrieve the previous state. These are done by using
              <code>getMetadata()</code> and
              <code>applyMetadata(metadata)</code> methods.</div>
            <div class="pt-2 pl-2">
              See demo "Use Metadata" in the
              <router-link to="demos">demo page</router-link>.
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
