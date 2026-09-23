<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { clamp, constrainCropToSource, createCropState, flipCropState, moveCrop, rotateCropState, zoomCrop, type CropState, type InitialSize, type Point } from './index'
import { renderCrop } from './render'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
  initialImage?: string | HTMLImageElement
  initialSize?: InitialSize
  initialPosition?: string
  placeholder?: string
  placeholderColor?: string
  canvasColor?: string
  preventWhiteSpace?: boolean
  showRemoveButton?: boolean
  removeButtonColor?: string
  removeButtonSize?: number
  accept?: string
  fileSizeLimit?: number
  quality?: number
  zoomSpeed?: number
  disabled?: boolean
  disableDragAndDrop?: boolean
  disableClickToChoose?: boolean
  disableDragToMove?: boolean
  disableScrollToZoom?: boolean
  disablePinchToZoom?: boolean
  disableRotation?: boolean
  reverseScrollToZoom?: boolean
  replaceDrop?: boolean
  inputAttrs?: Record<string, string | number | boolean>
}>(), {
  width: 200,
  height: 200,
  initialSize: 'cover',
  initialPosition: 'center',
  placeholder: 'Choose an image',
  placeholderColor: '#606060',
  canvasColor: 'transparent',
  preventWhiteSpace: false,
  showRemoveButton: true,
  removeButtonColor: 'red',
  fileSizeLimit: 0,
  quality: 2,
  zoomSpeed: 3,
})

const emit = defineEmits<{
  'file-choose': [file: File]
  'file-size-exceed': [file: File]
  'file-type-mismatch': [file: File]
  'new-image': []
  'new-image-drawn': []
  'initial-image-loaded': []
  'image-remove': []
  move: []
  zoom: []
}>()

const canvas = ref<HTMLCanvasElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const state = ref<CropState | null>(null)
const chosenFile = ref<File | null>(null)
const fileDraggedOver = ref(false)
const pointers = new Map<number, Point>()
let lastPoint: Point | null = null
let lastPinch: { distance: number; midpoint: Point } | null = null
let moved = false
let generation = 0

function dimensions() {
  return { width: props.width, height: props.height }
}

function draw() {
  const element = canvas.value
  if (!element) return
  const scale = window.devicePixelRatio || 1
  element.width = Math.round(props.width * scale)
  element.height = Math.round(props.height * scale)
  if (image.value && state.value) {
    renderCrop(element, image.value, { width: image.value.naturalWidth, height: image.value.naturalHeight }, state.value, props.canvasColor)
  } else {
    const context = element.getContext('2d')
    context?.clearRect(0, 0, element.width, element.height)
  }
}

function installImage(loaded: HTMLImageElement, file: File | null) {
  image.value = loaded
  chosenFile.value = file
  state.value = createCropState(
    { width: loaded.naturalWidth, height: loaded.naturalHeight },
    { viewport: dimensions(), initialSize: props.initialSize, initialPosition: props.initialPosition, preventWhiteSpace: props.preventWhiteSpace },
  )
  draw()
  emit('new-image-drawn')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const loaded = new Image()
    loaded.onload = () => {
      if (loaded.naturalWidth && loaded.naturalHeight) resolve(loaded)
      else reject(new Error('Image has no dimensions'))
    }
    loaded.onerror = () => reject(new Error('Unable to load image'))
    loaded.src = src
  })
}

async function loadInitial(value: string | HTMLImageElement | undefined) {
  const request = ++generation
  if (!value) {
    remove()
    return
  }
  const loaded = typeof value === 'string'
    ? await loadImage(value)
    : value.complete && value.naturalWidth ? value : await loadImage(value.src)
  if (request !== generation) return
  installImage(loaded, null)
  emit('initial-image-loaded')
}

function chooseFile() { if (!props.disabled) fileInput.value?.click() }

