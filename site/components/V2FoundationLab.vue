<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import {
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

const orientedSize = computed(() => getOrientedSize(source, state.value.rotation))
const cropPixels = computed(() => cropToPixels(state.value.crop, source, state.value.rotation))

// The viewport is fixed. This is the full oriented image positioned behind it.
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
  const px = transformSourcePoint({ x: 1, y: 0 }, state.value)
  const py = transformSourcePoint({ x: 0, y: 1 }, state.value)

  return `matrix(${px.x - p0.x} ${px.y - p0.y} ${py.x - p0.x} ${py.y - p0.y} ${p0.x} ${p0.y})`
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

function moveImage(x: number, y: number) {
  // Moving the image left reveals source content farther to the right.
  state.value = {
    ...state.value,
    crop: moveCrop(state.value.crop, { x: -x, y: -y }),
  }
}

function zoom(factor: number) {
  state.value = {
    ...state.value,
    crop: zoomCrop(state.value.crop, factor),
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
</script>

<template>
  <section class="v2-lab" data-testid="v2-lab">
    <div class="v2-lab__intro">
      <div>
        <span class="v2-lab__badge">v2 foundation</span>
        <h2>WYSIWYG crop-state lab</h2>
      </div>
      <p>
        The crop viewport is fixed. The image moves and zooms underneath it,
        preserving vue-croppa's original what-you-see-is-what-you-get interaction.
        <code>CropState.crop</code> is internal state, not a draggable crop box.
      </p>
    </div>

    <div class="v2-lab__layout">
      <div>
        <div class="v2-lab__viewport-shell">
          <div class="v2-lab__viewport" data-testid="v2-viewport">
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
            Fixed crop viewport · what is visible here is the output
          </div>
        </div>

        <div class="v2-lab__controls" aria-label="v2 foundation controls">
          <div class="v2-lab__control-group" aria-label="Move image">
            <button type="button" data-testid="move-left" @click="moveImage(-0.05, 0)">← Image</button>
            <button type="button" data-testid="move-up" @click="moveImage(0, -0.05)">↑ Image</button>
            <button type="button" data-testid="move-down" @click="moveImage(0, 0.05)">↓ Image</button>
            <button type="button" data-testid="move-right" @click="moveImage(0.05, 0)">→ Image</button>
          </div>

          <div class="v2-lab__control-group">
            <button type="button" data-testid="zoom-out" @click="zoom(0.8)">− Zoom</button>
            <button type="button" data-testid="zoom-in" @click="zoom(1.25)">+ Zoom</button>
          </div>

          <div class="v2-lab__control-group">
            <button type="button" data-testid="rotate" @click="rotate">Rotate 90°</button>
            <button type="button" data-testid="flip-x" @click="flipX">Flip X</button>
            <button type="button" data-testid="flip-y" @click="flipY">Flip Y</button>
          </div>

          <button type="button" class="v2-lab__reset" data-testid="reset" @click="reset">
            Reset
          </button>
        </div>
      </div>

      <div class="v2-lab__inspectors">
        <div class="v2-lab__inspector">
          <div class="v2-lab__inspector-heading">
            <strong>Serializable CropState</strong>
            <span>source selection behind the fixed viewport</span>
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
      <strong>Interaction contract:</strong>
      v2 keeps the fixed viewport / moving-image model. The next interactive slice replaces
      these buttons with direct drag, wheel, pinch, and keyboard interaction on the image.
      It will not introduce a movable or resizable crop-selection rectangle.
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

.v2-lab__image-layer {
  position: absolute;
  transition: left 160ms ease, top 160ms ease, width 160ms ease, height 160ms ease;
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
      rgba(255,255,255,.48) calc(33.333% - .5px),
      rgba(255,255,255,.48) calc(33.333% + .5px),
      transparent calc(33.333% + .5px),
      transparent calc(66.666% - .5px),
      rgba(255,255,255,.48) calc(66.666% - .5px),
      rgba(255,255,255,.48) calc(66.666% + .5px),
      transparent calc(66.666% + .5px)),
    linear-gradient(to bottom,
      transparent calc(33.333% - .5px),
      rgba(255,255,255,.48) calc(33.333% - .5px),
      rgba(255,255,255,.48) calc(33.333% + .5px),
      transparent calc(33.333% + .5px),
      transparent calc(66.666% - .5px),
      rgba(255,255,255,.48) calc(66.666% - .5px),
      rgba(255,255,255,.48) calc(66.666% + .5px),
      transparent calc(66.666% + .5px));
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.32);
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

.v2-lab__control-group {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
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
