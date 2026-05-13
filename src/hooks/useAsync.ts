import { useState, useCallback, useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * Custom hook for managing async operations (loading, error, success)
 */
export const useAsync = <T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate = true,
) => {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setValue(null);
    setError(null);

    try {
      const response = await asyncFunction();
      setValue(response);
      setStatus("success");
      return response;
    } catch (err) {
      setError(err as E);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    value,
    error,
    isLoading: status === "pending",
    isError: status === "error",
    isSuccess: status === "success",
  };
};

/**
 * Custom hook for tracking app state (foreground/background)
 */
export const useAppState = () => {
  const [appState, setAppState] = useState<AppStateStatus>("active");

  useEffect(() => {
    const listener = AppState.addEventListener("change", setAppState);

    return () => {
      listener.remove();
    };
  }, []);

  return {
    appState,
    isActive: appState === "active",
    isBackground: appState === "background",
  };
};

/**
 * Custom hook for managing loading state
 */
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const startLoading = useCallback(() => setIsLoading(true), []);
  const stopLoading = useCallback(() => setIsLoading(false), []);
  const setLoading = useCallback((state: boolean) => setIsLoading(state), []);

  return {
    isLoading,
    startLoading,
    stopLoading,
    setLoading,
  };
};

/**
 * Custom hook for managing modal/dialog state
 */
export const useModal = (initialState = false) => {
  const [isVisible, setIsVisible] = useState(initialState);

  const show = useCallback(() => setIsVisible(true), []);
  const hide = useCallback(() => setIsVisible(false), []);
  const toggle = useCallback(() => setIsVisible((prev) => !prev), []);

  return {
    isVisible,
    show,
    hide,
    toggle,
  };
};