function accepts(file: File): boolean {
  if (!file.type.startsWith('image/')) return false
  if (!props.accept) return true
  return props.accept.split(',').some((part) => {
    const rule = part.trim().toLowerCase()
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
}

async function setFile(file: File) {
  emit('file-choose', file)
  if (props.fileSizeLimit && file.size >= props.fileSizeLimit) {
    emit('file-size-exceed', file)
    return
  }
  if (!accepts(file)) {
    emit('file-type-mismatch', file)
    return
  }
  const request = ++generation
  const url = URL.createObjectURL(file)
  try {
    const loaded = await loadImage(url)
    if (request !== generation) return
    installImage(loaded, file)
    emit('new-image')
  } finally {
    URL.revokeObjectURL(url)
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) void setFile(file)
  input.value = ''
}

function hasDraggedFile(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files') || !!event.dataTransfer?.files.length
}

function canDropFile(): boolean {
  return !props.disabled && !props.disableDragAndDrop && (!image.value || props.replaceDrop)
}

function onDragEnter(event: DragEvent) {
  if (!hasDraggedFile(event)) return
  event.preventDefault()
  fileDraggedOver.value = canDropFile()
}

function onDragOver(event: DragEvent) {
  if (!hasDraggedFile(event)) return
  event.preventDefault()
  if (event.dataTransfer) event.dataTransfer.dropEffect = canDropFile() ? 'copy' : 'none'
}

function onDragLeave(event: DragEvent) {
  if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
    fileDraggedOver.value = false
  }
}

function onDrop(event: DragEvent) {
  if (!hasDraggedFile(event)) return
  event.preventDefault()
  fileDraggedOver.value = false
  if (!canDropFile()) return
  const file = event.dataTransfer?.files[0]
  if (file) void setFile(file)
}

function remove() {
  ++generation
  const hadImage = !!image.value
  image.value = null
  state.value = null
  chosenFile.value = null
  fileDraggedOver.value = false
  if (fileInput.value) fileInput.value.value = ''
  pointers.clear()
  draw()
  if (hadImage) emit('image-remove')
}

function hasImage() { return !!image.value }
function getChosenFile() { return chosenFile.value }
function getCropState() { return state.value ? { ...state.value, crop: { ...state.value.crop } } : null }

function moveByPixels(dx: number, dy: number) {
  const current = state.value
  if (!current || !props.width || !props.height) return
  const crop = moveCrop(current.crop, { x: -dx / props.width * current.crop.width, y: -dy / props.height * current.crop.height }, { preventWhiteSpace: props.preventWhiteSpace })
  if (crop.x === current.crop.x && crop.y === current.crop.y) return
  state.value = { ...current, crop }
  draw()
  emit('move')
}

function zoomAt(factor: number, x = props.width / 2, y = props.height / 2) {
  const current = state.value
  if (!current) return
  const crop = current.crop
  const anchor = { x: crop.x + clamp(x / props.width, 0, 1) * crop.width, y: crop.y + clamp(y / props.height, 0, 1) * crop.height }
  const next = zoomCrop(crop, factor, anchor, { preventWhiteSpace: props.preventWhiteSpace })
  if (next.width === crop.width && next.height === crop.height && next.x === crop.x && next.y === crop.y) return
  state.value = { ...current, crop: next }
  draw()
  emit('zoom')
}

function localPoint(clientX: number, clientY: number): Point {
  const rect = canvas.value!.getBoundingClientRect()
  return { x: (clientX - rect.left) * props.width / rect.width, y: (clientY - rect.top) * props.height / rect.height }
}

function pinch() {
  const [a, b] = [...pointers.values()]
  if (!a || !b) return null
  return { distance: Math.hypot(b.x - a.x, b.y - a.y), midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } }
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || !image.value || (props.disableDragToMove && props.disablePinchToZoom) || (event.pointerType === 'mouse' && event.button !== 0)) return
  canvas.value?.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, localPoint(event.clientX, event.clientY))
  moved = false
  lastPoint = pointers.size === 1 ? pointers.get(event.pointerId)! : null
  lastPinch = pointers.size === 2 ? pinch() : null
}

function onPointerMove(event: PointerEvent) {
  if (props.disabled || !pointers.has(event.pointerId)) return
  const point = localPoint(event.clientX, event.clientY)
  pointers.set(event.pointerId, point)
  if (pointers.size === 1 && lastPoint) {
    const dx = point.x - lastPoint.x
    const dy = point.y - lastPoint.y
    if (Math.abs(dx) + Math.abs(dy) > 0) moved = true
    if (!props.disableDragToMove) moveByPixels(dx, dy)
    lastPoint = point
  } else if (pointers.size === 2) {
    const next = pinch()
    if (next && lastPinch?.distance) {
      if (!props.disableDragToMove) moveByPixels(next.midpoint.x - lastPinch.midpoint.x, next.midpoint.y - lastPinch.midpoint.y)
      if (!props.disablePinchToZoom) zoomAt(clamp(next.distance / lastPinch.distance, 0.8, 1.25), next.midpoint.x, next.midpoint.y)
      moved = true
    }
    lastPinch = next
  }
}

function onPointerEnd(event: PointerEvent) {
  pointers.delete(event.pointerId)
  if (canvas.value?.hasPointerCapture(event.pointerId)) canvas.value.releasePointerCapture(event.pointerId)
  lastPoint = pointers.size === 1 ? [...pointers.values()][0] : null
  lastPinch = pointers.size === 2 ? pinch() : null
}

function onCanvasClick() {
  if (!moved && !props.disableClickToChoose && !image.value) chooseFile()
  moved = false
}

