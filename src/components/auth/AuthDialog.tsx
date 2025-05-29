
import React, { useState } from 'react';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMode?: 'login' | 'register';
}

const AuthDialog: React.FC<AuthDialogProps> = ({
  open,
  onOpenChange,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);

  const handleSwitchToRegister = () => {
    setMode('register');
  };

  const handleSwitchToLogin = () => {
    setMode('login');
  };

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (!newOpen) {
      // 重置为默认模式
      setMode(defaultMode);
    }
  };

  if (mode === 'login') {
    return (
      <LoginDialog
        open={open}
        onOpenChange={handleOpenChange}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  return (
    <RegisterDialog
      open={open}
      onOpenChange={handleOpenChange}
      onSwitchToLogin={handleSwitchToLogin}
    />
  );
};

export default AuthDialog;
