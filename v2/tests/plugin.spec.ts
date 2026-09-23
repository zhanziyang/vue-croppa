import { describe, expect, it } from 'vitest'
import { createApp } from 'vue'
import VueCroppa, { Croppa } from '../src'

describe('Vue 3 plugin', () => {
  it('registers the default and configured component names', () => {
    const app = createApp({})
    app.use(VueCroppa)
    expect(app.component('croppa')).toBe(Croppa)

    const custom = createApp({})
    custom.use(VueCroppa, { componentName: 'my-croppa' })
    expect(custom.component('my-croppa')).toBe(Croppa)
  })
})