function onWheel(event: WheelEvent) {
  if (props.disabled || props.disableScrollToZoom || !image.value) return
  event.preventDefault()
  const point = localPoint(event.clientX, event.clientY)
  const direction = props.reverseScrollToZoom ? 1 : -1
  zoomAt(clamp(Math.exp(direction * event.deltaY * 0.002 * props.zoomSpeed / 3), 0.8, 1.25), point.x, point.y)
}

function rotate(step = 1) {
  if (props.disabled || props.disableRotation || !state.value) return
  state.value = rotateCropState(state.value, step * 90)
  if (props.preventWhiteSpace) state.value.crop = constrainCropToSource(state.value.crop)
  draw()
}
function flipX() {
  if (props.disabled || props.disableRotation || !state.value) return
  state.value = flipCropState(state.value, 'x')
  draw()
}
function flipY() {
  if (props.disabled || props.disableRotation || !state.value) return
  state.value = flipCropState(state.value, 'y')
  draw()
}

function exportCanvas() {
  if (!image.value || !state.value) return null
  const output = document.createElement('canvas')
  output.width = Math.round(props.width * props.quality)
  output.height = Math.round(props.height * props.quality)
  renderCrop(output, image.value, { width: image.value.naturalWidth, height: image.value.naturalHeight }, state.value, props.canvasColor)
  return output
}
function generateDataUrl(type?: string, quality?: number) { return exportCanvas()?.toDataURL(type, quality) ?? '' }
function generateBlob(callback: (blob: Blob | null) => void, type?: string, quality?: number) {
  const output = exportCanvas()
  if (output) output.toBlob(callback, type, quality)
  else callback(null)
}
function promisedBlob(type?: string, quality?: number): Promise<Blob | null> {
  return new Promise((resolve) => generateBlob(resolve, type, quality))
}

defineExpose({ chooseFile, setFile, remove, hasImage, getChosenFile, getCropState, rotate, flipX, flipY, generateDataUrl, generateBlob, promisedBlob })

watch(() => props.initialImage, (value) => { void loadInitial(value) })
watch(() => props.preventWhiteSpace, (enabled) => {
  if (enabled && state.value) { state.value = { ...state.value, crop: constrainCropToSource(state.value.crop) }; draw() }
})
watch(() => [props.disabled, props.disableDragAndDrop, props.replaceDrop], () => { fileDraggedOver.value = false })
watch(() => [props.width, props.height, props.canvasColor], async () => { await nextTick(); draw() })
onMounted(() => { draw(); if (props.initialImage) void loadInitial(props.initialImage) })
onBeforeUnmount(() => { ++generation; pointers.clear() })
</script>

<template>
  <div class="croppa-v2" :class="{ 'croppa-v2--dropzone': fileDraggedOver }"
    :style="{ width: `${width}px`, height: `${height}px` }"
    @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <input ref="fileInput" class="croppa-v2__input" type="file" :accept="accept" :disabled="disabled"
      v-bind="inputAttrs" @change="onFileChange">
    <canvas ref="canvas" class="croppa-v2__canvas"
      :style="{ width: `${width}px`, height: `${height}px`, cursor: disabled || disableDragToMove ? 'default' : undefined,
        touchAction: disabled || (disableDragToMove && disablePinchToZoom) ? 'auto' : 'none' }"
      aria-label="Crop image" @pointerdown="onPointerDown" @pointermove="onPointerMove"
      @pointerup="onPointerEnd" @pointercancel="onPointerEnd" @click="onCanvasClick" @wheel="onWheel" />
    <div v-if="!image" class="croppa-v2__placeholder" :style="{ color: placeholderColor }">
      <slot name="placeholder">{{ placeholder }}</slot>
    </div>
    <button v-if="image && showRemoveButton" type="button" class="croppa-v2__remove" aria-label="Remove image" :disabled="disabled"
      :style="{ width: `${removeButtonSize || width / 10}px`, height: `${removeButtonSize || width / 10}px`, backgroundColor: removeButtonColor }"
      @click.stop="remove">×</button>
  </div>
</template>

<style scoped>
.croppa-v2 { position: relative; display: inline-block; }
.croppa-v2--dropzone { outline: 2px dashed #0f766e; outline-offset: 4px; }
.croppa-v2__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.croppa-v2__canvas { display: block; cursor: grab; touch-action: none; }
.croppa-v2__canvas:active { cursor: grabbing; }
.croppa-v2__placeholder { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; text-align: center; }
.croppa-v2__remove { position: absolute; top: -4px; right: -4px; transform: translate(35%, -35%); border: 0; border-radius: 50%; color: white; font-size: 1.1em; line-height: 1; cursor: pointer; }
</style>
