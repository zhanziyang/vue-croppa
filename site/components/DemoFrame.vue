<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'

const props = withDefaults(defineProps<{
  src: string
  title: string
  height?: number
  description?: string
}>(), {
  height: 500,
  description: '',
})

const resolvedSrc = computed(() => withBase(props.src))
</script>

<template>
  <figure class="demo-frame">
    <figcaption class="demo-frame__header">
      <div>
        <strong>{{ title }}</strong>
        <span v-if="description">{{ description }}</span>
      </div>
      <a :href="resolvedSrc" target="_blank" rel="noreferrer">Open demo ↗</a>
    </figcaption>
    <iframe
      :src="resolvedSrc"
      :title="title"
      :style="{ height: height + 'px' }"
      loading="lazy"
      class="demo-frame__iframe"
    />
  </figure>
</template>
