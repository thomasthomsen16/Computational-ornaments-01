# CLAUDE.md — Computational Ornaments

This is a **single, solo, experimental project** — one browser-based piece. Not a
template, not a monorepo, not a collection of sub-projects. It is a skeleton built to
experiment in: generative visuals with synthesized sound. Expect the structure and the
work to change constantly as things get tried, broken, and reworked. Nothing here is
fixed.

## Stack

- **Vite** + **plain JavaScript** — build and dev server (no TypeScript)
- **p5.js** — visuals, used in *instance mode*
- **@rnbo/js** — sound synthesis (patches built in Max/MSP, exported to WebAssembly)
- **Tone.js** — musical timing / scheduling
- **Web Audio API** — routing, master output, analysis
- **Tweakpane** — live parameter tweaking while experimenting (optional, handy)

Install:

```
npm create vite@latest . -- --template vanilla
npm install p5 @rnbo/js tone tweakpane
```

Nothing beyond this is committed up front. If experimentation leads toward GLSL
shaders, p5's WEBGL mode supports them — add `vite-plugin-glsl` *if and when* that
actually happens. Same for any other library: add it when a real need appears, not
before.

## Commands

```
npm run dev       # dev server at http://localhost
npm run build     # static build -> dist/
npm run preview   # preview the build
```

## Things that will bite you (the non-obvious bits)

- **p5 in instance mode**, not global — a bundler won't pick up global `setup`/`draw`.
- **One `AudioContext`**, created once and shared. Pass it to RNBO (`createDevice`) and
  Tone (`Tone.setContext`). An RNBO device's `device.node` is a normal `AudioNode`, so
  RNBO, Tone, and native nodes all route into the same graph.
- **Audio needs a user gesture to start** — browsers block autoplay. Have a "click to
  start" that calls `context.resume()`.
- **Don't schedule audio from p5's `draw()` loop** — frame jitter is audible. `draw()`
  only *reads* audio (e.g. an `AnalyserNode`); audio timing belongs to Tone or RNBO.
- **RNBO export files go in `public/`** and are fetched at runtime — not bundled. Keep
  `@rnbo/js` on the same version the patch was exported with.
- **Serve over `localhost` / `https`**, never `file://` — WASM and AudioWorklet are
  blocked otherwise. The dev server handles this.

## Structure

Keep `src/` flat to start — one entry file, split things out only when a file genuinely
gets unwieldy. Don't impose folders ahead of need.

## Deployment

Not decided, and irrelevant to development. The build is a plain static `dist/` folder,
so any static host will work later.

## For Claude Code

This is an experiment, not a product. Favor small working changes over large rewrites.
Don't treat the file layout as fixed. Update this file only when a real, settled
decision actually changes.

The user is a beginner but has coding knowledge. Keep code simple and easy to follow.
Add comments that explain the algorithm and computational thinking behind the code — how
and why it works, not just what it does. This helps the user reason about the code and
develop their artistic experiments. Don't over-comment.
Avoid complexity that isn't asked for.
