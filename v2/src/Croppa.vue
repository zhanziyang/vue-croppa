<script setup lang="ts">
import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { clamp, constrainCropToSource, createCropState, flipCropState, moveCrop, rotateCropState, zoomCrop, type CropMetadata, type CropState, type CroppaModelValue, type InitialSize, type LegacyCropMetadata, type Point } from './index'
import { readExifOrientation, relativeOrientation } from './exif'
import { renderCrop, type ClipPlugin } from './render'

const props = withDefaults(defineProps<{
  width?: number
  height?: number
  initialImage?: string | HTMLImageElement
  initialSize?: InitialSize
  initialPosition?: string
  placeholder?: string
  placeholderColor?: string
  placeholderFontSize?: number
  showLoading?: boolean
  loadingSize?: number
  loadingColor?: string
  canvasColor?: string
  preventWhiteSpace?: boolean
  imageBorderRadius?: number | string
  autoSizing?: boolean
  videoEnabled?: boolean
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
  passive?: boolean
  modelValue?: CroppaModelValue | null
  inputAttrs?: Record<string, string | number | boolean>
}>(), {
  width: 200,
  height: 200,
  initialSize: 'cover',
  initialPosition: 'center',
  placeholder: 'Choose an image',
  placeholderColor: '#606060',
  placeholderFontSize: 0,
  showLoading: false,
  loadingSize: 20,
  loadingColor: '#606060',
  canvasColor: 'transparent',
  preventWhiteSpace: false,
  imageBorderRadius: 0,
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
  'loading-start': []
  'loading-end': []
  'load-error': [error: Error]
  init: [instance: object | null]
  draw: [context: CanvasRenderingContext2D]
  'update:modelValue': [value: CroppaModelValue]
}>()

const instance = getCurrentInstance()

const canvas = ref<HTMLCanvasElement | null>(null)
const wrapper = ref<HTMLDivElement | null>(null)
const measuredSize = ref({ width: props.width, height: props.height })
const fileInput = ref<HTMLInputElement | null>(null)
const initialSlot = ref<HTMLDivElement | null>(null)
const image = ref<HTMLImageElement | null>(null)
const video = ref<HTMLVideoElement | null>(null)
const state = ref<CropState | null>(null)
const chosenFile = ref<File | null>(null)
const sourceOrientation = ref(1)
const fileDraggedOver = ref(false)
const loading = ref(false)
const pointers = new Map<number, Point>()
let lastPoint: Point | null = null
let lastPinch: { distance: number; midpoint: Point } | null = null
let moved = false
let generation = 0
let resizeObserver: ResizeObserver | null = null
let videoObjectUrl: string | null = null
let videoFrame = 0
let pendingMetadata: CropMetadata | LegacyCropMetadata | null = null
let lastPublished: CroppaModelValue | null = null
const clipPlugins: ClipPlugin[] = []

function renderOptions() {
  const radius = Number(props.imageBorderRadius)
  return { viewport: dimensions(), borderRadius: Number.isFinite(radius) ? radius : 0, clipPlugins }
}

function setLoading(value: boolean) {
  if (loading.value === value) return
  loading.value = value
  if (value) emit('loading-start')
  else emit('loading-end')
}

function dimensions() {
  return props.autoSizing ? measuredSize.value : { width: props.width, height: props.height }
}

function media() {
  if (video.value) return { source: video.value as CanvasImageSource, size: { width: video.value.videoWidth, height: video.value.videoHeight } }
  if (image.value) return { source: image.value as CanvasImageSource, size: { width: image.value.naturalWidth, height: image.value.naturalHeight } }
  return null
}

function stopVideo() {
  if (videoFrame) cancelAnimationFrame(videoFrame)
  videoFrame = 0
  video.value?.removeEventListener('play', drawVideoFrame)
  if (videoObjectUrl) video.value?.pause()
  video.value = null
  if (videoObjectUrl) URL.revokeObjectURL(videoObjectUrl)
  videoObjectUrl = null
}

function drawVideoFrame() {
  if (!video.value || video.value.paused || video.value.ended) { videoFrame = 0; return }
  draw()
  videoFrame = requestAnimationFrame(drawVideoFrame)
}

function onDoubleClick() {
  if (!props.videoEnabled || props.passive || props.disabled || !video.value) return
  if (video.value.paused || video.value.ended) void video.value.play()
  else video.value.pause()
}

function updateSize() {
  if (!props.autoSizing || !wrapper.value) return
  const rect = wrapper.value.getBoundingClientRect()
  const width = Math.round(rect.width)
  const height = Math.round(rect.height)
  if (width <= 0 || height <= 0) return
  const previous = measuredSize.value
  if (width === previous.width && height === previous.height) return
  measuredSize.value = { width, height }
  if (state.value) {
    const crop = state.value.crop
    const nextWidth = crop.width * width / previous.width
    const nextHeight = crop.height * height / previous.height
    const resized = { x: crop.x + (crop.width - nextWidth) / 2, y: crop.y + (crop.height - nextHeight) / 2, width: nextWidth, height: nextHeight }
    state.value = { ...state.value, crop: props.preventWhiteSpace ? constrainCropToSource(resized) : resized }
    publishModel()
  }
  draw()
}

function observeSize() {
  resizeObserver?.disconnect()
  resizeObserver = null
  if (props.autoSizing && wrapper.value) {
    resizeObserver = new ResizeObserver(updateSize)
    resizeObserver.observe(wrapper.value)
    updateSize()
  }
}

function publishModel() {
  if (props.passive) return
  lastPublished = { image: image.value, video: video.value, sourceOrientation: sourceOrientation.value, state: getCropState(), file: chosenFile.value }
  emit('update:modelValue', lastPublished)
}

function useModel(value: CroppaModelValue | null | undefined) {
  if (value === undefined || (lastPublished && value === lastPublished)) return
  lastPublished = null
  ++generation
  setLoading(false)
  stopVideo()
  image.value = value?.image ?? null
  video.value = value?.video ?? null
  video.value?.addEventListener('play', drawVideoFrame)
  if (video.value && !video.value.paused) drawVideoFrame()
  chosenFile.value = value?.file ?? null
  sourceOrientation.value = value?.sourceOrientation ?? 1
  state.value = value?.state ? { ...value.state, crop: { ...value.state.crop } } : null
  draw()
}

function draw() {
  const element = canvas.value
  if (!element) return
  const viewport = dimensions()
  element.width = Math.round(viewport.width * props.quality)
  element.height = Math.round(viewport.height * props.quality)
  const currentMedia = media()
  if (currentMedia && state.value) {
    renderCrop(element, currentMedia.source, currentMedia.size, state.value, props.canvasColor, renderOptions())
    const context = element.getContext('2d')
    if (context) emit('draw', context)
  } else {
    element.getContext('2d')?.clearRect(0, 0, element.width, element.height)
  }
}

function installImage(loaded: HTMLImageElement, file: File | null, orientation = 1, initialHint = orientation) {
  stopVideo()
  image.value = loaded
  sourceOrientation.value = orientation
  chosenFile.value = file
  const transform = relativeOrientation(orientation, initialHint)
  const rotated = transform.rotation === 90 || transform.rotation === 270
  state.value = createCropState(
    { width: rotated ? loaded.naturalHeight : loaded.naturalWidth, height: rotated ? loaded.naturalWidth : loaded.naturalHeight },
    { viewport: dimensions(), initialSize: props.initialSize, initialPosition: props.initialPosition, preventWhiteSpace: props.preventWhiteSpace },
  )
  state.value = { ...state.value, ...transform }
  restorePendingMetadata()
  if (file) emit('new-image')
  else emit('initial-image-loaded')
  draw()
  emit('new-image-drawn')
  publishModel()
}

function installVideo(loaded: HTMLVideoElement, file: File, url: string) {
  stopVideo()
  image.value = null
  sourceOrientation.value = 1
  video.value = loaded
  videoObjectUrl = url
  chosenFile.value = file
  state.value = createCropState(
    { width: loaded.videoWidth, height: loaded.videoHeight },
    { viewport: dimensions(), initialSize: props.initialSize, initialPosition: props.initialPosition, preventWhiteSpace: props.preventWhiteSpace },
  )
  restorePendingMetadata()
  loaded.addEventListener('play', drawVideoFrame)
  emit('new-image')
  draw()
  emit('new-image-drawn')
  publishModel()
}

function loadVideo(src: string): Promise<HTMLVideoElement> {
  return new Promise((resolve, reject) => {
    const loaded = document.createElement('video')
    loaded.preload = 'auto'
    loaded.playsInline = true
    loaded.onloadeddata = () => loaded.videoWidth && loaded.videoHeight ? resolve(loaded) : reject(new Error('Video has no dimensions'))
    loaded.onerror = () => reject(new Error('Unable to load video'))
    loaded.src = src
  })
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
  const alreadyLoaded = typeof value !== 'string' && value.complete && value.naturalWidth
  if (!alreadyLoaded) setLoading(true)
  try {
    const loaded = typeof value === 'string' ? await loadImage(value) : alreadyLoaded ? value : await loadImage(value.src)
    if (request !== generation) return
    const hint = typeof value === 'string' ? 1 : Number(value.dataset.exifOrientation) || 1
    installImage(loaded, null, 1, hint)
  } catch (error) {
    if (request === generation) emit('load-error', error as Error)
  } finally {
    if (request === generation) setLoading(false)
  }
}

function chooseFile() { if (!props.disabled && !props.passive) fileInput.value?.click() }

function accepts(file: File): boolean {
  if (!file.type.startsWith('image/') && !(props.videoEnabled && file.type.startsWith('video/') && document.createElement('video').canPlayType(file.type))) return false
  if (!props.accept) return true
  return props.accept.split(',').some((part) => {
    const rule = part.trim().toLowerCase()
    if (rule.startsWith('.')) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith('/*')) return file.type.toLowerCase().startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
}

async function setFile(file: File) {
  if (props.passive) return
  const request = ++generation
  emit('file-choose', file)
  setLoading(true)
  if (props.fileSizeLimit && file.size >= props.fileSizeLimit) {
    emit('file-size-exceed', file)
    setLoading(false)
    return
  }
  if (!accepts(file)) {
    emit('file-type-mismatch', file)
    setLoading(false)
    return
  }
  let url: string | null = null
  try {
    url = URL.createObjectURL(file)
    const isVideo = file.type.startsWith('video/')
    const [loaded, orientation] = await Promise.all([
      isVideo ? loadVideo(url) : loadImage(url),
      isVideo ? Promise.resolve(1) : readExifOrientation(file),
    ])
    if (request !== generation) return
    if (isVideo) installVideo(loaded as HTMLVideoElement, file, url)
    else installImage(loaded as HTMLImageElement, file, orientation)
  } catch (error) {
    if (request === generation) emit('load-error', error as Error)
    throw error
  } finally {
    if (url && videoObjectUrl !== url) URL.revokeObjectURL(url)
    if (request === generation) setLoading(false)
  }
}

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) void setFile(file).catch(() => {})
  input.value = ''
}

