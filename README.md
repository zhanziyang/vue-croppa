# vue-croppa
> A simple straightforward customizable image cropper for vue.js.

<a href="https://zhanziyang.github.io/vue-croppa/"><img src="https://zhanziyang.github.io/vue-croppa/static/preview2.png?v=2" width="400" alt="try it out" /></a>


## Template Example

```html
<croppa v-model="myCroppa"
        :width="400"
        :height="400"
        :canvas-color="default"
        :placeholder="Choose an image"
        :placeholder-font-size="0"
        :placeholder-color="default"
        :input-accept="image/*"
        :file-size-limit="0"
        :quality="2"
        :zoom-speed="3"
        :disabled="false"
        :disable-click-to-choose="false"
        :disable-drag-to-move="false"
        :disable-scroll-to-zoom="false"
        :prevent-white-space="false"
        :reverse-zooming-gesture="false"
        :show-remove-button="true"
        :remove-button-color="red"
        :remove-button-size="0"
        @init="handleCroppaInit"
        @file-choose="handleCroppaFileChoose"
        @file-size-exceed="handleCroppaFileSizeExceed"
        @move="handleCroppaMove"
        @zoom="handleCroppaZoom"></croppa>
```
**NOTE:** This is an almost-full-use example. Usually you don't need to specify so many props to customize it, because they all have default values. Most simply, you can even do:
```html
<croppa v-model="myCroppa"></croppa>
```


## Method Examples

```js
this.myCroppa.reset()

this.myCroppa.zoomIn()

alert(this.myCroppa.generateDataUrl())
```

## Quick Start

### 1. Import vue-croppa into your vue.js project.

Using build tools:
```bash
npm install --save vue-croppa
```
```js
import Vue from 'vue'
import Croppa from 'vue-croppa'

Vue.use(Croppa) 
```
```js
// If your build tool supports css module
import 'vue-croppa/dist/vue-croppa.css'
```
Not using build tools:
```html
<link href="https://unpkg.com/vue-croppa/dist/vue-croppa.min.css" rel="stylesheet" type="text/css">
<script src="https://unpkg.com/vue-croppa/dist/vue-croppa.min.js"></script>
```

```js
Vue.use(Croppa)
```

### 2. Now you have it. The simplest usage:
```html
<croppa v-model="myCroppa"></croppa>
```

## Documentation

### 🌱 Props

#### v-model
A two-way binding prop. It syncs an object from within the croppa component with a data in parent. We can use this object to invoke useful methods (Check out "[Methods](#-methods)" section).
- type: `object`
- default: `null`

#### width
Display width of the preview container.
- type: `number`
- default: `200`
- valid: `val > 0`

#### height
Display height of the preview container.
- type: `number`
- default: `200`
- valid: `val > 0`

#### placeholder
Placeholder text of the preview container. It shows up when there is no image.
- type: `string`
- default: `'Choose an image'`

#### placeholder-color
Placeholder text color.
- type: same as what `CanvasRenderingContext2D.fillStyle` accepts.
- default: `'#606060'`

#### placeholder-font-size
Placeholder text font size in pixel. When set to `0`, the font size will be ajust automatically so that the whole placehoder only takes up 2/3 of the container's width.
- type: `number`
- default: `0`

#### canvas-color
Initial background color and white space color if there is an image.
- type: same as what `CanvasRenderingContext2D.fillStyle` accepts.
- default: `'#e6e6e6'`

#### quality
Specifies how many times larger the actual image is than the container's display size.
- type: `number`
- default: `2`
- valid: `isInteger(val) && val > 0

#### zoom speed
Specifies how fast the zoom is reacting to scroll gestures. Default to level 3.
- type: `number`
- default: `3`
- valid: `val > 0`

#### accept
Limits the types of files that users can choose.
- type: same as what `accept` attribute of HTML `input` element takes.
- default: `'image/*'`

#### file-size-limit
Limits the byte size of file that users can choose. If set to `0`, then no limit.
- type: `number`
- default: `0`

#### disabled
Disables user interaction.
- type: `boolean`
- default: `false`

#### disable-click-to-choose
Disables the default "click to choose an image" user interaction. You can instead trigger the file chooser window programmatically by invoking `chooseFile()` method.
- type: `boolean`
- default: `false`

#### disable-drag-to-move
Disables the default "drag to move" user interaction. You can instead move the image programmatically by invoking `moveUpwards()` / `moveDownwards()` / `moveLeftwards()` / `moveRightwards()` methods.
- type: `boolean`
- default: `false`

#### disable-scroll-to-zoom
Disables the default "scroll to zoom" user interaction. You can instead zoom the image programmatically by invoking `zoomIn()` / `zoomOut()` methods.
- type: `boolean`
- default: `false`

#### reverse-zooming-gesture
Reverses the zoom-in/zoom-out direction when scrolling.
- type: `boolean`
- default: `false`

#### prevent-white-space
Prevents revealing background white space when moving or zooming the image.
- type: `boolean`
- default: `false`

#### show-remove-button
Specifies whether to show the built-in remove-button. You can change the button's color and size using the following two props. If you still find it ugly, hide it and use the `reset()` method to implement your own trigger.
- type: `boolean`
- default: `false`

#### remove-button-color
Changes the default color of the remove-button. Accepts any css color format.
- type: `string`
- default: `'red'`

#### remove-button-size
Specifies the remove-button's width and height (they are equal). If set to `0`, then it use the default size.
- type: `number`
- default: default size is ajust accordingly to container's size

---

### 🌱 Methods

#### myCroppa.getCanvas()
- returns the canvas object

#### myCroppa.getContext()
- returns the canvas context object

#### myCroppa.getChosenFile()

#### myCroppa.getActualImageSize()
- Return an object `{ width, height }` describing the real image size (preview size ` * quality`)

#### myCroppa.moveUpwards( amountInPx: number )

#### myCroppa.moveDownwards( amountInPx: number )

#### myCroppa.moveLeftwards( amountInPx: number )

#### myCroppa.moveRightwards( amountInPx: number )

#### myCroppa.zoomIn()

#### myCroppa.zoomOut()

#### myCroppa.chooseFile()
- Opens the file chooser window to Choose an image. Useful when default click-to-choose interaction is disabled.

#### myCroppa.reset()
- Removes the current image, can be used to implement your own remove-button.

#### myCroppa.generateDataUrl( type: string )
- Returns a data-URL containing a representation of the image in the format specified by the type parameter (defaults to  png).

#### myCroppa.generateBlob( callback: function, mimeType: string, qualityArgument: number )
- Creates a Blob object representing the image contained in the canvas. Look up  argument definition [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob).

---

### 🌱 Events

#### init
- handler(croppa)
  - `croppa` is a croppa object to invoke methods - same as what `v-model` binds.

#### file-choose
- emitted when user Choose an image from the poppup window.
- handler(file)
  - `file` is a file object - same as what `getChosenFile()` returns.

#### file-size-exceed: 
- emitted after file choosing if the chosen file's size exceeds the limit specified by prop fileSizeLimit.
- handler(file)
  - `file` is a file object - same as what `getChosenFile()` returns.

#### move

#### zoom