# vue-croppa

> A simple straightforward customizable mobile-friendly image cropper for Vue 2.0.

<a href="https://zhanziyang.github.io/vue-croppa/"><img src="https://zhanziyang.github.io/vue-croppa/static/preview2.png?v=3" width="400" alt="try it out" /></a>

## Features

* **Straightforward**: What you see is what you get
* **Highly customizable**: You can almost customize anything except the core functionalities
* **Mobile-friendly**: Supports drag to move and pinch with two fingers to zoom on mobile devices
* **EXIF orientation**: v0.2.0+ Support correctly show image with EXIF orientation

## Browser Support

* IE 10+
* Firefox 3.6+
* Chrome 6+
* Safari 6+
* Opera 11.5+
* iOS Safari 6.1+
* Android Browser 3+

## Template Example

```html
<croppa v-model="myCroppa"
        :width="400"
        :height="400"
        :canvas-color="'default'"
        :placeholder="'Choose an image'"
        :placeholder-font-size="0"
        :placeholder-color="'default'"
        :accept="'image/*'"
        :file-size-limit="0"
        :quality="2"
        :zoom-speed="3"
        :disabled="false"
        :disable-drag-and-drop="false"
        :disable-click-to-choose="false"
        :disable-drag-to-move="false"
        :disable-scroll-to-zoom="false"
        :disable-rotation="false"
        :prevent-white-space="false"
        :reverse-scroll-to-zoom="false"
        :show-remove-button="true"
        :remove-button-color="'red'"
        :remove-button-size="0"
        :initial-image="'path/to/initial-image.png'"
        @init="handleCroppaInit"
        @file-choose="handleCroppaFileChoose"
        @file-size-exceed="handleCroppaFileSizeExceed"
        @file-type-mismatch="handleCroppaFileTypeMismatch"
        @new-image-drawn="handleNewImage"
        @image-remove="handleImageRemove"
        @move="handleCroppaMove"
        @zoom="handleCroppaZoom"></croppa>
```

**NOTE:** This is an almost-full-use example. Usually you don't need to specify so many props, because they all have default values. Most simply, you can even do:

```html
<croppa v-model="myCroppa"></croppa>
```

## Method Examples

```js
this.myCroppa.remove();

this.myCroppa.zoomIn();

alert(this.myCroppa.generateDataUrl());
```

## Quick Start

### 1. Import vue-croppa into your vue.js project.

Using build tools:

```bash
npm install --save vue-croppa
```

```js
import Vue from 'vue';
import Croppa from 'vue-croppa';

Vue.use(Croppa);
```

```js
// If your build tool supports css module
import 'vue-croppa/dist/vue-croppa.css';
```

Not using build tools:

```html
<link href="https://unpkg.com/vue-croppa/dist/vue-croppa.min.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/vue-croppa/dist/vue-croppa.min.js"></script>
```

```js
Vue.use(Croppa);
```

### 2. Now you have it. The simplest usage:

```html
<croppa v-model="myCroppa"></croppa>
```

```js
new Vue({
  // ... other vm options omitted
  data: {
    myCroppa: {}
  },

  methods: {
    uploadCroppedImage() {
      this.myCroppa.generateBlob(
        blob => {
          // write code to upload the cropped image file (a file is a blob)
        },
        'image/jpeg',
        0.8
      ); // 80% compressed jpeg file
    }
  }
});
```

Live example: https://jsfiddle.net/jdcvpvty/2/

#### NOTE:

* Since v0.1.0, you can change the default component name to anything you want.

```js
import Vue from 'vue';
import Croppa from 'vue-croppa';

Vue.use(Croppa, { componentName: 'my-image-cropper' });
```

```html
<my-image-cropper v-model="myCroppa"></my-image-cropper>
```

* Since v0.1.1, you can get the component object with `Croppa.component`. This is useful when you want to register the component by yourself manually.

```js
Vue.component('croppa', Croppa.component);
```

```js
// Register async component (Webpack 2 + ES2015 Example). More about async component: https://vuejs.org/v2/guide/components.html#Async-Components
Vue.component('croppa', () => import(Croppa.component));
```

* Since v1.0.0, the v-modeled value and the `ref` both point to the same thing - the component itself. So you don't need to set v-model anymore if you have a `ref` on the component.