function hasDraggedFile(event: DragEvent): boolean {
  return Array.from(event.dataTransfer?.types ?? []).includes('Files') || !!event.dataTransfer?.files.length
}

function canDropFile(): boolean {
  return !props.disabled && !props.passive && !props.disableDragAndDrop && (!media() || props.replaceDrop)
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
  if (file) void setFile(file).catch(() => {})
}

function remove() {
  if (props.passive) return
  ++generation
  setLoading(false)
  const hadImage = !!media()
  stopVideo()
  image.value = null
  sourceOrientation.value = 1
  state.value = null
  pendingMetadata = null
  chosenFile.value = null
  fileDraggedOver.value = false
  if (fileInput.value) fileInput.value.value = ''
  pointers.clear()
  draw()
  if (hadImage) emit('image-remove')
  publishModel()
}

function hasImage() { return !!media() }
function getCanvas() { return canvas.value }
function getContext() { return canvas.value?.getContext('2d') ?? null }
function addClipPlugin(plugin: ClipPlugin) {
  if (typeof plugin !== 'function' || clipPlugins.includes(plugin)) throw new TypeError('Clip plugins should be unique functions')
  clipPlugins.push(plugin)
  draw()
}
function supportDetection() {
  const element = document.createElement('div')
  return { basic: typeof window.requestAnimationFrame === 'function' && typeof window.File === 'function' && typeof window.Blob === 'function' && typeof HTMLCanvasElement.prototype.getContext === 'function', dnd: 'ondragstart' in element && 'ondrop' in element }
}
function getChosenFile() { return chosenFile.value }
function getCropState() { return state.value ? { ...state.value, crop: { ...state.value.crop } } : null }
function getMetadata(): CropMetadata | null {
  const currentMedia = media()
  if (!currentMedia || !state.value) return null
  return {
    version: 2,
    source: currentMedia.size,
    viewport: dimensions(),
    state: getCropState()!,
  }
}
function restorePendingMetadata() {
  if (!pendingMetadata) return
  const metadata = pendingMetadata
  pendingMetadata = null
  try { restoreMetadata(metadata) } catch (error) { emit('load-error', error as Error) }
}
function restoreMetadata(metadata: CropMetadata | LegacyCropMetadata) {
  const currentMedia = media()
  if (!currentMedia) throw new Error('Load an image before applying metadata')
  if (!metadata || typeof metadata !== 'object') throw new RangeError('Invalid crop metadata')
  if ('version' in metadata) {
    const crop = metadata?.state?.crop
    if (metadata.version !== 2 || !crop ||
      metadata.source?.width !== currentMedia.size.width || metadata.source?.height !== currentMedia.size.height ||
      !Number.isFinite(metadata.viewport?.width) || !Number.isFinite(metadata.viewport?.height) || metadata.viewport.width <= 0 || metadata.viewport.height <= 0 ||
      Math.abs(metadata.viewport.width / metadata.viewport.height - dimensions().width / dimensions().height) > 1e-9 ||
      ![crop.x, crop.y, crop.width, crop.height].every(Number.isFinite) || crop.width <= 0 || crop.height <= 0 ||
      ![0, 90, 180, 270].includes(metadata.state.rotation) ||
      typeof metadata.state.flipX !== 'boolean' || typeof metadata.state.flipY !== 'boolean') {
      throw new RangeError('Invalid or incompatible v2 crop metadata')
    }
    state.value = { ...metadata.state, crop: props.preventWhiteSpace ? constrainCropToSource(crop) : { ...crop } }
  } else {
    if (!metadata || !Number.isFinite(metadata.startX) || !Number.isFinite(metadata.startY) || !Number.isFinite(metadata.scale) || metadata.scale <= 0) {
      throw new RangeError('Invalid v1 crop metadata')
    }
    const transform = relativeOrientation(sourceOrientation.value, metadata.orientation ?? 1)
    const rotated = transform.rotation === 90 || transform.rotation === 270
    const sourceWidth = rotated ? currentMedia.size.height : currentMedia.size.width
    const sourceHeight = rotated ? currentMedia.size.width : currentMedia.size.height
    const viewport = dimensions()
    const canvasScale = props.quality
    const width = sourceWidth * metadata.scale
    const height = sourceHeight * metadata.scale
    const crop = {
      x: -metadata.startX / width,
      y: -metadata.startY / height,
      width: viewport.width * canvasScale / width,
      height: viewport.height * canvasScale / height,
    }
    state.value = { ...transform, crop: props.preventWhiteSpace ? constrainCropToSource(crop) : crop }
  }
}
function applyMetadata(metadata: CropMetadata | LegacyCropMetadata) {
  if (props.passive) return
  if (!metadata || typeof metadata !== 'object') throw new RangeError('Invalid crop metadata')
  if (!media()) { pendingMetadata = metadata; return }
  restoreMetadata(metadata)
  draw()
  publishModel()
}

