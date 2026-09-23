<template>
  <v-expansion-panel expand>
    <v-expansion-panel-content :value="expand">
      <div slot="header"
           class="title">Initial Image</div>
      <div class="pt-2 pl-2">
        You can set an initial image, in 3 diffrent ways.
      </div>
      <div class="pt-2 pl-2 title">Method 1: </div>
      <div class="pt-2 pl-2">
        (v0.1.0+) The simplest one. Just pass image url to
        <code>initial-image</code> prop.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <v-flex>
          <p data-height="267"
             data-theme-id="19967"
             data-slug-hash="yogoJR"
             data-default-tab="html,result"
             data-user="zhanziyang"
             data-embed-version="2"
             data-pen-title="Vue Croppa Initial Image 2"
             class="codepen">See the Pen
            <a href="https://codepen.io/zhanziyang/pen/yogoJR/">Vue Croppa Initial Image 2</a> by Chris (
            <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
            <a href="https://codepen.io">CodePen</a>.</p>
        </v-flex>
      </v-layout>
      <div class="pt-2 pl-2 title">Method 2: </div>
      <div class="pt-2 pl-2">
        Use the
        <code>initial</code> slot. It's more flexible than the first method.
      </div>
      <div class="pt-2 pl-2">
        <strong>NOTE:</strong> If the image resouce is not host on your site (under diffrent domain), you need to set
        <code>crossOrigin="anonymous"</code> to the image element ---
        <strong>AND!</strong> you need to set it
        <strong>before</strong> the
        <code>src</code> attribute.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <v-flex>
          <p data-height="283"
             data-theme-id="19967"
             data-slug-hash="mMOKXo"
             data-default-tab="html,result"
             data-user="zhanziyang"
             data-embed-version="2"
             data-pen-title="Vue Croppa Initial Image 1"
             class="codepen">See the Pen
            <a href="https://codepen.io/zhanziyang/pen/mMOKXo/">Vue Croppa Initial Image 1</a> by Chris (
            <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
            <a href="https://codepen.io">CodePen</a>.</p>
        </v-flex>
      </v-layout>
      <div class="pt-2 pl-2 title">Method 3: </div>
      <div class="pt-2 pl-2">
        (v0.1.5) In case you need full flexibility, since v0.1.5, you can pass an Image element object to
        <code>initial-image</code>. Just make sure you call
        <code>refresh()</code> after setting it.
      </div>
      <div class="pt-2 pl-2">
        <strong>NOTE AGAIN:</strong> If the image resouce is not host on your site (under diffrent domain), you need to set
        <code>crossOrigin="anonymous"</code> to the image element ---
        <strong>AND!</strong> you need to set it
        <strong>before</strong> the
        <code>src</code> attribute.
      </div>
      <v-layout row
                fluid
                class="pa-2 pt-3">
        <v-flex>
          <p data-height="267"
             data-theme-id="19967"
             data-slug-hash="gxgxRx"
             data-default-tab="html,result"
             data-user="zhanziyang"
             data-embed-version="2"
             data-pen-title="Vue Croppa Initial Image 3"
             class="codepen">See the Pen
            <a href="https://codepen.io/zhanziyang/pen/gxgxRx/">Vue Croppa Initial Image 3</a> by Chris (
            <a href="https://codepen.io/zhanziyang">@zhanziyang</a>) on
            <a href="https://codepen.io">CodePen</a>.</p>
        </v-flex>
      </v-layout>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
  export default {
    props: {
      expand: Boolean
    }
  }
</script>
