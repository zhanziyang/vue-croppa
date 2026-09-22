# Live examples

Every example below is owned by this repository and served with the docs. They use the same Vue 2 runtime and vue-croppa v1 bundle copied from the existing project build during docs preparation.

The same pages are also used by the browser test suite, so the examples double as executable regression fixtures.

## Basic

<DemoFrame
  src="/demos/basic.html"
  title="Basic crop"
  description="Initial image, drag/zoom controls, whitespace constraints, and metadata."
  :height="510"
/>

## File input

<DemoFrame
  src="/demos/input.html"
  title="Choose, drop, replace, remove"
  description="Native file input and image lifecycle events."
  :height="500"
/>

## Manipulation

<DemoFrame
  src="/demos/manipulation.html"
  title="Programmatic manipulation"
  description="Movement, zoom, rotation, and flips."
  :height="520"
/>

## Output

<DemoFrame
  src="/demos/output.html"
  title="Blob and data URL"
  description="Generate and inspect the real cropped output."
  :height="540"
/>

## Metadata

<DemoFrame
  src="/demos/metadata.html"
  title="Save and restore state"
  description="Round-trip the v1 metadata object."
  :height="500"
/>

## Passive preview {#passive-preview}

<DemoFrame
  src="/demos/preview.html"
  title="Synchronized passive preview"
  description="One interactive cropper drives a smaller read-only preview."
  :height="500"
/>

## Rounded output {#rounded-output}

<DemoFrame
  src="/demos/rounded.html"
  title="Rounded output"
  description="image-border-radius affects the generated canvas."
  :height="560"
/>
