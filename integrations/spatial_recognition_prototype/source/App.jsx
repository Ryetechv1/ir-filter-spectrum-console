import React, { useState } from "react";
import SpatialViewport from "./components/SpatialViewport";
import ControlsPanel from "./components/ControlsPanel";
import "./index.css";

export default function App() {
  const [activeLayer, setActiveLayer] = useState("pointcloud");
  const [mockDataSize, setMockDataSize] = useState(50);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Spatial 3D Recognition Engine</h1>
        <div className="badge">Web & Mobile WebGL Canvas</div>
      </header>

      <main className="app-workspace">
        <div className="viewport-wrapper">
          <SpatialViewport layerType={activeLayer} resolution={mockDataSize} />
        </div>

        <aside className="sidebar">
          <ControlsPanel
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            mockDataSize={mockDataSize}
            setMockDataSize={setMockDataSize}
          />
        </aside>
      </main>
    </div>
  );
}
