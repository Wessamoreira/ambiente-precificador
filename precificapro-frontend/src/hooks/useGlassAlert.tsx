import { useState } from 'react';
import { GlassAlert } from '../components/ui/GlassAlert';

type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertConfig {
  type?: AlertType;
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useGlassAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<AlertConfig>({
    type: 'info',
    title: '',
    message: '',
  });

  const showAlert = (newConfig: AlertConfig) => {
    setConfig(newConfig);
    setIsOpen(true);
  };

  const closeAlert = () => {
    setIsOpen(false);
  };

  const AlertComponent = () => (
    <GlassAlert
      isOpen={isOpen}
      onClose={closeAlert}
      type={config.type}
      title={config.title}
      message={config.message}
      onConfirm={config.onConfirm}
      confirmText={config.confirmText}
      cancelText={config.cancelText}
    />
  );

  // Helpers para tipos específicos
  const showSuccess = (title: string, message: string) => {
    showAlert({ type: 'success', title, message });
  };

  const showError = (title: string, message: string) => {
    showAlert({ type: 'error', title, message });
  };

  const showWarning = (title: string, message: string) => {
    showAlert({ type: 'warning', title, message });
  };

  const showInfo = (title: string, message: string) => {
    showAlert({ type: 'info', title, message });
  };

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar'
  ) => {
    showAlert({
      type: 'warning',
      title,
      message,
      onConfirm,
      confirmText,
      cancelText,
    });
  };

  return {
    AlertComponent,
    showAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showConfirm,
    closeAlert,
  };
};
