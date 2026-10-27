
import type { CalculatorOperation } from "./types";

export const MAX_DISPLAY_LENGTH = 16;

export function formatDisplayValue(value: number): string {
  return String(value);
}

export function isValidCalculatorNumber(value: number): boolean {
  return (
    Number.isFinite(value) &&
    Math.abs(value) <= 1_000_000_000_000
  );
}

export function isValidNumbers(numbers: number[]): boolean {
  return (
    numbers.length >= 1 &&
    numbers.length <= 100 &&
    numbers.every(isValidCalculatorNumber)
  );
}

export function hasDivisionByZero(
  operation: CalculatorOperation,
  numbers: number[],
): boolean {
  return (
    operation === "divide" &&
    numbers.slice(1).some((number) => number === 0)
  );
}

export function getOperationSymbol(
  operation: CalculatorOperation,
): string {
  const symbols: Record<CalculatorOperation, string> = {
    add: "+",
    subtract: "−",
    multiply: "×",
    divide: "÷",
  };

  return symbols[operation];
}

export function canAppendDigit(
  currentValue: string,
  digit: string,
): boolean {
  if (!/^\d$/.test(digit)) {
    return false;
  }

  if (currentValue === "0") {
    return true;
  }

  const digitCount = currentValue.replace(/[-.]/g, "").length;

  return digitCount < MAX_DISPLAY_LENGTH;
}

export function appendDigit(
  currentValue: string,
  digit: string,
): string {
  if (!canAppendDigit(currentValue, digit)) {
    return currentValue;
  }

  if (currentValue === "0") {
    return digit;
  }

  return currentValue + digit;
}

export function appendDecimal(currentValue: string): string {
  if (currentValue.includes(".")) {
    return currentValue;
  }

  return `${currentValue}.`;
}

export function deleteLastCharacter(currentValue: string): string {
  const updatedValue = currentValue.slice(0, -1);

  if (
    updatedValue === "" ||
    updatedValue === "-"
  ) {
    return "0";
  }

  return updatedValue;
}

export function toggleNumberSign(currentValue: string): string {
  if (Number(currentValue) === 0) {
    return currentValue;
  }

  return currentValue.startsWith("-")
    ? currentValue.slice(1)
    : `-${currentValue}`;
}