```xml
<croppa ref="myCroppa"></croppa>
```

```js
this.$refs.myCroppa.chooseFile();
this.$refs.myCroppa.generateDataUrl();
// ...
```

## Documentation

### 🌱 Props

#### v-model

A two-way binding prop. It syncs an object from within the croppa component with a data in parent. We can use this object to call useful methods (Check out "[Methods](#-methods)" section). **Since v1.0.0, you don't need this anymore, the `ref` on component can also be used to call methods.**

* type: `object`
* live example: https://jsfiddle.net/jdcvpvty/2/

#### width

Display width of the preview container.

* type: `number`
* default: `200`
* valid: `val > 0`

#### height

Display height of the preview container.

* type: `number`
* default: `200`
* valid: `val > 0`

#### placeholder

Placeholder text of the preview container. It shows up when there is no image.

* type: `string`
* default: `'Choose an image'`

#### placeholder-color

Placeholder text color.

* type: same as what `CanvasRenderingContext2D.fillStyle` accepts.
* default: `'#606060'`

#### placeholder-font-size

Placeholder text font size in pixel. When set to `0`, the font size will be ajust automatically so that the whole placehoder only takes up 2/3 of the container's width.

* type: `number`
* default: `0`

#### canvas-color

Initial background color and white space color if there is an image.

* type: same as what `CanvasRenderingContext2D.fillStyle` accepts.
* default: before v0.2.0 - `'#e6e6e6'`; after v0.2.0 - `'transparent'`

#### quality

Specifies how many times larger the actual image is than the container's display size.

* type: `number`
* default: `2`
* valid: `val > 0`

#### zoom-speed

Specifies how fast the zoom is reacting to scroll gestures. Default to level 3.

* type: `number`
* default: `3`
* valid: `val > 0`

#### accept

Limits the types of files that users can choose.

* type: same as what `accept` attribute of HTML `input` element takes.
* default: no default value since v1.0.0. Specify it as you need.

#### file-size-limit

Limits the byte size of file that users can choose. If set to `0`, then no limit.

* type: `number`
* default: `0`

#### disabled

Disables user interaction.

* type: `boolean`
* default: `false`

#### disable-drag-and-drop

Disables the default "drag and drop a file" user interaction. You can instead trigger the file chooser window programmatically by "click to choose" functionality or invoking `chooseFile()` method.

* type: `boolean`
* default: `false`

#### disable-click-to-choose

Disables the default "click to choose a file" ("tab" on mobile) user interaction. You can instead trigger the file chooser window programmatically by "drag and drop" functionality or invoking `chooseFile()` method.

* type: `boolean`
* default: `false`

#### disable-drag-to-move

Disables the default "drag to move" user interaction. You can instead move the image programmatically by invoking `moveUpwards()` / `moveDownwards()` / `moveLeftwards()` / `moveRightwards()` methods.

* type: `boolean`
* default: `false`

#### disable-scroll-to-zoom

Disables the default "scroll to zoom" user interaction. You can instead zoom the image programmatically by invoking `zoomIn()` / `zoomOut()` methods.

* type: `boolean`
* default: `false`

#### disable-pinch-to-zoom

Disables the default "pinch with two fingers to zoom" user interaction **on mobile**. You can instead zoom the image programmatically by invoking `zoomIn()` / `zoomOut()` methods.

* type: `boolean`
* default: `false`

#### disable-rotation

(**v0.2.0+**) Rotation methods won't work if this is set to `true`

* type: `boolean`
* default: `false`

#### <s>reverse-zooming-gesture</s>

**Deprecated** Please use `reverse-scroll-to-zoom` instead.

Reverses the zoom-in/zoom-out direction when scrolling.

* type: `boolean`
* default: `false`

#### reverse-scroll-to-zoom

Reverses the zoom-in/zoom-out direction when scrolling.

* type: `boolean`
* default: `false`

#### prevent-white-space

Prevents revealing background white space when moving or zooming the image.

* type: `boolean`
* default: `false`

#### show-remove-button

Specifies whether to show the built-in remove-button. You can change the button's color and size using the following two props. If you still find it ugly, hide it and use the `remove()` method to implement your own trigger.

* type: `boolean`
* default: `true`

#### remove-button-color

