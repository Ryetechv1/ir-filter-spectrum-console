import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import * as THREE from "three";

function WorkerParsedPointCloud({ file }) {
  const [pointData, setPointData] = useState(null);

  useEffect(() => {
    if (!file) return;

    const worker = new Worker(new URL("../workers/pointCloudWorker.js", import.meta.url), { type: "module" });

    file.arrayBuffer().then((buffer) => {
      worker.postMessage(buffer, [buffer]);
    });

    worker.onmessage = (event) => {
      if (event.data.success) {
        setPointData({
          positions: event.data.positions,
          colors: event.data.colors
        });
      }
      worker.terminate();
    };

    return () => worker.terminate();
  }, [file]);

  if (!pointData) return null;

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointData.positions, 3]} />
        {pointData.colors && <bufferAttribute attach="attributes-color" args={[pointData.colors, 3]} />}
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors={Boolean(pointData.colors)} color={!pointData.colors ? "#3b82f6" : undefined} />
    </points>
  );
}

export default function SpatialViewport({ layerType = "pointcloud", resolution = 50, file = null }) {
  const gridSize = Math.max(10, Number(resolution) || 50);

  return (
    <Canvas camera={{ position: [3, 3, 5], fov: 52 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 6, 4]} intensity={1.1} />
      <Grid args={[10, 10]} cellColor="#334155" sectionColor="#38bdf8" />
      {file ? (
        <WorkerParsedPointCloud file={file} />
      ) : layerType === "tin" ? (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4, 4, gridSize, gridSize]} />
          <meshStandardMaterial color="#38bdf8" wireframe side={THREE.DoubleSide} />
        </mesh>
      ) : (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array(
                  Array.from({ length: gridSize * 3 }, (_, index) => {
                    const point = Math.floor(index / 3);
                    const component = index % 3;
                    if (component === 0) return (point % gridSize) / gridSize * 4 - 2;
                    if (component === 1) return Math.sin(point * 0.37) * 0.45;
                    return Math.floor(point / gridSize) / gridSize * 4 - 2;
                  })
                ),
                3
              ]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.06} color="#38bdf8" />
        </points>
      )}
      <OrbitControls />
    </Canvas>
  );
}
