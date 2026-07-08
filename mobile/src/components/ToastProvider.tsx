import React, { createContext, useContext, useCallback } from 'react';
import Toast from 'react-native-toast-message';

interface ToastContextValue {
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue>({
  showSuccess: () => {},
  showError: () => {},
  showInfo: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const showSuccess = useCallback((message: string, title = 'Success') => {
    Toast.show({ type: 'success', text1: title, text2: message, position: 'top' });
  }, []);

  const showError = useCallback((message: string, title = 'Error') => {
    Toast.show({ type: 'error', text1: title, text2: message, position: 'top' });
  }, []);

  const showInfo = useCallback((message: string, title = 'Info') => {
    Toast.show({ type: 'info', text1: title, text2: message, position: 'top' });
  }, []);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
}
