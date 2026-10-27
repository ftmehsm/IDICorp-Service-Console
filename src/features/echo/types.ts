
export type EchoConnectionStatus =
  | "connecting"
  | "ready"
  | "disconnected"
  | "error";

export type EchoReadyMessage = {
  type: "ready";
};

export type EchoMessageDirection = "sent" | "received";

export type EchoMessage = {
  id: string;
  text: string;
  direction: EchoMessageDirection;
  timestamp: number;
};