function moveByPixels(dx: number, dy: number) {
  const current = state.value
  const viewport = dimensions()
  if (!current || props.passive || !viewport.width || !viewport.height) return
  const crop = moveCrop(current.crop, { x: -dx / viewport.width * current.crop.width, y: -dy / viewport.height * current.crop.height }, { preventWhiteSpace: props.preventWhiteSpace })
  if (crop.x === current.crop.x && crop.y === current.crop.y) return
  state.value = { ...current, crop }
  draw()
  emit('move')
  publishModel()
}
function move(offset: Point) { moveByPixels(offset.x, offset.y) }
function moveUpwards(amount = 1) { moveByPixels(0, -amount) }
function moveDownwards(amount = 1) { moveByPixels(0, amount) }
function moveLeftwards(amount = 1) { moveByPixels(-amount, 0) }
function moveRightwards(amount = 1) { moveByPixels(amount, 0) }

function zoomAt(factor: number, x = dimensions().width / 2, y = dimensions().height / 2) {
  if (props.passive) return
  const current = state.value
  if (!current) return
  const crop = current.crop
  const viewport = dimensions()
  const anchor = { x: crop.x + clamp(x / viewport.width, 0, 1) * crop.width, y: crop.y + clamp(y / viewport.height, 0, 1) * crop.height }
  const next = zoomCrop(crop, factor, anchor, { preventWhiteSpace: props.preventWhiteSpace })
  if (next.width === crop.width && next.height === crop.height && next.x === crop.x && next.y === crop.y) return
  state.value = { ...current, crop: next }
  draw()
  emit('zoom')
  publishModel()
}
function zoom(zoomIn = true, acceleration = 1) {
  zoomAt(zoomIn ? 1 + props.zoomSpeed * acceleration * 0.01 : 1 / (1 + props.zoomSpeed * acceleration * 0.01))
}
function zoomIn() { zoom(true) }
function zoomOut() { zoom(false) }

