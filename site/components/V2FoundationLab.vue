<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { withBase } from 'vitepress'
import {
  clamp,
  createCropState,
  cropToPixels,
  flipCropState,
  getOrientedSize,
  moveCrop,
  rotateCropState,
  zoomCrop,
  type CropState,
  type Point,
} from '../../v2/src'

const source = { width: 1200, height: 800 }
const imageUrl = withBase('/demo-image.svg')
const state = ref<CropState>(createCropState(source, 1))
const viewport = ref<HTMLElement | null>(null)
const activePointers = new Map<number, Point>()
const dragging = ref(false)
let lastDragPoint: Point | null = null
let lastPinch: { distance: number; midpoint: Point } | null = null

const orientedSize = computed(() => getOrientedSize(source, state.value.rotation))
const cropPixels = computed(() => cropToPixels(state.value.crop, source, state.value.rotation))

const imageLayerStyle = computed(() => {
  const crop = state.value.crop
  return {
    left: `${(-crop.x / crop.width) * 100}%`,
    top: `${(-crop.y / crop.height) * 100}%`,
    width: `${100 / crop.width}%`,
    height: `${100 / crop.height}%`,
  }
})

const svgTransform = computed(() => {
  const p0 = transformSourcePoint({ x: 0, y: 0 }, state.value)
  const px = transformSourcePoint({ x: source.width, y: 0 }, state.value)
  const py = transformSourcePoint({ x: 0, y: source.height }, state.value)

  const a = (px.x - p0.x) / source.width
  const b = (px.y - p0.y) / source.width
  const c = (py.x - p0.x) / source.height
  const d = (py.y - p0.y) / source.height

  return `matrix(${a} ${b} ${c} ${d} ${p0.x} ${p0.y})`
})

const stateJson = computed(() => JSON.stringify(state.value, null, 2))
const pixelJson = computed(() =>
  JSON.stringify(
    Object.fromEntries(
      Object.entries(cropPixels.value).map(([key, value]) => [key, Number(value.toFixed(2))]),
    ),
    null,
    2,
  ),
)

function onPointerDown(event: PointerEvent) {
  if (event.pointerType === 'mouse' && event.button !== 0) return

  viewport.value?.setPointerCapture(event.pointerId)
  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (activePointers.size === 1) {
    dragging.value = true
    lastDragPoint = { x: event.clientX, y: event.clientY }
    lastPinch = null
  } else if (activePointers.size === 2) {
    dragging.value = false
    lastDragPoint = null
    lastPinch = currentPinch()
  }
}

function onPointerMove(event: PointerEvent) {
  if (!activePointers.has(event.pointerId)) return

  activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

  if (activePointers.size === 1 && lastDragPoint) {
    const next = { x: event.clientX, y: event.clientY }
    moveImageByPixels(next.x - lastDragPoint.x, next.y - lastDragPoint.y)
    lastDragPoint = next
    return
  }

  if (activePointers.size === 2) {
    const nextPinch = currentPinch()
    if (!nextPinch || !lastPinch || lastPinch.distance <= 0) {
      lastPinch = nextPinch
      return
    }

    moveImageByPixels(
      nextPinch.midpoint.x - lastPinch.midpoint.x,
      nextPinch.midpoint.y - lastPinch.midpoint.y,
    )

    const factor = clamp(nextPinch.distance / lastPinch.distance, 0.8, 1.25)
    zoomAtClientPoint(factor, nextPinch.midpoint.x, nextPinch.midpoint.y)
    lastPinch = nextPinch
  }
}

function onPointerEnd(event: PointerEvent) {
  activePointers.delete(event.pointerId)

  if (viewport.value?.hasPointerCapture(event.pointerId)) {
    viewport.value.releasePointerCapture(event.pointerId)
  }

  const remaining = [...activePointers.values()]

  if (remaining.length === 1) {
    dragging.value = true
    lastDragPoint = remaining[0]
    lastPinch = null
  } else {
    dragging.value = false
    lastDragPoint = null
    lastPinch = remaining.length === 2 ? currentPinch() : null
  }
}

function onWheel(event: WheelEvent) {
  event.preventDefault()
  const factor = clamp(Math.exp(-event.deltaY * 0.002), 0.8, 1.25)
  zoomAtClientPoint(factor, event.clientX, event.clientY)
}

function moveImageByPixels(dx: number, dy: number) {
  const element = viewport.value
  if (!element) return

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return

  const crop = state.value.crop
  state.value = {
    ...state.value,
    crop: moveCrop(crop, {
      x: -(dx / rect.width) * crop.width,
      y: -(dy / rect.height) * crop.height,
    }),
  }
}

