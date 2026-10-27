
export type CalculatorOperation =
  | "add"
  | "subtract"
  | "multiply"
  | "divide";

export type CalculatorRequest = {
  operation: CalculatorOperation;
  numbers: number[];
};

export type CalculatorReadyMessage = {
  type: "ready";
};

export type CalculatorResultMessage = {
  result: number;
};

export type CalculatorErrorMessage = {
  error: string;
};

export type CalculatorServerMessage =
  | CalculatorReadyMessage
  | CalculatorResultMessage
  | CalculatorErrorMessage;

export type CalculatorConnectionStatus =
  | "connecting"
  | "authenticating"
  | "ready"
  | "disconnected"
  | "error";

export const CALCULATOR_LIMITS = {
  minNumbers: 1,
  maxNumbers: 100,
  maxAbsoluteValue: 1_000_000_000_000,
} as const;