Changes the default color of the remove-button. Accepts any css color format.

* type: `string`
* default: `'red'`

#### remove-button-size

Specifies the remove-button's width and height (they are equal). If set to `0`, then it use the default size.

* type: `number`
* default: default size is ajust accordingly to container's size

#### initial-image

(**v0.1.0+**) Set initial image. You can pass a string as the url or an Image object (HTMLImageElement instance). This is an alternative way to set initial image besides using slot. Useful when you want to set cross origin image as initial image.

* type: `string` or `object` (HTMLImageElement instance)
* default: `undefined`

#### initial-size

(**v0.2.0+**) works similar to css's background-size. It specifies the image's size when it is first loaded on croppa. `contain` and `natural` won't work if `prevent-white-space` is set to `true`.

* type: `string`
* default: `'cover'`
* valid: one of `'cover'`, `'contain'`, `'natural'`

#### initial-position

(**v0.2.0+**) works similar to css's background-position. It specifies the image's position relative to croppa container when it is first loaded.

* type: `string`
* default: `'center'`
* valid:
  * `'center'` (default value)
  * `'top'`
  * `'bottom'`
  * `'left'`
  * `'right'`
  * composition of the above words (`'top left'`, `'right top'` etc.)
  * `'30% 40%'` (similar to background-position in css)

#### input-attrs

(**v1.0.0+**) to pass attributes to the hidden `input[type=file]` element.

```html
<croppa :input-attrs="{capture: true, class: 'file-input'}"></croppa>
```

#### show-loading

(**v1.1.0+**) show default loading spinner at the bottom right corner of the container when image is loading (will but not yet be drawn on canvas).

* type: `boolean`
* default: `false`

#### loading-size

(**v1.1.0+**) loading spinner's size in px.

* type: `number`
* default: `20`

#### loading-color

(**v1.1.0+**) loading spinner's color in css color value formats.

* type: `string`
* default: `'#606060'`

#### replace-drop

(**v1.1.4+**) Replace current image on drag and drop.

* type: `boolean`
* default: `false` (By default you need to remove the current image to drop a new one)

#### passive

(**1.2.0**) Switch to passive mode. Croppa in passive mode will sync state with another croppa if they v-model the same object. Also it will not have self-control - user can't manipulate image on passive croppa. This is useful as a preview component.

These states will be synced:

```js
[
  'imgData',
  'img',
  'imgSet',
  'originalImage',
  'naturalHeight',
  'naturalWidth',
  'orientation',
  'scaleRatio'
];
```

