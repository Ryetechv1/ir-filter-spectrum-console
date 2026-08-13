import { parse } from "@loaders.gl/core";
import { LASLoader } from "@loaders.gl/las";

self.onmessage = async (event) => {
  const arrayBuffer = event.data;
  try {
    const data = await parse(arrayBuffer, LASLoader, {
      las: { skip: 1 }
    });

    const positions = data.attributes.POSITION.value;
    const colors = data.attributes.COLOR ? data.attributes.COLOR.value : null;

    self.postMessage({ success: true, positions, colors }, [positions.buffer, colors?.buffer].filter(Boolean));
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
