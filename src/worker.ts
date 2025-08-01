/* eslint-disable @typescript-eslint/no-explicit-any */
import { pipeline } from "@huggingface/transformers";

let classifier: any = null;

export async function loadModel() {
  if (!classifier) {
    console.log("Loading model...");
    classifier = await pipeline("feature-extraction", "Supabase/gte-small", {
      dtype: "fp32",
      device: !!navigator.gpu ? "webgpu" : "wasm",
      // progress_callback: (x) => console.log("Model progress", x),
    });
  }
  return classifier;
}

export async function convertTextToVector(text: string) {
  if (!classifier) {
    throw new Error("Model not loaded. Call loadModel() first.");
  }

  const output = await classifier(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}
