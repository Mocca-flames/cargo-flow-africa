import { useState, useCallback, useRef } from "react";
import {
  createDefaultState,
  validate,
  clearFieldError,
  toPayload,
  submitQuote,
  type QuoteFormState,
  type SubmitResult,
} from "./quote-form";

const STEP_FIELDS: Record<number, (keyof QuoteFormState)[]> = {
  1: ["commodity", "commodityOther", "from", "to"],
  2: ["timing", "timingSpecific", "quantityValue"],
  3: ["name", "company", "contact"],
  4: [],
};

export function useQuoteForm() {
  const [state, setState] = useState<QuoteFormState>(createDefaultState());
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement | null>(null);

  const setField = useCallback(<K extends keyof QuoteFormState>(key: K, value: QuoteFormState[K]) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
      errors: clearFieldError(prev.errors, key),
    }));
  }, []);

  const openSpecifics = useCallback(() => {
    setState((prev) => prev.specificsExpanded ? prev : { ...prev, specificsExpanded: true });
  }, []);

  const toggleSpecifics = useCallback(() => {
    setState((prev) => ({ ...prev, specificsExpanded: !prev.specificsExpanded }));
  }, []);

  const validateStep = useCallback((s: number): boolean => {
    const fields = STEP_FIELDS[s] ?? [];
    const errs = validate(state);
    const stepErrs = Object.fromEntries(
      Object.entries(errs).filter(([key]) => fields.includes(key as keyof QuoteFormState))
    );
    setState((prev) => ({ ...prev, errors: { ...prev.errors, ...stepErrs } }));
    return Object.keys(stepErrs).length === 0;
  }, [state]);

  const nextStep = useCallback(() => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4));
  }, [step, validateStep]);

  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const errors = validate(state);
    setState((prev) => ({ ...prev, errors }));

    if (Object.keys(errors).length > 0) {
      const firstKey = Object.keys(errors)[0];
      const el = formRef.current?.querySelector(`[data-focus="${firstKey}"]`) as HTMLElement | null
        ?? formRef.current?.querySelector(`[name="${firstKey}"]`) as HTMLElement | null;
      el?.focus();
      return false;
    }

    setState((prev) => ({ ...prev, submitStatus: "submitting" }));
    const payload = toPayload(state);
    const result: SubmitResult = await submitQuote(payload);

    if (result.ok) setState((prev) => ({ ...prev, submitStatus: "success" }));
    else setState((prev) => ({ ...prev, submitStatus: "error", errorMessage: result.error }));
    return result.ok;
  }, [state]);

  const resetForm = useCallback(() => {
    setState(createDefaultState());
    setStep(1);
  }, []);

  return { state, setState, setField, openSpecifics, toggleSpecifics, step, nextStep, prevStep, handleSubmit, resetForm, formRef };
}
