<template>
  <div id="app">
    {{ message }}
    <croppa :width="200" :height="200" placeholder="上传图片"></croppa>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      message: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>

</style>
