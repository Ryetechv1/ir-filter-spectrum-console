import React from "react";

export default function ControlsPanel({ activeLayer, setActiveLayer, setCustomFileUrl }) {
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setCustomFileUrl(objectUrl);
    }
  };

  return (
    <div className="panel-inner">
      <h2>Spatial Data Source</h2>
      <p className="subtitle">Upload or stream custom matrices:</p>

      <div className="upload-box">
        <input type="file" accept=".glb,.gltf,.laz,.las" onChange={handleFileUpload} />
        <div className="hint text-xs">Supports .GLB, .GLTF, or .LAZ Point Clouds</div>
      </div>

      <h2>Render Modes</h2>
      <div className="layer-selector">
        <button
          onClick={() => setActiveLayer("pointcloud")}
          className={`layer-btn ${activeLayer === "pointcloud" ? "active" : ""}`}
        >
          <strong>LiDAR / Point Cloud</strong>
        </button>
        <button onClick={() => setActiveLayer("tin")} className={`layer-btn ${activeLayer === "tin" ? "active" : ""}`}>
          <strong>TIN Vector Mesh</strong>
        </button>
      </div>
    </div>
  );
}
