import { backendEndpoint } from "./constants";

const endpoint = backendEndpoint + "api/suggestions";

export const getChatSuggestions = async () => {
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return [];
  }

  const suggestions = ((await res.json()) ?? []) as string[];
  return suggestions;
};
