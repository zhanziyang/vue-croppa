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
} from '../../v2/src'

const source = { width: 1200, height: 800 }
const imageUrl = withBase('/demo-image.svg')

const state = ref<CropState>(createCropState(source, 1))

const orientedSize = computed(() => getOrientedSize(source, state.value.rotation))
const cropPixels = computed(() => cropToPixels(state.value.crop, source, state.value.rotation))

const cropStyle = computed(() => ({
  left: `${state.value.crop.x * 100}%`,
  top: `${state.value.crop.y * 100}%`,
  width: `${state.value.crop.width * 100}%`,
  height: `${state.value.crop.height * 100}%`,
}))

const stageStyle = computed(() => ({
  aspectRatio: `${orientedSize.value.width} / ${orientedSize.value.height}`,
}))

const imageStyle = computed(() => ({
  transform: [
    `rotate(${state.value.rotation}deg)`,
    `scaleX(${state.value.flipX ? -1 : 1})`,
    `scaleY(${state.value.flipY ? -1 : 1})`,
  ].join(' '),
}))

const stateJson = computed(() => JSON.stringify(state.value, null, 2))
const pixelJson = computed(() => JSON.stringify(
  Object.fromEntries(
    Object.entries(cropPixels.value).map(([key, value]) => [key, Number(value.toFixed(2))]),
  ),
  null,
  2,
))

function move(x: number, y: number) {
  state.value = {
    ...state.value,
    crop: moveCrop(state.value.crop, { x, y }),
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
</script>

<template>
  <section class="v2-lab" data-testid="v2-lab">
    <div class="v2-lab__intro">
      <div>
        <span class="v2-lab__badge">v2 foundation</span>
        <h2>Crop-state lab</h2>
      </div>
      <p>
        This imports the real <code>v2/src</code> geometry engine directly.
        It validates state semantics before the renderer/controller/component layer exists.
      </p>
    </div>

    <div class="v2-lab__layout">
      <div>
        <div class="v2-lab__stage" :style="stageStyle" data-testid="v2-stage">
          <img
            class="v2-lab__image"
            :src="imageUrl"
            alt=""
            :style="imageStyle"
          >
          <div
            class="v2-lab__crop"
            :style="cropStyle"
            data-testid="v2-crop"
          >
            <span class="v2-lab__handle v2-lab__handle--tl"></span>
            <span class="v2-lab__handle v2-lab__handle--tr"></span>
            <span class="v2-lab__handle v2-lab__handle--bl"></span>
            <span class="v2-lab__handle v2-lab__handle--br"></span>
          </div>
        </div>

        <div class="v2-lab__controls" aria-label="v2 foundation controls">
          <div class="v2-lab__control-group">
            <button type="button" data-testid="move-left" @click="move(-0.05, 0)">←</button>
            <button type="button" data-testid="move-up" @click="move(0, -0.05)">↑</button>
            <button type="button" data-testid="move-down" @click="move(0, 0.05)">↓</button>
            <button type="button" data-testid="move-right" @click="move(0.05, 0)">→</button>
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
            <span>normalized / viewport-independent</span>
          </div>
          <pre data-testid="state-json">{{ stateJson }}</pre>
        </div>

        <div class="v2-lab__inspector">
          <div class="v2-lab__inspector-heading">
            <strong>Source pixel crop</strong>
            <span>{{ orientedSize.width }} × {{ orientedSize.height }} oriented source</span>
          </div>
          <pre data-testid="pixel-json">{{ pixelJson }}</pre>
        </div>
      </div>
    </div>

    <div class="v2-lab__notice">
      <strong>Not tested here yet:</strong>
      drag-to-move, wheel/pinch zoom, Pointer Events, canvas rendering, loading, export, resize behavior,
      and accessibility. Those belong to the next vertical slice and should replace this state-only stage
      with the real v2 component.
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

.v2-lab__stage {
  position: relative;
  width: 100%;
  min-height: 260px;
  overflow: hidden;
  border-radius: 16px;
  background:
    linear-gradient(45deg, rgba(148,163,184,.14) 25%, transparent 25%),
    linear-gradient(-45deg, rgba(148,163,184,.14) 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, rgba(148,163,184,.14) 75%),
    linear-gradient(-45deg, transparent 75%, rgba(148,163,184,.14) 75%),
    var(--vp-c-bg);
  background-size: 22px 22px;
  background-position: 0 0, 0 11px, 11px -11px, -11px 0;
  box-shadow: inset 0 0 0 1px var(--vp-c-divider);
}

.v2-lab__image {
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  object-fit: cover;
  transform-origin: center;
  transition: transform 180ms ease;
}

.v2-lab__stage::after {
  position: absolute;
  inset: 0;
  content: "";
  background: rgba(15, 23, 42, .46);
  pointer-events: none;
}

.v2-lab__crop {
  position: absolute;
  z-index: 2;
  box-sizing: border-box;
  border: 2px solid white;
  background: rgba(255, 255, 255, .08);
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, .02), 0 8px 30px rgba(15,23,42,.24);
  transition: inset 160ms ease, width 160ms ease, height 160ms ease, left 160ms ease, top 160ms ease;
}

.v2-lab__crop::before,
.v2-lab__crop::after {
  position: absolute;
  content: "";
  opacity: .55;
  pointer-events: none;
}

.v2-lab__crop::before {
  left: 33.333%;
  right: 33.333%;
  top: 0;
  bottom: 0;
  border-left: 1px solid white;
  border-right: 1px solid white;
}

.v2-lab__crop::after {
  top: 33.333%;
  bottom: 33.333%;
  left: 0;
  right: 0;
  border-top: 1px solid white;
  border-bottom: 1px solid white;
}

.v2-lab__handle {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 2px solid white;
  background: var(--vp-c-brand-1);
  border-radius: 50%;
}

.v2-lab__handle--tl { left: -6px; top: -6px; }
.v2-lab__handle--tr { right: -6px; top: -6px; }
.v2-lab__handle--bl { left: -6px; bottom: -6px; }
.v2-lab__handle--br { right: -6px; bottom: -6px; }

.v2-lab__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.v2-lab__control-group {
  display: flex;
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

  .v2-lab__stage {
    min-height: 220px;
  }

  .v2-lab__reset {
    margin-left: 0;
  }
}
</style>
