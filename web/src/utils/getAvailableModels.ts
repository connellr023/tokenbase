import ModelInfo from "@/models/ModelInfo";
import { backendEndpoint } from "./constants";

const modelsEndpoint = backendEndpoint + "api/models";

export const getAvailableModels = async () => {
  let availableModels = [] as ModelInfo[];

  try {
    const modelsRes = await fetch(modelsEndpoint);

    if (modelsRes.ok) {
      availableModels = await modelsRes.json();
    }
  } catch {}

  return availableModels;
};
