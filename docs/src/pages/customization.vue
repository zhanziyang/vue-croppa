<template>
  <div id="registration">
    <v-layout row
              wrap>
      <v-flex>
        <PanelAppearance></PanelAppearance>
        <br>
        <PanelInitialImage></PanelInitialImage>
        <br>
        <PanelImageSize></PanelImageSize>
        <br>
        <PanelFilter></PanelFilter>
        <br>
        <PanelDisabling></PanelDisabling>
        <br>
        <PanelNoWhiteSpace></PanelNoWhiteSpace>
        <br>
        <PanelZoomControl></PanelZoomControl>
        <br>
        <PanelInitialSize></PanelInitialSize>
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
  export default {
    components: {
      PanelAppearance,
      PanelInitialImage,
      PanelImageSize,
      PanelFilter,
      PanelDisabling,
      PanelNoWhiteSpace,
      PanelZoomControl,
      PanelInitialSize
    }
  }
</script>

