<template>
  <div id="customization">
    <v-layout row
              wrap>
      <v-flex>
        <PanelAppearance :expand="defaultExpand === 'appearance'"></PanelAppearance>
        <br>
        <PanelInitialImage :expand="defaultExpand === 'initial-image'"></PanelInitialImage>
        <br>
        <PanelImageSize :expand="defaultExpand === 'image-size'"></PanelImageSize>
        <br>
        <PanelFilter :expand="defaultExpand === 'filter'"></PanelFilter>
        <br>
        <PanelDisabling :expand="defaultExpand === 'disablings'"></PanelDisabling>
        <br>
        <PanelNoWhiteSpace :expand="defaultExpand === 'prevent-white-space'"></PanelNoWhiteSpace>
        <br>
        <PanelZoomControl :expand="defaultExpand === 'zoom-control'"></PanelZoomControl>
        <br>
        <PanelInitialSize :expand="defaultExpand === 'initial-size'"></PanelInitialSize>
        <br>
        <PanelInitialPosition :expand="defaultExpand === 'initial-position'"></PanelInitialPosition>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import PanelAppearance from './../panels/appearance.vue'
  import PanelInitialImage from './../panels/initial-image.vue'
  import PanelImageSize from './../panels/image-size.vue'
  import PanelFilter from './../panels/filter.vue'
  import PanelDisabling from './../panels/disabling.vue'
  import PanelNoWhiteSpace from './../panels/white-space.vue'
  import PanelZoomControl from './../panels/zoom-control.vue'
  import PanelInitialSize from './../panels/initial-size.vue'
  import PanelInitialPosition from './../panels/initial-position.vue'
  export default {
    components: {
      PanelAppearance,
      PanelInitialImage,
      PanelImageSize,
      PanelFilter,
      PanelDisabling,
      PanelNoWhiteSpace,
      PanelZoomControl,
      PanelInitialSize,
      PanelInitialPosition
    },

    computed: {
      defaultExpand () {
        return this.$route.query.sec
      }
    },

    mounted () {
      var script = document.createElement('script')
      script.src = '/vue-croppa/static/ei.js'
      document.body.appendChild(script)
    }
  }
</script>