function zoomAtClientPoint(factor: number, clientX: number, clientY: number) {
  const element = viewport.value
  if (!element) return

  const rect = element.getBoundingClientRect()
  if (rect.width <= 0 || rect.height <= 0) return

  const crop = state.value.crop
  const u = clamp((clientX - rect.left) / rect.width, 0, 1)
  const v = clamp((clientY - rect.top) / rect.height, 0, 1)
  const anchor = {
    x: crop.x + u * crop.width,
    y: crop.y + v * crop.height,
  }

  state.value = {
    ...state.value,
    crop: zoomCrop(crop, factor, anchor),
  }
}

function rotate() {
  state.value = rotateCropState(state.value, 90)
}

function flipX() {
  state.value = flipCropState(state.value, 'x')
}

function flipY() {
  state.value = flipCropState(state.value, 'y')
}

function reset() {
  state.value = createCropState(source, 1)
}

function currentPinch() {
  const points = [...activePointers.values()]
  if (points.length !== 2) return null

  const [a, b] = points
  return {
    distance: Math.hypot(b.x - a.x, b.y - a.y),
    midpoint: {
      x: (a.x + b.x) / 2,
      y: (a.y + b.y) / 2,
    },
  }
}

function transformSourcePoint(point: Point, transform: CropState): Point {
  let x = point.x / source.width
  let y = point.y / source.height

  if (transform.flipX) x = 1 - x
  if (transform.flipY) y = 1 - y

  let result: Point

  switch (transform.rotation) {
    case 0:
      result = { x, y }
      break
    case 90:
      result = { x: 1 - y, y: x }
      break
    case 180:
      result = { x: 1 - x, y: 1 - y }
      break
    case 270:
      result = { x: y, y: 1 - x }
      break
  }

  return {
    x: result.x * orientedSize.value.width,
    y: result.y * orientedSize.value.height,
  }
}

onBeforeUnmount(() => {
  activePointers.clear()
})
</script>

<template>
  <section class="v2-lab" data-testid="v2-lab">
    <div class="v2-lab__intro">
      <div>
        <span class="v2-lab__badge">v2 foundation</span>
        <h2>WYSIWYG interaction lab</h2>
      </div>
      <p>
        Drag the image directly. Scroll over the viewport to zoom at the pointer.
        On touch devices, drag with one finger and pinch with two.
        The viewport never moves and exactly represents the output.
      </p>
    </div>

    <div class="v2-lab__layout">
      <div>
        <div class="v2-lab__viewport-shell">
          <div
            ref="viewport"
            class="v2-lab__viewport"
            :class="{ 'is-dragging': dragging }"
            data-testid="v2-viewport"
            tabindex="0"
            @pointerdown="onPointerDown"
            @pointermove="onPointerMove"
            @pointerup="onPointerEnd"
            @pointercancel="onPointerEnd"
            @wheel="onWheel"
          >
            <div
              class="v2-lab__image-layer"
              :style="imageLayerStyle"
              data-testid="v2-image-layer"
            >
              <svg
                class="v2-lab__source"
                :viewBox="`0 0 ${orientedSize.width} ${orientedSize.height}`"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <image
                  :href="imageUrl"
                  :width="source.width"
                  :height="source.height"
                  :transform="svgTransform"
                  preserveAspectRatio="none"
                />
              </svg>
            </div>

            <div class="v2-lab__grid" aria-hidden="true"></div>
          </div>

          <div class="v2-lab__viewport-caption">
            Drag to move · scroll / pinch to zoom
          </div>
        </div>

        <div class="v2-lab__controls" aria-label="v2 transform controls">
          <button type="button" data-testid="rotate" @click="rotate">Rotate 90°</button>
          <button type="button" data-testid="flip-x" @click="flipX">Flip X</button>
          <button type="button" data-testid="flip-y" @click="flipY">Flip Y</button>
          <button type="button" class="v2-lab__reset" data-testid="reset" @click="reset">Reset</button>
        </div>
      </div>

      <div class="v2-lab__inspectors">
        <div class="v2-lab__inspector">
          <div class="v2-lab__inspector-heading">
            <strong>Serializable CropState</strong>
            <span>internal source selection behind the fixed viewport</span>
          </div>
          <pre data-testid="state-json">{{ stateJson }}</pre>
        </div>

        <div class="v2-lab__inspector">
          <div class="v2-lab__inspector-heading">
            <strong>Output source pixels</strong>
            <span>{{ orientedSize.width }} × {{ orientedSize.height }} oriented source</span>
          </div>
          <pre data-testid="pixel-json">{{ pixelJson }}</pre>
        </div>
      </div>
    </div>

    <div class="v2-lab__notice">
      This still uses the foundation state engine directly; it is not the final Vue component.
      The interaction being validated here is the v2 contract: fixed viewport, image manipulation underneath it.
    </div>
  </section>
