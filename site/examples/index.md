# Live examples

Every example below is owned by this repository and served with the docs. They use the same Vue 2 runtime and vue-croppa v1 bundle copied from the existing project build during docs preparation.

The same pages are exercised by Playwright, so the docs examples double as executable regression fixtures rather than external CodePen embeds.

## Core cropping

### Basic

<DemoFrame src="/demos/basic.html" title="Basic crop" description="Initial image, drag/zoom controls, whitespace constraints, and metadata." :height="510" />

### File input

<DemoFrame src="/demos/input.html" title="Choose, drop, replace, remove" description="Native file input and image lifecycle events." :height="500" />

### Manipulation

<DemoFrame src="/demos/manipulation.html" title="Programmatic manipulation" description="Movement, zoom, rotation, and flips." :height="520" />

### Zoom slider {#zoom-slider}

<DemoFrame src="/demos/zoom-slider.html" title="Zoom slider" description="A first-party range control drives Croppa's current scale." :height="530" />

### Responsive auto-sizing {#responsive-auto-sizing}

<DemoFrame src="/demos/responsive.html" title="Responsive / auto-sizing" description="Change the live component dimensions and verify its actual output geometry." :height="570" />

## Output recipes

### Blob and data URL

<DemoFrame src="/demos/output.html" title="Blob and data URL" description="Generate and inspect the real cropped output." :height="540" />

### Prepare an upload

<DemoFrame src="/demos/upload.html" title="Blob → FormData" description="Build a real FormData payload locally without sending data to a third party." :height="510" />

### Download the crop

<DemoFrame src="/demos/download.html" title="Download recipe" description="Generate a first-party PNG data URL and attach it to a download link." :height="500" />

### Rounded output {#rounded-output}

<DemoFrame src="/demos/rounded.html" title="Rounded output" description="image-border-radius affects the generated canvas." :height="560" />

### Custom clip plugin {#clip-plugin}

<DemoFrame src="/demos/clip-plugin.html" title="Circle clip plugin" description="A custom path clips the actual output; the browser test checks transparent corner pixels." :height="520" />

### Watermark / attachment {#attachments}

<DemoFrame src="/demos/attachment.html" title="Draw event attachment" description="Draw a local badge into the real crop canvas and export it." :height="570" />

## State and presentation

### Metadata

<DemoFrame src="/demos/metadata.html" title="Save and restore state" description="Round-trip the v1 metadata object." :height="500" />

### Passive preview {#passive-preview}

<DemoFrame src="/demos/preview.html" title="Synchronized passive preview" description="One interactive cropper drives a smaller read-only preview." :height="500" />

### Image placeholder {#image-placeholder}

<DemoFrame src="/demos/placeholder.html" title="Image placeholder slot" description="Render a local image behind the empty-state text." :height="500" />

### Custom loading {#custom-loading}

<DemoFrame src="/demos/loading.html" title="Custom loading overlay" description="Drive your own loading UI from Croppa's loading lifecycle events." :height="500" />

### Appearance playground {#appearance}

<DemoFrame src="/demos/customization.html" title="Appearance and behavior" description="Edit placeholder/canvas colors and interaction props without forking Croppa." :height="560" />

### EXIF orientation hint {#exif-orientation}

<DemoFrame src="/demos/exif.html" title="Initial-image EXIF hint" description="An initial slot image supplies data-exif-orientation and is normalized by v1." :height="500" />

## Legacy broad harness

The focused demos above are easier to understand and test, but the original repository also contains a broad manual harness in `docs/simple-test.html`.

During the docs build, that page is copied into this site with only its CDN/random-image dependencies replaced by deterministic local assets. Playwright uses it as an additional compatibility check.

[Open the adapted simple-test harness →](/demos/simple-test.html)
