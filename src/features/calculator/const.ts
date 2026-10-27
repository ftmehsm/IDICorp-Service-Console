import type { CalculatorKey, CalculatorOperation } from "./types";

export const OPERATORS: {
  value: CalculatorOperation;
  symbol: string;
  label: string;
}[] = [
  { value: "divide", symbol: "÷", label: "Divide" },
  { value: "multiply", symbol: "×", label: "Multiply" },
  { value: "subtract", symbol: "−", label: "Subtract" },
  { value: "add", symbol: "+", label: "Add" },
];

export const OPERATOR_SYMBOLS: Record<CalculatorOperation, string> = {
  add: "+",
  subtract: "−",
  multiply: "×",
  divide: "÷",
};

export const STATUS_LABELS = {
  connecting: "Connecting",
  authenticating: "Authenticating",
  ready: "Ready",
  disconnected: "Disconnected",
  error: "Connection error",
} as const;

export const CALCULATOR_KEYS: CalculatorKey[] = [
  { type: "clear" },
  { type: "sign" },
  { type: "delete" },
  { type: "operator", value: "divide" },
  { type: "digit", value: "7" },
  { type: "digit", value: "8" },
  { type: "digit", value: "9" },
  { type: "operator", value: "multiply" },
  { type: "digit", value: "4" },
  { type: "digit", value: "5" },
  { type: "digit", value: "6" },
  { type: "operator", value: "subtract" },
  { type: "digit", value: "1" },
  { type: "digit", value: "2" },
  { type: "digit", value: "3" },
  { type: "operator", value: "add" },
  { type: "digit", value: "0" },
  { type: "decimal" },
  { type: "equals" },
];
