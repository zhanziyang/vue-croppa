<template>
  <div id="app">
    <croppa :width="400"
            :height="400"
            placeholder="上传图片"
            @init="onCroppaInit"></croppa>
    <button @click="getDataUrl">获取地址</button>
    <button @click="reset">重置</button>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        myCroppa: null
      }
    },

    methods: {
      onCroppaInit (myCroppa) {
        this.myCroppa = myCroppa
      },

      getDataUrl () {
        this.myCroppa && console.log(this.myCroppa.generateDataUrl())
      },

      reset () {
        this.myCroppa && this.myCroppa.reset()
      }
    }
  }
</script>

<style>
  
</style>
