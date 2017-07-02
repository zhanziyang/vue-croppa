# vue-croppa
> A simple straightforward customizable lightweight mobile-friendly image cropper for Vue 2.0.

- **Straightforward**: What you see is what you get
- **Highly customizable**: You can almost customize anything except the core functionalities
- **Lightweight**: 16kb in total
- **Mobile-friendly**: Supports drag to move and pinch with two fingers to zoom on mobile devices

<a href="https://zhanziyang.github.io/vue-croppa/"><img src="https://zhanziyang.github.io/vue-croppa/static/preview2.png?v=3" width="400" alt="try it out" /></a>


## Template Example

```html
<croppa v-model="myCroppa"
        :width="400"
        :height="400"
        :canvas-color="'default'"
        :placeholder="'Choose an image'"
        :placeholder-font-size="0"
        :placeholder-color="'default'"
        :input-accept="'image/*'"
        :file-size-limit="0"
        :quality="2"
        :zoom-speed="3"
        :disabled="false"
        :disable-drag-and-drop="false"
        :disable-click-to-choose="false"
        :disable-drag-to-move="false"
        :disable-scroll-to-zoom="false"
        :prevent-white-space="false"
        :reverse-scroll-to-zoom="false"
        :show-remove-button="true"
        :remove-button-color="'red'"
        :remove-button-size="0"
        @init="handleCroppaInit"
        @file-choose="handleCroppaFileChoose"
        @file-size-exceed="handleCroppaFileSizeExceed"
        @file-type-mismatch="handleCroppaFileTypeMismatch"
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
this.myCroppa.remove()

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

#### disable-drag-and-drop
Disables the default "drag and drop a file" user interaction. You can instead trigger the file chooser window programmatically by "click to choose" functionality or invoking `chooseFile()` method.
- type: `boolean`
- default: `false`

#### disable-click-to-choose
Disables the default "click to choose a file" ("tab" on mobile) user interaction. You can instead trigger the file chooser window programmatically by "drag and drop" functionality or invoking `chooseFile()` method.
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

#### disable-pinch-to-zoom
Disables the default "pinch with two fingers to zoom" user interaction **on mobile**. You can instead zoom the image programmatically by invoking `zoomIn()` / `zoomOut()` methods.
- type: `boolean`
- default: `false`

#### <s>reverse-zooming-gesture</s>
**Deprecated** @v0.0.20+ Please use `reverse-scroll-to-zoom` instead. The name isn't proper because you can not reverse pinch to zoom.

Reverses the zoom-in/zoom-out direction when scrolling.
- type: `boolean`
- default: `false`

#### reverse-scroll-to-zoom
Reverses the zoom-in/zoom-out direction when scrolling.
- type: `boolean`
- default: `false`

#### prevent-white-space
Prevents revealing background white space when moving or zooming the image.
- type: `boolean`
- default: `false`

#### show-remove-button
Specifies whether to show the built-in remove-button. You can change the button's color and size using the following two props. If you still find it ugly, hide it and use the `remove()` method to implement your own trigger.
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

### 🌱 Slots

#### initial
- You can provide an initial image by putting an `<img>` node as a named slot `initial`. For example:
```html
<croppa v-model="myCroppa">
  <img slot="initial" :src="initialImageUrl" />
</croppa>
```
##### NOTE: You need to explicitly call `.refresh()` method after changing inital image.
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

#### <s>myCroppa.reset()</s>
- **To Be Deprecated** This will be deprecated in the future due to misnamed 😅 . Please use `remove()` instead.
- Removes the current image, can be used to implement your own remove-button.

#### myCroppa.remove()
- Removes the current image, can be used to implement your own remove-button.

#### myCroppa.refresh()
- Reinitialize the component. Useful when you want to change initial image.

#### myCroppa.hasImage()
- Return boolean value indicating whether currently there is a image.

#### myCroppa.generateDataUrl( type: string )
- Returns a data-URL containing a representation of the image in the format specified by the type parameter (defaults to  png).

#### myCroppa.generateBlob( callback: function, mimeType: string, qualityArgument: number )
- Creates a Blob object representing the image contained in the canvas. Look up  argument definition [here](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob).

#### myCroppa.promisedBlob( mimeType: string, qualityArgument: number )
- This method returns a `Promise` wrapping around `generateBlob()`, so that you can use `async/await` syntax instead of a callback to get blob data, it's simpler.
```js
const blob = await this.myCroppa.promisedBlob()
```

#### myCroppa.supportDetection()
- Return an object indicating browser supports. Like this:
```js
{
  basic: true, // supports basic functionality
  dnd: false // does not support drag and drop
}
```
---

### 🌱 Events

#### init
- handler(croppa)
  - `croppa` is a croppa object to invoke methods - same as what `v-model` binds.

#### file-choose
- emitted when user choose an image from the poppup window or "drag and drop" a file into the container.
- handler(file)
  - `file` is a file object - same as what `getChosenFile()` returns.

#### file-size-exceed: 
- emitted when the chosen file's size exceeds the limit specified by prop fileSizeLimit.
- handler(file)
  - `file` is a file object - same as what `getChosenFile()` returns.

#### file-type-mismatch:
- emitted when the chosen file does not match the specified type, which btw is specified using prop `accept`.
- handler(file)
  - `file` is a file object - same as what `getChosenFile()` returns.

#### image-remove

#### move

#### zoom

#### <s>initial-image-load</s>
- **Deprecated** Don't use this. It will be removed soon since you can directly listen to native `@load` event on img tag.
- emitted when initial image is [provided](#initial) and successully loaded.

#### <s>initial-image-error</s>
- **Deprecated** Don't use this. It will be removed soon since you can directly listen to native `@error` event on img tag.
- emitted when initial image is [provided](#initial) and failed loading.

---

### 🌱 Customize styles

- Check out [default css styles](https://github.com/zhanziyang/vue-croppa/blob/master/dist/vue-croppa.css) here. You can add more css styles to those selectors to get a different look. Be careful if you try to overwrite existing rules.
- Note that CSS styles will not have any effect on the output image.

## To Do List

- [x] File type filter on drag and drop. Add a `file-type-mismatch` event.
- [x] Keep default scrolling behavior when there is no image.
- [x] Browser support detection.
- [x] Sopport dataTransferItemList interface on drop for better compatibility.
- [x] Optimize doc page bundle size.
- [x] Fix remove button shadow.
- [x] Deprecation warning of unnecessary `initial-image-load` and `initial-image-error` events.
- [x] Add a method `hasImage()` to represent whether currently there is a image.
- [ ] SSR compatibility.
- [ ] Make container optionally resizable.
- [ ] Add a showcase with different customization use cases.
