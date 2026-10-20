import { useCallback, useState } from "react";
import { submitLead, validateLead, type LeadFields } from "./leads";
import type { LeadType } from "../types";

/**
 * Form state for the two lead forms: values, per-field errors, submission and
 * the success flag the UI swaps in. Errors clear as soon as the user edits the
 * offending field, so the form never nags.
 */
export function useLeadForm(type: LeadType, initial: LeadFields) {
  const [values, setValues] = useState<LeadFields>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  const setValue = useCallback((name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: "" } : prev));
  }, []);

  const reset = useCallback((next: LeadFields = initial) => {
    setValues(next);
    setErrors({});
    setDone(false);
    setPending(false);
  }, [initial]);

  const submit = useCallback(async () => {
    const found = validateLead(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      // Move focus to the first problem so keyboard and screen-reader users land on it.
      const first = document.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return false;
    }
    setPending(true);
    await submitLead(type, values);
    setPending(false);
    setDone(true);
    return true;
  }, [type, values]);

  return { values, errors, pending, done, setValue, submit, reset };
}
