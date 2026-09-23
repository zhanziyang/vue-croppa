import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(here, '../..')
const publicDir = resolve(here, '../public')
const vendorDir = resolve(publicDir, 'vendor')
const demosDir = resolve(publicDir, 'demos')

await Promise.all([
  mkdir(vendorDir, { recursive: true }),
  mkdir(demosDir, { recursive: true }),
])

await Promise.all([
  copyFile(resolve(repoRoot, 'docs/static/vue.min.js'), resolve(vendorDir, 'vue2.min.js')),
  copyFile(resolve(repoRoot, 'docs/src/croppa/vue-croppa.js'), resolve(vendorDir, 'vue-croppa.js')),
  copyFile(resolve(repoRoot, 'docs/src/croppa/vue-croppa.css'), resolve(vendorDir, 'vue-croppa.css')),
  copyFile(resolve(repoRoot, 'docs/static/500.jpeg'), resolve(publicDir, 'demo-photo.jpg')),
])

// Keep the original broad manual harness executable, but make it deterministic and first-party:
// no CDN Vue runtime and no remote random image.
const simpleTestPath = resolve(repoRoot, 'docs/simple-test.html')
let simpleTest = await readFile(simpleTestPath, 'utf8')
simpleTest = simpleTest
  .replace('https://unpkg.com/vue@2.4.2/dist/vue.js', '../vendor/vue2.min.js')
  .replace('src/croppa/vue-croppa.js', '../vendor/vue-croppa.js')
  .replace('src/croppa/vue-croppa.css', '../vendor/vue-croppa.css')
  .replace(
    "'https://picsum.photos/300/300?' + new Date().valueOf()",
    "'../demo-image.svg'"
  )

await writeFile(resolve(demosDir, 'simple-test.html'), simpleTest)

console.log('Prepared local Vue 2, vue-croppa, and deterministic simple-test assets.')
