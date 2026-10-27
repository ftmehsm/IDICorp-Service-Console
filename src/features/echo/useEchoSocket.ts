
import { useCallback, useEffect, useRef, useState } from "react";

import type {
  EchoConnectionStatus,
  EchoMessage,
} from "./types";

type UseEchoSocketReturn = {
  status: EchoConnectionStatus;
  messages: EchoMessage[];
  error: string | null;
  sendMessage: (text: string) => boolean;
  clearMessages: () => void;
};

function getEchoWebSocketUrl(): string {
  const configuredUrl = import.meta.env.VITE_ECHO_WS_URL;

  if (!configuredUrl) {
    throw new Error("VITE_ECHO_WS_URL is not configured.");
  }

  const parsedUrl = new URL(configuredUrl);

  if (parsedUrl.protocol !== "ws:" && parsedUrl.protocol !== "wss:") {
    throw new Error("Echo WebSocket URL must use ws:// or wss://.");
  }

  return parsedUrl.toString();
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function createMessage(
  text: string,
  direction: EchoMessage["direction"],
): EchoMessage {
  return {
    id: crypto.randomUUID(),
    text,
    direction,
    timestamp: Date.now(),
  };
}

export function useEchoSocket(): UseEchoSocketReturn {
  const socketRef = useRef<WebSocket | null>(null);
  const readyRef = useRef(false);

  const [status, setStatus] =
    useState<EchoConnectionStatus>("connecting");
  const [messages, setMessages] = useState<EchoMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let socket: WebSocket | null = null;
    let ready = false;
    let hasSocketError = false;

    const onOpen = () => {
      if (disposed) return;

      // The server must send its documented ready message
      // before the client can send text messages.
    };

    const onMessage = (event: MessageEvent) => {
      if (disposed) return;

      if (typeof event.data !== "string") {
        setError("The server sent a non-text message.");
        return;
      }

      let data: unknown;

      try {
        data = JSON.parse(event.data);
      } catch {
        // Echo responses are plain text, so not every frame is JSON.
        if (!ready) {
          setError("Received an unexpected message before the connection was ready.");
          return;
        }

        setMessages((current) => [
          ...current,
          createMessage(event.data, "received"),
        ]);
        setError(null);
        return;
      }

      if (isRecord(data) && data.type === "ready") {
        ready = true;
        readyRef.current = true;
        setStatus("ready");
        setError(null);
        return;
      }

      // A valid JSON string can also be echoed text.
      if (!ready) {
        setError("The Echo connection is not ready yet.");
        return;
      }

      setMessages((current) => [
        ...current,
        createMessage(event.data, "received"),
      ]);
      setError(null);
    };

    const onError = () => {
      if (disposed) return;

      hasSocketError = true;
      setStatus("error");
      setError("A WebSocket connection error occurred.");
    };

    const onClose = () => {
      if (disposed) return;

      ready = false;
      readyRef.current = false;

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setStatus(hasSocketError ? "error" : "disconnected");

      if (!hasSocketError) {
        setError("The Echo connection was closed.");
      }
    };

    const connectId = window.setTimeout(() => {
      if (disposed) return;

      try {
        socket = new WebSocket(getEchoWebSocketUrl());
        socketRef.current = socket;
      } catch {
        setStatus("error");
        setError("Could not create the Echo WebSocket connection.");
        return;
      }

      socket.addEventListener("open", onOpen);
      socket.addEventListener("message", onMessage);
      socket.addEventListener("error", onError);
      socket.addEventListener("close", onClose);
    }, 0);

    return () => {
      disposed = true;
      ready = false;
      window.clearTimeout(connectId);
      readyRef.current = false;

      if (!socket) {
        return;
      }

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("error", onError);
      socket.removeEventListener("close", onClose);

      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }
    };
  }, []);

  const sendMessage = useCallback((text: string): boolean => {
    const trimmedText = text.trim();

    if (!trimmedText) {
      setError("Enter a message before sending.");
      return false;
    }

    const socket = socketRef.current;

    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      !readyRef.current
    ) {
      setError("The Echo connection is not ready.");
      return false;
    }

    try {
      socket.send(trimmedText);

      setMessages((current) => [
        ...current,
        createMessage(trimmedText, "sent"),
      ]);

      setError(null);
      return true;
    } catch {
      setError("Could not send the message.");
      return false;
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    status,
    messages,
    error,
    sendMessage,
    clearMessages,
  };
}
