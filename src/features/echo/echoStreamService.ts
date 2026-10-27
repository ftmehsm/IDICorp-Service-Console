
export async function sendStreamEcho(
    content: string,
    onChunk: (chunk: string) => void,
  ): Promise<void> {
    const token = sessionStorage.getItem("access_token");
  
    const response = await fetch("/api/echo/stream", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "text/plain",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: content,
    });
  
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
  
    if (!response.body) {
      throw new Error("Streaming response body is unavailable.");
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
  
    try {
      while (true) {
        const { done, value } = await reader.read();
  
        if (done) break;
  
        const chunk = decoder.decode(value, { stream: true });
  
        if (chunk) {
          onChunk(chunk);
        }
      }
  
      const remaining = decoder.decode();
  
      if (remaining) {
        onChunk(remaining);
      }
    } finally {
      reader.releaseLock();
    }
  }
  