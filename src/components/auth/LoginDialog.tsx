
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LoginRequest } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
  language: Language;
}

const LoginDialog: React.FC<LoginDialogProps> = ({
  open,
  onOpenChange,
  onSwitchToRegister,
  language,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginRequest>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    const success = await login(data.username, data.password);
    
    if (success) {
      toast({
        title: getText(translations.loginSuccess, language), // 登录成功
        description: getText(translations.welcomeBack, language), // 欢迎回来!
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: getText(translations.loginFailed, language), // 登录失败
        description: getText(translations.loginFailedDescription, language), // 用户名或密码错误, 请重试.
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-medical-blue">
            {getText(translations.userLogin, language)} {/* 用户登录 */}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {getText(translations.loginToAccount, language)} {/* 登录您的 AI Hospital 账户 */}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: getText(translations.usernameRequired, language), // 请输入用户名
                minLength: {
                  value: 3,
                  message: getText(translations.usernameMinLength, language), // 用户名至少需要3个字符
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getText(translations.username, language)}</FormLabel> {/* 用户名 */}
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={getText(translations.usernamePlaceholder, language)} // 请输入用户名
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{
                required: getText(translations.passwordRequired, language), // 请输入密码
                minLength: {
                  value: 6,
                  message: getText(translations.passwordMinLength, language), // 密码至少需要6个字符
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getText(translations.password, language)}</FormLabel> {/* 密码 */}
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={getText(translations.passwordPlaceholder, language)} // 请输入密码
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 pt-4">
              <Button
                type="submit"
                className="w-full bg-medical-blue hover:bg-medical-dark-blue"
                disabled={isLoading}
              > {/* 登录中... / 登录 */}
                {isLoading ? getText(translations.loggingIn, language) : getText(translations.login, language)}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {/* 还没有账户? */}
                {getText(translations.noAccount, language)}{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-medical-blue hover:text-medical-dark-blue font-medium"
                >
                  {/* 立即注册 */}
                  {getText(translations.registerNow, language)}
                </button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
