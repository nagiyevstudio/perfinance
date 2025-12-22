# Future Changes

## Build Warning: Large JS Chunk (>500 kB)
- Recommended: split routes with `React.lazy` + `Suspense` to enable code-splitting.
- Alternative: configure `build.rollupOptions.output.manualChunks` for finer control.
- Not recommended: only raising `build.chunkSizeWarningLimit` (hides warning, no perf gain).
