# v2 Foundation Lab

This page exists to validate v2 **before merge**.

It imports the real code from `v2/src` directly. Nothing below is a reimplementation of the crop-state math.

<V2FoundationLab />

## What this validates

The current #251 foundation can be judged on:

- whether normalized crop state is understandable;
- whether move and zoom semantics behave predictably;
- whether rotation preserves the selected source region;
- whether flip state is deterministic;
- whether the same state converts cleanly into source pixel coordinates;
- whether state is compact and serializable.

## What it cannot validate yet

The current PR intentionally has no source loader, renderer/controller, Pointer Events layer, or Vue cropper component.

That means this page is **not** evidence that v2's final interaction design is good yet. In particular, it cannot answer:

- does dragging feel right?
- does wheel zoom anchor correctly under the cursor?
- does pinch zoom feel stable?
- do pointer capture and cancellation behave correctly?
- does resizing preserve the crop?
- does the preview stay sharp at high DPR?
- does export match the visible crop?
- is keyboard/accessibility behavior sufficient?

Those become merge gates for the next interactive vertical slice.