* type: `boolean`
* default: `false`
* [Demo](https://codepen.io/zhanziyang/pen/xYKbqJ)

#### image-border-radius

(**1.2.0**) Set rounded corders to image. Note that this has effect on the output image. **Note that it only works when `prevent-white-space` is `true`**. ([Demo](https://codepen.io/zhanziyang/pen/jZNmOa))

* type: `number` or `string`
* default: `0`\

#### auto-sizing

(**1.3.0**) If it is set to `true`, `width` and `height` will not work. Instead, croppa will adjust itself to it's container(`.croppa-container`)'s size. It's useful to make croppa's dimension responsive.

* type: `boolean`
* default: `false`
* [Demo](https://codepen.io/zhanziyang/pen/bvVKzL)


#### video-enabled

(**1.3.1**) If it is set to `true`, you can choose a video file. If the video is supported by the browser, the first frame will be drawn on the canvas. You can play/pause the video by dbclick croppa. This feature is not fully developed yet, but you can still play around with it.

* type: `boolean`
* default: `false`

---

### 🌱 Slots

#### initial

* You can provide an initial image by putting an `<img>` node as a named slot `initial`. For example:

```html
<croppa v-model="myCroppa">
  <img slot="initial" :src="initialImageUrl" />
</croppa>
```

##### NOTE:

* You need to explicitly call `.refresh()` method after changing inital image.
* If you provide both the slot and `initial-image` prop, the slot will be the one that is used.

---

#### placeholder

* If you are not satified with the simple text placeholder. Since v0.3.0, you can apply an `<img>` slot named `placeholder` to get an image placeholder! The image will be draw on croppa under the placeholder text.

```html
<croppa v-model="myCroppa">
  <img slot="placeholder" src="static/placeholder-image.png" />
</croppa>
```

##### NOTE:

* It is recommended to use a small-sized image as the placeholder image.
* The image will be drawn with 100% width and height of croppa container, i.e. it will cover the container. So it is recommended to use a images with the same aspect ratio as the container.
* Find demo "Image Placeholder" in the [demo page](https://zhanziyang.github.io/vue-croppa/#/demos)

#### default

* (**v1.1.0+**) Default slots (unnamed) will be appended to the container element after the built-in elements.
* Usually you need to set `position: absolute` on these slots or it will expand the container.

### 🌱 Methods

#### getCanvas()

* returns the canvas object

#### getContext()

* returns the canvas context object

#### getChosenFile()

#### <s>getActualImageSize()</s>

* Return an object `{ width, height }` describing the real image size (preview size `* quality`)
* **Deprecated** Use `this.myCroppa.outputWidth` and `this.myCroppa.outputHeight` instead.

#### moveUpwards( amountInPx: number )

#### moveDownwards( amountInPx: number )

#### moveLeftwards( amountInPx: number )

#### moveRightwards( amountInPx: number )

#### move({x, y})

* (**v1.0.0+**) for more flexibility.

#### zoomIn()

#### zoomOut()

#### zoom(in, timesQuicken)

* (**v1.0.0+**) for more flexibility.

#### rotate(step: number)

* 1 step = 90 deg
* positive number: rotates clockwise
* negative number: rotates counterclockwise.

#### flipX()

* Horizontally flip image.

#### flipY()

* Vertically flip image.

#### chooseFile()

* Opens the file chooser window to Choose an image. Useful when default click-to-choose interaction is disabled.

#### <s>myCroppa.reset()</s>

* **Deprecated** Please use `remove()` instead.

#### remove()

* Removes the current image, can be used to implement your own remove-button.

#### refresh()

* Reinitialize the component. Useful when you want to change initial image.

#### hasImage()

* Return boolean value indicating whether currently there is a image.

#### generateDataUrl( type: string, compressionRate: number )

* Returns a data-URL containing a representation of the image in the format specified by the `type` parameter (defaults to png).
* `compressionRate` (v0.2.0+) defaults to `1`, you can pass a number between 0 and 1 to get a compressed output image.

#### generateBlob( callback: function, mimeType: string, compressionRate: number )

* Creates a Blob object representing the image contained in the canvas. Look up argument definition [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob).
* If there is no image, the first argument of callback function is `null`.

#### promisedBlob( mimeType: string, compressionRate: number )

* This method returns a `Promise` wrapping around `generateBlob()`, so that you can use `async/await` syntax instead of a callback to get blob data, it's simpler.

```js
const blob = await this.myCroppa.promisedBlob()
```

* If there is no image, it will resolve `null`.

#### getMetadata()

* Require v0.3.0+
* Get metadata that describes current user manipulations (moving, zooming, rotating).

```js
var metadata = this.myCroppa.getMetadata();
console.log(metadata);

/* in console
{
  startX:-535.5180530546083,
  startY:-358.0699623303261,
  scale:2.2502626424905396,
  orientation:6
}
*/
```

* Find demo "Use Metadata" in the [demo page](https://zhanziyang.github.io/vue-croppa/#/demos).

#### applyMetadata(metadata)

* Require v0.3.0+
* Apply metadata to get to a certain manipulation state (moving, zooming, rotating).
* `metadata` can have one or more of these 4 properties: `startX`, `startY`, `scale`, `orientation`. Usually you will use the object returned by `getMetadata()`.

```js
var metadata = {
  startX: -535.5180530546083,
  startY: -358.0699623303261,
  scale: 2.2502626424905396,
  orientation: 6
};

this.myCroppa.applyMetadata(metadata);
```

* Find demo "Use Metadata" in the [demo page](https://zhanziyang.github.io/vue-croppa/#/demos).

#### addClipPlugin(func)

* Add clip plugin to clip the image. Example:

```js
// Add a clip plugin to make a circle clip on image
onInit(vm) {
  this.croppa.addClipPlugin(function (ctx, x, y, w, h) {
    /*
     * ctx: canvas context
     * x: start point (top-left corner) x coordination
     * y: start point (top-left corner) y coordination
     * w: croppa width
     * h: croppa height
    */
    ctx.beginPath()
    ctx.arc(x + w / 2, y + h / 2, w / 2, 0, 2 * Math.PI, true)
    ctx.closePath()
  })
},
```

* Note: in the plugin function you should always start with `ctx.beginPath()` and end with `ctx.closePath()`.
* Note: it only works when `prevent-white-space` is `true`.
* [Demo](https://codepen.io/zhanziyang/pen/GQKmJq?editors=1011)

#### supportDetection()

* Return an object indicating browser supports. Like this:

```js
{
  basic: true, // supports basic functionality
  dnd: false // does not support drag and drop
}
```

---

### 🌱 Events

#### init

* handler(croppa)
  * `croppa` is the croppa component itself - same as what `v-model` and `ref` bind.

#### file-choose

* emitted when user choose an image from the poppup window or "drag and drop" a file into the container.
* handler(file)
  * `file` is a file object - same as what `getChosenFile()` returns.

#### file-size-exceed:

* emitted when the chosen file's size exceeds the limit specified by prop fileSizeLimit.
* handler(file)
  * `file` is a file object - same as what `getChosenFile()` returns.

#### file-type-mismatch:

* emitted when the chosen file does not match the specified type, which btw is specified using prop `accept`.
* handler(file)
  * `file` is a file object - same as what `getChosenFile()` returns.

#### new-image

* emitted when a new valid image is received and read successfully(v0.2.0).

#### new-image-drawn

* (v1.0.0+) emitted when a new image is drawn on canvas for the first time.

#### image-remove

* emitted when image remove from croppa.

#### move

#### zoom

#### draw

* emitted on every view update (including init, move, zoom, rotate) when it is not empty. It is useful when you want to add attachment on image.
* handler(ctx)
  * `ctx` is the `CanvasRenderingContext2D` object for you to draw anything you want on the current image. You can also get it with the method `getContext()`.
* Find demo "Attachments" in the [demo page](https://zhanziyang.github.io/vue-croppa/#/demos).

#### initial-image-loaded

* (v0.3.2+) emitted when initial image loaded. It can be useful when you provide initial image with the `initial-image` prop.

#### loading-start

* (v1.1.0+) emitted when image loading phase starts.

#### loading-end

* (v1.1.0+) emitted when image loading phase ends.

---

### 🌱 State data

Since v1.0.0, you can access all state data of croppa via the instance. For example,

```js
this.myCroppa.naturalWidth;
this.myCroppa.imgData.startX;
this.myCroppa.scaleRatio;
this.myCroppa.pinching;
//...
```

All data available:

<img src="https://i.imgur.com/KkgN87h.png?v=3" />

Sorry I'm too lazy to doc about each of them. Please open the **vue-devtool** to figure out what they mean by yourself.

You can also open an issue to ask me any question about this component.

Note that "computed" and "props" are read-only. Some value on "data" are also not recommended to modify from outside, for example `ctx`, `canvas`, `img`.

* **v1.1.0**: `loading` indicates whether an image is loading (will but not yet be drawn on canvas).

### 🌱 Customize styles

* Check out [default css styles](https://github.com/zhanziyang/vue-croppa/blob/master/dist/vue-croppa.css). You can add more css styles to those selectors to get a different look. Be careful if you try to overwrite existing styles.
* Note that CSS styles will not have any effect on the output image.

## Development

#### 1. Fork and clone the repo.

#### 2. Install dependencies.

```bash
$ cd vue-croppa
$ npm install
```

```bash
$ cd docs
$ npm install
```

#### 3. Start developing.

```bash
# under vue-croppa/
$ npm run dev
```

```bash
# under vue-croppa/docs/
$ npm run dev
```

Edit file `./docs/simple-test.html` and open http://localhost:3000/simple-test.html to test while developing.

#### 4. Build

```bash
# under vue-croppa/
$ npm run build
```

## To Do

* [ ] Native support for grid #115
* [ ] Auto crop the output image #118
* [ ] Customizable-size preview #68
* [ ] Automatically keeps the output size when container resized due to `auto-size=true` #122
* [ ] Snapshot the current state and restore. #112
* [ ] Add unit test.
* [ ] Big image rotation optimizations (blob url?).
