
import React, { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { ArrowRight, LogIn } from 'lucide-react';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthDialog from '@/components/auth/AuthDialog';
import UserMenu from '@/components/auth/UserMenu';

enum Step {
  LANDING = '/',
  CASE_SELECTION = '/database/case_selection',
  DIRECT_INTERACTION = '/direct_interaction',
}

/**
 * Landing 页面, 展示 "选择案例" 和 "直接交互" 的按钮
 * 通过 navigate 推到不同的路由 (path)
 */
const Index: React.FC<{ language: Language; toggleLanguage: () => void }> = ({
  language,
  toggleLanguage,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-20 text-center animate-fade-in">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-5xl md:text-6xl font-bold mb-6 
                     bg-clip-text text-transparent bg-gradient-to-r 
                     from-medical-blue to-medical-dark-blue animate-fade-in"
          style={{ animationDelay: '100ms', lineHeight: '1.25' }}
        >
          {getText(translations.appTitle, language)}
        </h1>
        <p
          className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto animate-fade-in"
          style={{ animationDelay: '200ms' }}
        >
          {getText(translations.appDescription, language)}
        </p>
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* 点击"选择案例", 切换到 CASE_SELECTION 步骤 */}
            <button
              onClick={() => navigate(Step.CASE_SELECTION)}
              className="btn-primary group inline-flex items-center"
            >
              {getText(translations.selectCaseButton, language)}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
            {/* 点击"直接交互", 切换到 DIRECT_INTERACTION 步骤 */}
            <button
              onClick={() => navigate(Step.DIRECT_INTERACTION)}
              className="btn-primary group inline-flex items-center"
            >
              {getText(translations.directInteractionButton, language)}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      {/* 右上角控制区域 */}
      <div className="fixed top-4 right-4 z-10 flex items-center gap-3">
        {/* 用户认证状态 */}
        {isAuthenticated ? (
          <UserMenu />
        ) : (
          <Button
            onClick={() => setAuthDialogOpen(true)}
            variant="outline"
            className="border-medical-blue text-medical-blue hover:bg-medical-blue hover:text-white"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {getText(translations.login, language)}
          </Button>
        )}
        
        {/* 语言切换按钮 */}
        <button
          onClick={toggleLanguage}
          className="px-4 py-2 bg-white shadow-md rounded-full hover:bg-gray-50 transition-colors duration-200 font-medium text-medical-blue border border-medical-light-blue"
        >
          {getText(translations.toggleLanguage, language)}
        </button>
      </div>

      {/* 认证对话框 */}
      <AuthDialog
        open={authDialogOpen}
        onOpenChange={setAuthDialogOpen}
        defaultMode="login"
      />
    </div>
  );
};

export default Index;
