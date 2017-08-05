<template>
  <div id="registration">
    <v-layout row
              wrap>
      <v-flex>
        <Appearance expand></Appearance>
        <br>
        <PanelImageSize></PanelImageSize>
        <br>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import Appearance from './../panels/appearance.vue'
  import PanelImageSize from './../panels/image-size.vue'
  export default {
    components: {
      Appearance,
      PanelImageSize
    }
  }
</script>

