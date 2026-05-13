import { useState, useCallback, useEffect } from "react";

interface UseFormInput {
  initialValue?: string;
  onValidate?: (value: string) => string | null;
}

interface UseFormField {
  value: string;
  setValue: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  onBlur: () => void;
  reset: () => void;
  validate: () => boolean;
}

/**
 * Custom hook for handling form fields with validation
 */
export const useFormField = ({
  initialValue = "",
  onValidate,
}: UseFormInput): UseFormField => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((): boolean => {
    if (onValidate) {
      const validationError = onValidate(value);
      setError(validationError);
      return !validationError;
    }
    return true;
  }, [value, onValidate]);

  const onBlur = useCallback(() => {
    validate();
  }, [validate]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    setValue,
    error,
    setError,
    onBlur,
    reset,
    validate,
  };
};

interface UseFormOptions {
  onSubmit: (values: Record<string, any>) => void | Promise<void>;
  onValidate?: (values: Record<string, any>) => Record<string, string>;
}

/**
 * Custom hook for handling form submission
 */
export const useForm = (
  initialValues: Record<string, string>,
  { onSubmit, onValidate }: UseFormOptions,
) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = useCallback(
    (field: string, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        // Re-validate on change if field was touched
        if (onValidate) {
          const newErrors = onValidate({ ...values, [field]: value });
          setErrors((prev) => ({ ...prev, [field]: newErrors[field] || "" }));
        }
      }
    },
    [values, touched, onValidate],
  );

  const handleBlur = useCallback(
    (field: string) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (onValidate) {
        const newErrors = onValidate(values);
        setErrors(newErrors);
      }
    },
    [values, onValidate],
  );

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    const newErrors = onValidate ? onValidate(values) : {};
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }

    setIsSubmitting(false);
  }, [values, onValidate, onSubmit]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setValues,
    setErrors,
  };
};