</template>

<style scoped>
.v2-lab {
  display: grid;
  gap: 22px;
  margin: 24px 0 36px;
  padding: 22px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  background: var(--vp-c-bg-soft);
}

.v2-lab__intro {
  display: grid;
  gap: 10px;
}

.v2-lab__intro > div {
  display: flex;
  align-items: center;
  gap: 10px;
}

.v2-lab__intro h2 {
  margin: 0;
  border: 0;
  padding: 0;
  font-size: 20px;
}

.v2-lab__intro p {
  margin: 0;
  color: var(--vp-c-text-2);
}

.v2-lab__badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .05em;
  text-transform: uppercase;
}

.v2-lab__layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(260px, .9fr);
  gap: 22px;
  align-items: start;
}

.v2-lab__viewport-shell {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.v2-lab__viewport {
  position: relative;
  width: min(100%, 390px);
  aspect-ratio: 1;
  overflow: hidden;
  border: 2px solid var(--vp-c-text-1);
  border-radius: 16px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  background:
    linear-gradient(45deg, rgba(148,163,184,.14) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(148,163,184,.14) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(148,163,184,.14) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(148,163,184,.14) 75%),
    var(--vp-c-bg);
  background-size: 22px 22px;
  background-position: 0 0, 0 11px, 11px -11px, -11px 0;
  box-shadow: 0 16px 40px rgba(15,23,42,.14);
}

.v2-lab__viewport.is-dragging {
  cursor: grabbing;
}

.v2-lab__viewport:focus-visible {
  outline: 3px solid var(--vp-c-brand-soft);
  outline-offset: 3px;
}

.v2-lab__image-layer {
  position: absolute;
  pointer-events: none;
  will-change: left, top, width, height;
}

.v2-lab__source {
  display: block;
  width: 100%;
  height: 100%;
}

.v2-lab__grid {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(to right,
      transparent calc(33.333% - .5px),
      rgba(255,255,255,.42) calc(33.333% - .5px),
      rgba(255,255,255,.42) calc(33.333% + .5px),
      transparent calc(33.333% + .5px),
      transparent calc(66.666% - .5px),
      rgba(255,255,255,.42) calc(66.666% - .5px),
      rgba(255,255,255,.42) calc(66.666% + .5px),
      transparent calc(66.666% + .5px)),
    linear-gradient(to bottom,
      transparent calc(33.333% - .5px),
      rgba(255,255,255,.42) calc(33.333% - .5px),
      rgba(255,255,255,.42) calc(33.333% + .5px),
      transparent calc(33.333% + .5px),
      transparent calc(66.666% - .5px),
      rgba(255,255,255,.42) calc(66.666% - .5px),
      rgba(255,255,255,.42) calc(66.666% + .5px),
      transparent calc(66.666% + .5px));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.28);
}

.v2-lab__viewport-caption {
  color: var(--vp-c-text-3);
  font-size: 11px;
  text-align: center;
}

.v2-lab__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.v2-lab button {
  min-height: 34px;
  padding: 0 11px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 9px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  cursor: pointer;
}

.v2-lab button:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.v2-lab__reset {
  margin-left: auto;
}

.v2-lab__inspectors {
  display: grid;
  gap: 12px;
}

.v2-lab__inspector {
  min-width: 0;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg);
}

.v2-lab__inspector-heading {
  display: grid;
  gap: 2px;
  padding: 12px 13px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.v2-lab__inspector-heading strong {
  font-size: 13px;
}

.v2-lab__inspector-heading span {
  color: var(--vp-c-text-3);
  font-size: 11px;
}

.v2-lab__inspector pre {
  margin: 0;
  max-height: 210px;
  overflow: auto;
  padding: 13px;
  background: transparent;
  font-size: 12px;
}

.v2-lab__notice {
  padding: 13px 15px;
  border-radius: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-warning-soft);
  font-size: 13px;
  line-height: 1.6;
}

@media (max-width: 760px) {
  .v2-lab {
    padding: 15px;
  }

  .v2-lab__layout {
    grid-template-columns: 1fr;
  }

  .v2-lab__reset {
    margin-left: 0;
  }
}
</style>
