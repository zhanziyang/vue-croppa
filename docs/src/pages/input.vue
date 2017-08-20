<template>
  <div id="file-input">
    <v-layout row
              wrap>
      <v-flex>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Click to choose a file</div>
            <div class="pt-2 pl-2">By default, when there is no image on croppa, users can click or touch (on mobile) to open the os file chooser to choose a file.</div>
            <v-layout class="pt-2 pl-2">
              <v-flex>
                <img src="http://i.imgur.com/GAKSc4K.gif"
                     width="100%">
              </v-flex>
              <v-flex>
                <video autoplay=""
                       loop=""
                       style="height: 315px">
                  <source type="video/mp4"
                          src="https://i.imgur.com/ENmVbdo.mp4">
                </video>
              </v-flex>
            </v-layout>
            <div class="pt-2 pl-2 pb-2">You can disable this feature with
              <code>:disable-click-choose="true"</code> -
              <router-link to="/customization?sec=disablings">Try here</router-link>.
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Call the method - chooseFile()</div>
            <div class="pt-2 pl-2 pb-2">If you want to programmatically open the os file chooser, you can call the
              <code>chooseFile()</code> method. This is very useful when you have disabled the default "click to choose" feature and want to implement your own trigger.</div>
            <div class="pt-2 pl-2 pb-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="eEgQbK"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa choose file"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/eEgQbK/">Vue Croppa choose file</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Drag and drop a file</div>
            <div class="pt-2 pl-2">On PC devices, users can drag and drop an image file to croppa.</div>
            <v-layout class="pt-2 pl-2">
              <v-flex>
                <img src="http://i.imgur.com/UaCzMPd.gif"
                     width="400">
              </v-flex>
            </v-layout>
            <div class="pt-2 pl-2 pb-2">You can disable this feature with
              <code>:disable-drag-and-drop="true"</code> -
              <router-link to="/customization?sec=disablings">Try here</router-link>.
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Use a remote file</div>
            <div class="pt-2 pl-2 pb-2">If you don't want users to upload local files but want to use remote image files instead, you can use the "initial image" feature.
              <strong>Just remember that you need to explicitly call the
                <code>refresh()</code> method after inital image changes to update the view.</strong> About the usage of "initial image", please see it
              <router-link to="/customization?sec=initial-image">here</router-link>.
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Remove</div>
            <div class="pt-2 pl-2">The current image can be removed by clicking the built-in "remove button" or call the
              <code>remove()</code> method.
            </div>
            <v-layout class="pt-2 pl-2">
              <v-flex>
                <img src="http://i.imgur.com/gxBsFG2.gif"
                     width="350">
              </v-flex>
            </v-layout>
            <div class="pt-2 pl-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="RZKEbr"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa remove file"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/RZKEbr/">Vue Croppa remove file</a> by Chris (
                <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
                <a href="https://codepen.io">CodePen</a>.</p>
            </div>
            <div class="pt-2 pl-2">By the way, you can use
              <code>hasImage()</code> method to detect whether there is an image or not currently on croppa.</div>
            <div class="pt-2 pl-2 pb-2">About hiding or styling the built-in "remove button", please see
              <router-link to="/customization?sec=appearance">here</router-link>.
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <br>
        <v-expansion-panel expand>
          <v-expansion-panel-content :value="true">
            <div slot="header"
                 class="title">Related Events</div>
            <div class="pt-2 pl-2">
              These are input related events that you can listen to:
            </div>
            <div class="pt-2 pl-2">
              <ul>
                <li>
                  <code>file-choose</code>: emitted whenever a new file was chosen, no matter it is valid or not.</li>
                <li>
                  <code>file-size-exceed</code>,
                  <code>file-type-mismatch</code>: emitted when the chosen file is not valid.
                  <router-link to="/customization?sec=filter">See more here</router-link>
                </li>
                <li>
                  <code>new-image</code>: (v0.2.0+) emitted when a new image was set on croppa. Invalid files will not fire this event.</li>
                <li>
                  <code>image-remove</code>: emitted whenever the current image is removed from croppa.</li>
              </ul>
            </div>
            <div class="pt-2 pl-2 pb-2">
              <p data-height="300"
                 data-theme-id="19967"
                 data-slug-hash="oeBJXN"
                 data-default-tab="html,result"
                 data-user="zhanziyang"
                 data-embed-version="2"
                 data-pen-title="Vue Croppa input events"
                 class="codepen">See the Pen
                <a href="https://codepen.io/zhanziyang/pen/oeBJXN/">Vue Croppa input events</a> by Chris (
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
    data () {
      return {
        myCroppa: {}
      }
    },

    mounted () {
      var script = document.createElement('script')
      script.src = '/vue-croppa/static/ei.js'
      document.body.appendChild(script)
    }
  }
</script>


<style lang="stylus">
</style>
