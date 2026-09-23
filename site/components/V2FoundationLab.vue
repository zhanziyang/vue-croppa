<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { Croppa } from '../../v2/src'
import type { CropMetadata, CropState, CroppaModelValue } from '../../v2/src'

type CroppaInstance = InstanceType<typeof Croppa>
const croppa = ref<CroppaInstance | null>(null)
const preventWhiteSpace = ref(false)
const showRemoveButton = ref(true)
const showLoading = ref(true)
const shared = ref<CroppaModelValue | null>(null)
const rounded = ref(false)
const videoEnabled = ref(false)
const drawMarker = ref(false)
const initialized = ref(false)
const autoWidth = ref(240)
const slotCroppa = ref<CroppaInstance | null>(null)
const slotRotation = ref(0)
let savedMetadata: CropMetadata | null = null
const pngOnly = ref(false)
const limitFileSize = ref(false)
const replaceDrop = ref(false)
const disabled = ref(false)
const disableDragAndDrop = ref(false)
const disableClickToChoose = ref(false)
const disableDragToMove = ref(false)
const disableScrollToZoom = ref(false)
const disablePinchToZoom = ref(false)
const disableRotation = ref(false)
const reverseScrollToZoom = ref(false)
const initialImage = ref<string | undefined>(withBase('/demo-image.svg'))
const state = ref<CropState | null>(null)
const stateJson = computed(() => JSON.stringify(state.value, null, 2))