function localPoint(clientX: number, clientY: number): Point {
  const rect = canvas.value!.getBoundingClientRect()
  const viewport = dimensions()
  return { x: (clientX - rect.left) * viewport.width / rect.width, y: (clientY - rect.top) * viewport.height / rect.height }
}

function pinch() {
  const [a, b] = [...pointers.values()]
  if (!a || !b) return null
  return { distance: Math.hypot(b.x - a.x, b.y - a.y), midpoint: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } }
}

function onPointerDown(event: PointerEvent) {
  if (props.disabled || props.passive || !media() || (props.disableDragToMove && props.disablePinchToZoom) || (event.pointerType === 'mouse' && event.button !== 0)) return
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
  if (!moved && !props.disableClickToChoose && !media()) chooseFile()
  moved = false
}

function onWheel(event: WheelEvent) {
  if (props.disabled || props.passive || props.disableScrollToZoom || !media()) return
  event.preventDefault()
  const point = localPoint(event.clientX, event.clientY)
  const direction = props.reverseScrollToZoom ? 1 : -1
  zoomAt(clamp(Math.exp(direction * event.deltaY * 0.002 * props.zoomSpeed / 3), 0.8, 1.25), point.x, point.y)
}

function rotate(step = 1) {
  if (props.disabled || props.passive || props.disableRotation || !state.value) return
  state.value = rotateCropState(state.value, step * 90)
  if (props.preventWhiteSpace) state.value.crop = constrainCropToSource(state.value.crop)
  draw()
  publishModel()
}
function flipX() {
  if (props.disabled || props.passive || props.disableRotation || !state.value) return
  state.value = flipCropState(state.value, 'x')
  draw()
  publishModel()
}
function flipY() {
  if (props.disabled || props.passive || props.disableRotation || !state.value) return
  state.value = flipCropState(state.value, 'y')
  draw()
  publishModel()
}

