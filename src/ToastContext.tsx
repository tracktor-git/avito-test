import React from 'react';
import { Toast } from 'primereact/toast';

type ToastContextType = {
  showToast: (message: any) => void | undefined;
};

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);

  if (!context) {
    console.error('useToast должен использоваться внутри ToastProvider');

    return {
      showToast: () => {
        console.warn('Toast не может быть отображен, так как контекст отсутствует.');
      },
    };
  }

  return context;
};

type ToastProviderProps = {
  children: React.ReactNode;
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const toastRef = React.useRef<Toast>(null);

  const showToast = (message: any) => {
    toastRef.current?.show(message);
  };

  const value = React.useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      <Toast ref={toastRef} />
      {children}
    </ToastContext.Provider>
  );
};
