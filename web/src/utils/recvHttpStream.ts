export const recvHttpStream = async <T>(
  response: Response,
  signal: AbortSignal | null,
  onChunk: (chunk: T) => void,
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

    // Keep the last partial JSON object in the buffer
    buffer = parts.pop()!;

    for (const part of parts) {
      if (part.trim() === "") continue;

      // Parse JSON
      try {
        const parsedChunk: T = JSON.parse(part);
        onChunk(parsedChunk);
      } catch {
        continue;
      }
    }

    // Check if the request has been aborted
    if (signal?.aborted) {
      reader.cancel();
      break;
    }
  }
};
