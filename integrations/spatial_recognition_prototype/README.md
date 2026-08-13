# Spatial Recognition Prototype Integration

This folder preserves the user-provided spatial recognition prototype files for Codex handoff and future development.

The production camera studio does not import this prototype directly. `SpatialViewport.jsx` was provided as an incomplete React/Three.js sketch, and importing it into the live static app would add heavy runtime dependencies plus a blank-screen risk. Instead, the live camera uses a local canvas adaptation in `webapp/src/CameraStudio.jsx`:

- `SPATIAL_RECOGNITION_ADJUSTMENTS`
- `renderSpatialRecognitionWindow()`
- `renderSpatialRecognitionGroup()`
- `applySpatialRecognitionEffects()`
- `applySpatialRecognitionEffectsToContext()`

That implementation estimates depth-like field structure from local luminance, edge gradients, color separation, contour bands, pseudo-depth, mesh overlays, live point-cloud dots, and TIN triangle facets. It is visual-only and does not perform biometric identity recognition, face matching, or camera-frame upload.

## Source Prototype Files

The original files are preserved under `source/`:

- `App.jsx`
- `ControlsPanel.jsx`
- `SpatialViewport.jsx`
- `pointCloudWorker.js`
- `index.css`
- `package.json`
- `vite.config.js`

## Mapping Into The Camera Studio

| Prototype idea | Camera studio implementation |
|---|---|
| Point cloud viewport | `spatialPointDensity`, `spatialLivePointCloud`, cell-sampled point-dot overlay |
| TIN/vector mesh mode | `spatialTinOpacity`, `spatialTinWire`, `spatialCellSize`, `spatialCellDepth`, `spatialSurfaceMap`, `spatialNoiseMap`, live triangle facet overlay |
| Worker parsing | Replaced by local canvas pixel sampling for mobile safety |
| Resolution control | `SPATIAL_RECOGNITION_PIXEL_BUDGET` and downsampled worker canvas |
| Controls panel | `Spatial Recognition Studio` adjustment dropdown and popup |

## Future Upgrade Path

If a future build needs real LAS/LAZ point clouds, finish `SpatialViewport.jsx`, install the Three.js/loaders stack in a separate route, and keep the current canvas pass as the mobile fallback.
