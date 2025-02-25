export const streamResponse = async <T>(
  response: Response,
  onChunk: (chunk: T) => void
) => {
  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    // Decode chunk to string
    buffer += decoder.decode(value, { stream: true });

    // Split buffer by newline to handle multiple JSON objects
    const parts = buffer.split("\n");
    buffer = parts.pop()!; // Keep the last partial JSON object in the buffer

    for (const part of parts) {
      if (part.trim() === "") continue;

      // Parse JSON
      try {
        const parsedChunk: T = JSON.parse(part);
        onChunk(parsedChunk);
      } catch (_) {
        continue;
      }
    }
  }
};
