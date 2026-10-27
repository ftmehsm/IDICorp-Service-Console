import { useCallback, useEffect, useRef, useState } from "react";

import {
  CALCULATOR_LIMITS,
  type CalculatorConnectionStatus,
  type CalculatorOperation,
  type CalculatorRequest,
} from "./types";

type UseCalculatorSocketReturn = {
  status: CalculatorConnectionStatus;
  isCalculating: boolean;
  result: number | null;
  error: string | null;
  calculate: (operation: CalculatorOperation, numbers: number[]) => void;
};

const INVALID_REQUEST_MESSAGE = "Invalid calculator request";
const UNAUTHORIZED_MESSAGE = "Unauthorized";

function getCalculatorWebSocketUrl(): string {
  const configuredUrl = import.meta.env.VITE_CALCULATOR_WS_URL?.trim();

  if (configuredUrl) {
    const parsedUrl = new URL(configuredUrl);

    if (parsedUrl.protocol !== "ws:" && parsedUrl.protocol !== "wss:") {
      throw new Error("Calculator WebSocket URL must use ws:// or wss://.");
    }

    return parsedUrl.toString();
  }

  // Same-origin URL allows Vite's /ws proxy to handle development traffic.
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";

  return `${protocol}//${window.location.host}/ws/calculator`;
}

function validateRequest(
  operation: CalculatorOperation,
  numbers: number[],
): string | null {
  if (
    numbers.length < CALCULATOR_LIMITS.minNumbers ||
    numbers.length > CALCULATOR_LIMITS.maxNumbers
  ) {
    return "Enter between 1 and 100 numbers.";
  }

  if (
    !numbers.every(
      (number) =>
        Number.isFinite(number) &&
        Math.abs(number) <= CALCULATOR_LIMITS.maxAbsoluteValue,
    )
  ) {
    return "Every value must be finite and within the allowed range.";
  }

  if (operation === "divide" && numbers.slice(1).some((n) => n === 0)) {
    return "Division by zero is not allowed.";
  }

  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function useCalculatorSocket(): UseCalculatorSocketReturn {
  const socketRef = useRef<WebSocket | null>(null);
  const pendingRequestRef = useRef(false);
  const fatalErrorRef = useRef(false);

  const [status, setStatus] =
    useState<CalculatorConnectionStatus>("connecting");
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let socket: WebSocket;

    const token = sessionStorage.getItem("access_token");

    if (!token) {
      setStatus("error");
      setError("Authentication token not found. Please sign in again.");
      return;
    }

    try {
      socket = new WebSocket(getCalculatorWebSocketUrl());
      socketRef.current = socket;
    } catch {
      setStatus("error");
      setError("Could not create the Calculator WebSocket connection.");
      return;
    }

    let disposed = false;

    const onOpen = () => {
      if (disposed) return;

      try {
        // Authentication must be the first message sent by the client.
        socket.send(JSON.stringify({ token }));
        setStatus("authenticating");
      } catch {
        fatalErrorRef.current = true;
        setStatus("error");
        setError("Could not send the authentication message.");
        socket.close();
      }
    };

    const onMessage = (event: MessageEvent<unknown>) => {
      if (disposed) return;

      let message: unknown;

      try {
        if (typeof event.data !== "string") {
          throw new Error("Unexpected message format.");
        }

        message = JSON.parse(event.data);
      } catch {
        fatalErrorRef.current = true;
        setStatus("error");
        setError("The server sent an invalid JSON message.");
        socket.close();
        return;
      }

      if (!isRecord(message)) {
        fatalErrorRef.current = true;
        setStatus("error");
        setError("The server sent an invalid message.");
        socket.close();
        return;
      }

      if (message.type === "ready") {
        setStatus("ready");
        setError(null);
        return;
      }

      if (typeof message.error === "string") {
        if (message.error === UNAUTHORIZED_MESSAGE) {
          fatalErrorRef.current = true;
          setStatus("error");
          setError("Authentication failed. Please sign in again.");
          pendingRequestRef.current = false;
          setIsCalculating(false);
          socket.close();
          return;
        }

        // A documented invalid request does not close the connection.
        setError(
          message.error === INVALID_REQUEST_MESSAGE
            ? "The calculator rejected the request. Check your input."
            : message.error,
        );
        pendingRequestRef.current = false;
        setIsCalculating(false);
        return;
      }

      if ("result" in message) {
        if (
          typeof message.result !== "number" ||
          !Number.isFinite(message.result)
        ) {
          fatalErrorRef.current = true;
          setStatus("error");
          setError("The server returned an invalid calculation result.");
          pendingRequestRef.current = false;
          setIsCalculating(false);
          socket.close();
          return;
        }

        if (!pendingRequestRef.current) {
          setError("Received a result without a pending calculation.");
          return;
        }

        setResult(message.result);
        setError(null);
        pendingRequestRef.current = false;
        setIsCalculating(false);
        return;
      }

      fatalErrorRef.current = true;
      setStatus("error");
      setError("The server sent an unrecognized message.");
      socket.close();
    };

    const onError = () => {
      if (disposed) return;

      fatalErrorRef.current = true;
      setStatus("error");
      setError("A WebSocket connection error occurred.");
      pendingRequestRef.current = false;
      setIsCalculating(false);
    };

    const onClose = () => {
      if (disposed) return;

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      setStatus(
        fatalErrorRef.current ? "error" : "disconnected",
      );

      if (!fatalErrorRef.current) {
        setError("The Calculator connection was closed.");
      }

      pendingRequestRef.current = false;
      setIsCalculating(false);
    };

    socket.addEventListener("open", onOpen);
    socket.addEventListener("message", onMessage);
    socket.addEventListener("error", onError);
    socket.addEventListener("close", onClose);

    return () => {
      disposed = true;

      socket.removeEventListener("open", onOpen);
      socket.removeEventListener("message", onMessage);
      socket.removeEventListener("error", onError);
      socket.removeEventListener("close", onClose);

      if (socketRef.current === socket) {
        socketRef.current = null;
      }

      if (
        socket.readyState === WebSocket.CONNECTING ||
        socket.readyState === WebSocket.OPEN
      ) {
        socket.close();
      }
    };
  }, []);

  const calculate = useCallback(
    (operation: CalculatorOperation, numbers: number[]) => {
      if (status !== "ready") {
        setError("The calculator is not ready yet.");
        return;
      }

      if (pendingRequestRef.current) {
        setError("Wait for the current calculation to finish.");
        return;
      }

      const validationError = validateRequest(operation, numbers);

      if (validationError) {
        setError(validationError);
        setResult(null);
        return;
      }

      const socket = socketRef.current;

      if (!socket || socket.readyState !== WebSocket.OPEN) {
        setStatus("disconnected");
        setError("The Calculator connection is not open.");
        return;
      }

      const request: CalculatorRequest = { operation, numbers };

      try {
        pendingRequestRef.current = true;
        setIsCalculating(true);
        setResult(null);
        setError(null);

        socket.send(JSON.stringify(request));
      } catch {
        pendingRequestRef.current = false;
        setIsCalculating(false);
        setError("Could not send the calculation request.");
      }
    },
    [status],
  );

  return {
    status,
    isCalculating,
    result,
    error,
    calculate,
  };
}