function exportCanvas() {
  return media() && state.value ? canvas.value : null
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

function refresh() {
  const initial = props.initialImage ?? initialSlot.value?.querySelector('img') ?? undefined
  if (initial) void loadInitial(initial)
  else remove()
}
function redraw() { draw() }
defineExpose({ chooseFile, setFile, remove, hasImage, getCanvas, getContext, addClipPlugin, supportDetection, getChosenFile, getCropState, getMetadata, applyMetadata, move, moveUpwards, moveDownwards, moveLeftwards, moveRightwards, zoom, zoomIn, zoomOut, refresh, redraw, rotate, flipX, flipY, generateDataUrl, generateBlob, promisedBlob })

watch(() => props.initialImage, (value) => { void loadInitial(value) })
watch(() => props.modelValue, useModel, { deep: false })
watch(() => props.autoSizing, async () => { await nextTick(); observeSize(); draw() })
watch(() => props.preventWhiteSpace, (enabled) => {
  if (enabled && state.value) { state.value = { ...state.value, crop: constrainCropToSource(state.value.crop) }; draw(); publishModel() }
})
watch(() => [props.disabled, props.disableDragAndDrop, props.replaceDrop], () => { fileDraggedOver.value = false })
watch(() => [props.width, props.height, props.canvasColor, props.imageBorderRadius, props.quality], async () => { await nextTick(); if (!props.autoSizing) measuredSize.value = { width: props.width, height: props.height }; draw() })
onMounted(() => { observeSize(); draw(); if (props.modelValue?.image || props.modelValue?.video) useModel(props.modelValue); else refresh(); emit('init', instance?.exposeProxy ?? instance?.proxy ?? null) })
onBeforeUnmount(() => { ++generation; pointers.clear(); resizeObserver?.disconnect(); stopVideo() })
</script>

<template>
  <div ref="wrapper" class="croppa-v2" :class="{ 'croppa-v2--dropzone': fileDraggedOver }"
    :style="{ width: autoSizing ? '100%' : `${width}px`, height: autoSizing ? '100%' : `${height}px` }"
    @dragenter="onDragEnter" @dragover="onDragOver" @dragleave="onDragLeave" @drop="onDrop">
    <input ref="fileInput" class="croppa-v2__input" type="file" :accept="accept" :disabled="disabled || passive"
      v-bind="inputAttrs" @change="onFileChange">
    <div ref="initialSlot" class="croppa-v2__initial"><slot name="initial" /></div>
    <canvas ref="canvas" class="croppa-v2__canvas"
      :style="{ width: `${dimensions().width}px`, height: `${dimensions().height}px`, cursor: disabled || passive || disableDragToMove ? 'default' : undefined,
        touchAction: disabled || (disableDragToMove && disablePinchToZoom) ? 'auto' : 'none' }"
      aria-label="Crop image" @pointerdown="onPointerDown" @pointermove="onPointerMove" @dblclick="onDoubleClick"
      @pointerup="onPointerEnd" @pointercancel="onPointerEnd" @click="onCanvasClick" @wheel="onWheel" />
    <div v-if="!image && !video" class="croppa-v2__placeholder" :style="{ color: placeholderColor }">
      <slot name="placeholder"><span :style="{ fontSize: placeholderFontSize ? `${placeholderFontSize}px` : undefined }">{{ placeholder }}</span></slot>
    </div>
    <div v-if="loading && showLoading" class="croppa-v2__loading" role="status" aria-label="Loading image">
      <span class="croppa-v2__spinner" :style="{ width: `${loadingSize}px`, height: `${loadingSize}px`, borderColor: loadingColor, borderTopColor: 'transparent' }" />
    </div>
    <button v-if="(image || video) && showRemoveButton && !passive" type="button" class="croppa-v2__remove" aria-label="Remove image" :disabled="disabled"
      :style="{ width: `${removeButtonSize || dimensions().width / 10}px`, height: `${removeButtonSize || dimensions().width / 10}px`, backgroundColor: removeButtonColor }"
      @click.stop="remove">×</button>
    <slot />
  </div>
</template>

<style scoped>
.croppa-v2 { position: relative; display: inline-block; }
.croppa-v2--dropzone { outline: 2px dashed #0f766e; outline-offset: 4px; }
.croppa-v2__input { position: absolute; width: 1px; height: 1px; opacity: 0; pointer-events: none; }
.croppa-v2__initial { display: none; }
.croppa-v2__canvas { display: block; cursor: grab; touch-action: none; }
.croppa-v2__canvas:active { cursor: grabbing; }
.croppa-v2__placeholder { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; text-align: center; }
.croppa-v2__loading { position: absolute; inset: 0; display: grid; place-items: center; pointer-events: none; }
.croppa-v2__spinner { display: block; box-sizing: border-box; border: 2px solid; border-radius: 50%; animation: croppa-v2-spin .7s linear infinite; }
@keyframes croppa-v2-spin { to { transform: rotate(360deg); } }
.croppa-v2__remove { position: absolute; top: -4px; right: -4px; transform: translate(35%, -35%); border: 0; border-radius: 50%; color: white; font-size: 1.1em; line-height: 1; cursor: pointer; }
</style>