function refresh() { state.value = croppa.value?.getCropState() ?? null }
function refreshSlot() { slotRotation.value = slotCroppa.value?.getCropState()?.rotation ?? 0 }
function rotate() { croppa.value?.rotate(); refresh() }
function flipX() { croppa.value?.flipX(); refresh() }
function flipY() { croppa.value?.flipY(); refresh() }
function moveLeft() { croppa.value?.moveLeftwards(20); refresh() }
function zoomIn() { croppa.value?.zoomIn(); refresh() }
function remove() { croppa.value?.remove(); refresh() }
function reset() { initialImage.value = undefined; requestAnimationFrame(() => { initialImage.value = withBase('/demo-image.svg') }) }
function saveCrop() { savedMetadata = croppa.value?.getMetadata() ?? null }
function restoreCrop() { if (savedMetadata) { croppa.value?.applyMetadata(savedMetadata); refresh() } }
function applyLegacyCrop() {
  const sourceHeight = croppa.value?.getMetadata()?.source.height
  if (sourceHeight) { croppa.value?.applyMetadata({ startX: -160, startY: 0, scale: 640 / sourceHeight, orientation: 1 }); refresh() }
}
function applyLegacyExifCrop() {
  const sourceWidth = croppa.value?.getMetadata()?.source.width
  if (sourceWidth) { croppa.value?.applyMetadata({ startX: 0, startY: -320, scale: 640 / sourceWidth, orientation: 6 }); refresh() }
}
function clipCircle() {
  croppa.value?.addClipPlugin((context, _x, _y, width, height) => {
    context.beginPath()
    context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2)
    context.closePath()
  })
}
function onInit(instance: object | null) { initialized.value = typeof (instance as CroppaInstance | null)?.getCanvas === 'function' }
function onDraw(context: CanvasRenderingContext2D) {
  if (!drawMarker.value) return
  context.fillStyle = '#ff0000'
  context.fillRect(0, 0, context.canvas.width / 20, context.canvas.height / 20)
}
function downloadCanvas() {
  const canvas = croppa.value?.getCanvas()
  if (!canvas || croppa.value?.getContext()?.canvas !== canvas) return
  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = 'croppa-v2-canvas.png'
  link.click()
}
async function download() {
  const blob = await croppa.value?.promisedBlob('image/png')
  if (!blob) return
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'croppa-v2.png'
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
</script>

<template>
  <section class="v2-lab" data-testid="v2-lab">
    <div>
      <span class="v2-lab__badge">Vue 3 component preview</span>
      <h2>Crop a real image</h2>
      <p>Choose an image, then drag it under the fixed viewport, scroll to zoom, or pinch on touch.</p>
    </div>
    <div class="v2-lab__layout">
      <div>
        <div class="v2-lab__viewport-shell" data-testid="v2-viewport">
          <Croppa ref="croppa" v-model="shared" :width="320" :height="320" :initial-image="initialImage"
            :placeholder-font-size="24"
            :prevent-white-space="preventWhiteSpace"
            :image-border-radius="rounded ? 24 : 0" :video-enabled="videoEnabled"
            :show-remove-button="showRemoveButton" remove-button-color="#e11d48" :remove-button-size="28"
            :show-loading="showLoading"
            :accept="videoEnabled ? 'image/*,video/*' : pngOnly ? 'image/png' : 'image/*'" :file-size-limit="limitFileSize ? 1000000 : 0"
            :replace-drop="replaceDrop" :disabled="disabled" :disable-drag-and-drop="disableDragAndDrop"
            :disable-click-to-choose="disableClickToChoose" :disable-drag-to-move="disableDragToMove"
            :disable-scroll-to-zoom="disableScrollToZoom" :disable-pinch-to-zoom="disablePinchToZoom"
            :disable-rotation="disableRotation" :reverse-scroll-to-zoom="reverseScrollToZoom"
            :input-attrs="{ 'data-croppa-input': 'preview' }"
            @init="onInit" @draw="onDraw"
            @new-image-drawn="refresh" @initial-image-loaded="refresh"
            @image-remove="refresh" @move="refresh" @zoom="refresh" />
        </div>
        <div class="v2-lab__controls">
          <label><input v-model="preventWhiteSpace" type="checkbox" data-testid="prevent-whitespace" @change="refresh"> Prevent whitespace</label>
          <label><input v-model="showRemoveButton" type="checkbox" data-testid="show-remove-button"> Show remove button</label>
          <label><input v-model="showLoading" type="checkbox" data-testid="show-loading"> Show loading</label>
          <label><input v-model="rounded" type="checkbox" data-testid="rounded"> Rounded crop</label>
          <label><input v-model="pngOnly" type="checkbox" data-testid="png-only"> PNG only</label>
          <label><input v-model="limitFileSize" type="checkbox" data-testid="limit-file-size"> 1 MB file limit</label>
          <button type="button" data-testid="choose" :disabled="!initialized" @click="croppa?.chooseFile()">Choose image</button>
          <button type="button" data-testid="rotate" @click="rotate">Rotate 90°</button>
          <button type="button" data-testid="flip-x" @click="flipX">Flip X</button>
          <button type="button" data-testid="flip-y" @click="flipY">Flip Y</button>
          <button type="button" data-testid="move-left" @click="moveLeft">Move left</button>
          <button type="button" data-testid="zoom-in" @click="zoomIn">Zoom in</button>
          <button type="button" data-testid="remove" @click="remove">Remove</button>
          <button type="button" data-testid="reset" @click="reset">Reset image</button>
          <button type="button" data-testid="save-crop" @click="saveCrop">Save crop</button>
          <button type="button" data-testid="restore-crop" @click="restoreCrop">Restore crop</button>
          <button type="button" data-testid="legacy-crop" @click="applyLegacyCrop">Apply v1 crop</button>
          <button type="button" data-testid="legacy-exif-crop" @click="applyLegacyExifCrop">Apply v1 EXIF crop</button>
          <button type="button" data-testid="clip-circle" @click="clipCircle">Clip to circle</button>
          <label><input v-model="drawMarker" type="checkbox" data-testid="draw-marker" @change="croppa?.redraw()"> Draw marker</label>
          <button type="button" data-testid="canvas-download" @click="downloadCanvas">Download canvas</button>
          <button type="button" data-testid="download" @click="download">Download PNG</button>
        </div>
        <details class="v2-lab__options">
          <summary>Interaction options</summary>
          <label><input v-model="replaceDrop" type="checkbox" data-testid="replace-drop"> Replace image on drop</label>
          <label><input v-model="disabled" type="checkbox" data-testid="disabled"> Disable interactions</label>
          <label><input v-model="disableDragAndDrop" type="checkbox" data-testid="disable-drag-and-drop"> Disable file drop</label>
          <label><input v-model="disableClickToChoose" type="checkbox" data-testid="disable-click-to-choose"> Disable click to choose</label>
          <label><input v-model="disableDragToMove" type="checkbox" data-testid="disable-drag-to-move"> Disable image drag</label>
          <label><input v-model="disableScrollToZoom" type="checkbox" data-testid="disable-scroll-to-zoom"> Disable wheel zoom</label>
          <label><input v-model="disablePinchToZoom" type="checkbox" data-testid="disable-pinch-to-zoom"> Disable pinch zoom</label>
          <label><input v-model="disableRotation" type="checkbox" data-testid="disable-rotation"> Disable rotation</label>
          <label><input v-model="reverseScrollToZoom" type="checkbox" data-testid="reverse-scroll-to-zoom"> Reverse wheel direction</label>
          <label><input v-model="videoEnabled" type="checkbox" data-testid="video-enabled"> Allow video files</label>
        </details>
        <details class="v2-lab__options">
          <summary>Synced and responsive previews</summary>
          <div data-testid="passive-preview"><Croppa v-model="shared" passive :width="160" :height="160" :show-remove-button="false" /></div>
          <button type="button" data-testid="resize-auto" @click="autoWidth = autoWidth === 240 ? 300 : 240">Resize</button>
          <div data-testid="auto-host" :style="{ width: `${autoWidth}px`, height: '180px' }">
            <Croppa auto-sizing :initial-image="withBase('/demo-image.svg')" />
          </div>
          <div data-testid="slot-initial">
            <Croppa ref="slotCroppa" :width="160" :height="120" @new-image-drawn="refreshSlot">
              <template #initial><img :src="withBase('/demo-image.svg')" data-exif-orientation="6" alt="" /></template>
            </Croppa>
            <span data-testid="slot-rotation">Initial slot orientation: {{ slotRotation }}°</span>
          </div>
        </details>
      </div>
      <div class="v2-lab__inspectors">
        <h3>Component state</h3>
        <pre data-testid="state-json">{{ stateJson }}</pre>
      </div>
    </div>
  </section>
</template>

<style scoped>
.v2-lab { max-width: 920px; margin: 2rem auto; }
.v2-lab__badge { color: #0f766e; font-weight: 700; }
.v2-lab__layout { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 2rem; }
.v2-lab__viewport-shell { width: 320px; height: 320px; margin: 1rem 0; border: 1px solid #888; background: repeating-conic-gradient(#eee 0 25%, white 0 50%) 0 0 / 20px 20px; }
.v2-lab__controls { display: flex; flex-wrap: wrap; gap: .5rem; align-items: center; }
.v2-lab__controls label { flex-basis: 100%; }
.v2-lab__controls button { padding: .4rem .7rem; border: 1px solid #888; border-radius: 6px; cursor: pointer; }
.v2-lab__options { margin-top: 1rem; }
.v2-lab__options label { display: block; margin-top: .4rem; }
.v2-lab__inspectors pre { min-height: 7rem; padding: 1rem; overflow: auto; background: #f5f5f5; border-radius: 6px; }
@media (max-width: 700px) { .v2-lab__layout { grid-template-columns: 1fr; } }
</style>
