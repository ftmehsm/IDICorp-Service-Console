import { useEffect, useState } from "react";

import type { CalculatorOperation } from "./types";
import { useCalculatorSocket } from "./useCalculatorSocket";
import {
  appendDecimal,
  appendDigit,
  deleteLastCharacter,
  getOperationSymbol,
  toggleNumberSign,
} from "./calculatorUtils";
import { OPERATORS, STATUS_LABELS, CALCULATOR_KEYS } from "./const";
import styles from "./Calculator.module.css";

export default function Calculator() {
  const { status, isCalculating, result, error, calculate } =
    useCalculatorSocket();

  const [display, setDisplay] = useState("0");
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<CalculatorOperation | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [expression, setExpression] = useState("");

  const isReady = status === "ready" && !isCalculating;

  useEffect(() => {
    if (result === null) return;

    setDisplay(String(result));
    setExpression(`Result: ${result}`);
    setFirstOperand(null);
    setOperation(null);
    setWaitingForOperand(true);
  }, [result]);

  function enterDigit(digit: string) {
    if (!isReady) return;

    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => appendDigit(current, digit));
  }

  function enterDecimal() {
    if (!isReady) return;

    if (waitingForOperand) {
      setDisplay("0.");
      setWaitingForOperand(false);
      return;
    }

    setDisplay((current) => appendDecimal(current));
  }

  function chooseOperation(nextOperation: CalculatorOperation) {
    if (!isReady) return;

    const currentValue = Number(display);

    if (!Number.isFinite(currentValue)) return;

    setFirstOperand(currentValue);
    setOperation(nextOperation);
    setWaitingForOperand(true);
    setExpression(`${display} ${getOperationSymbol(nextOperation)}`);
  }

  function calculateResult() {
    if (!isReady || firstOperand === null || operation === null) {
      return;
    }

    const secondOperand = Number(display);

    if (!Number.isFinite(secondOperand)) return;

    setExpression(
      `${firstOperand} ${getOperationSymbol(operation)} ${secondOperand} =`,
    );

    calculate(operation, [firstOperand, secondOperand]);
  }

  function clearCalculator() {
    setDisplay("0");
    setFirstOperand(null);
    setOperation(null);
    setWaitingForOperand(false);
    setExpression("");
  }

  function deleteLastDigit() {
    if (!isReady || waitingForOperand) return;

    setDisplay((current) => deleteLastCharacter(current));
  }

  function toggleSign() {
    if (!isReady || Number(display) === 0) return;

    setDisplay((current) => toggleNumberSign(current));
  }

  function handleKeyPress(key: (typeof CALCULATOR_KEYS)[number]) {
    switch (key.type) {
      case "digit":
        enterDigit(key.value);
        break;

      case "decimal":
        enterDecimal();
        break;

      case "operator":
        chooseOperation(key.value);
        break;

      case "clear":
        clearCalculator();
        break;

      case "sign":
        toggleSign();
        break;

      case "delete":
        deleteLastDigit();
        break;

      case "equals":
        calculateResult();
        break;
    }
  }

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <h1>Calculator</h1>
          <p>WebSocket-powered arithmetic calculator</p>
        </div>

        <div className={styles.connection} role="status" aria-live="polite">
          <span
            className={`${styles.indicator} ${styles[status]}`}
            aria-hidden="true"
          />
          <span>{STATUS_LABELS[status]}</span>
        </div>
      </header>

      <div className={styles.calculator}>
        <div className={styles.displayPanel}>
          <div className={styles.expression} aria-live="polite">
            {expression || "\u00a0"}
          </div>

          <output
            className={styles.display}
            aria-label={`Calculator display: ${display}`}
            aria-live="polite"
          >
            {display}
          </output>
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <div className={styles.keypad} aria-label="Calculator keypad">
          {CALCULATOR_KEYS.map((key, index) => {
            const isOperator = key.type === "operator";
            const operator = isOperator
              ? OPERATORS.find((item) => item.value === key.value)
              : undefined;

            const label =
              key.type === "digit"
                ? key.value
                : key.type === "decimal"
                  ? "."
                  : key.type === "clear"
                    ? "C"
                    : key.type === "sign"
                      ? "+/−"
                      : key.type === "delete"
                        ? "⌫"
                        : key.type === "equals"
                          ? "="
                          : (operator?.symbol ?? "");

            const isDisabled = key.type === "clear" ? isCalculating : !isReady;

            const className = [
              styles.key,
              key.type === "clear" ||
              key.type === "sign" ||
              key.type === "delete"
                ? styles.utility
                : "",
              isOperator ? styles.operator : "",
              isOperator && operation === key.value ? styles.selected : "",
              key.type === "digit" && key.value === "0" ? styles.zero : "",
              key.type === "equals" ? styles.equals : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={`${key.type}-${"value" in key ? key.value : index}`}
                type="button"
                className={className}
                onClick={() => handleKeyPress(key)}
                disabled={
                  isDisabled ||
                  (key.type === "equals" &&
                    (firstOperand === null || operation === null))
                }
                aria-label={
                  key.type === "digit"
                    ? key.value
                    : key.type === "decimal"
                      ? "Decimal point"
                      : key.type === "clear"
                        ? "Clear calculator"
                        : key.type === "sign"
                          ? "Toggle sign"
                          : key.type === "delete"
                            ? "Delete last digit"
                            : key.type === "equals"
                              ? "Calculate result"
                              : operator?.label
                }
                aria-pressed={isOperator ? operation === key.value : undefined}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className={styles.footer}>
          {status === "ready"
            ? "Ready to calculate"
            : "Calculations are available when the service is ready."}
        </p>
      </div>
    </section>
  );
}
