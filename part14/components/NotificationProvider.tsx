"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type NotificationContextValue = {
  notify: (message: string) => void;
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState("");
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((nextMessage: string) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    setMessage(nextMessage);
    timeout.current = setTimeout(() => setMessage(""), 5000);
  }, []);

  useEffect(
    () => () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    },
    [],
  );

  return (
    <NotificationContext.Provider value={{ notify }}>
      {message && (
        <div
          className="fixed right-4 top-4 z-50 rounded-lg bg-emerald-700 px-5 py-3 text-white shadow-lg"
          data-testid="notification"
          role="status"
        >
          {message}
        </div>
      )}
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider.");
  }

  return context;
}
