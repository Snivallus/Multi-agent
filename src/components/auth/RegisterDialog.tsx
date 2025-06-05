
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, User, Lock, CheckCircle2 } from 'lucide-react';
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
import { RegisterRequest } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface RegisterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
  language: Language;
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({
  open,
  onOpenChange,
  onSwitchToLogin,
  language,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register, isLoading } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterRequest>({
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterRequest) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: getText(translations.registerFailed, language), // 注册失败
        description: getText(translations.passwordMismatch, language), // 两次输入的密码不一致
        variant: 'destructive',
      });
      return;
    }

    const success = await register(data.username, data.password);
    
    if (success) {
      toast({
        title: getText(translations.registerSuccess, language), // 注册成功 
        description: getText(translations.registerSuccessDescription, language), // 账户创建成功, 欢迎使用 AI Hospital!
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: getText(translations.registerFailed, language), // 注册失败
        description: getText(translations.registerFailedDescription, language), // 用户名可能已被使用, 请尝试其他用户名.
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-medical-blue">
            {getText(translations.userRegister, language)} {/* 用户注册 */}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {getText(translations.createAccount, language)} {/* 创建您的 AI Hospital 账户 */}
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
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: getText(translations.usernamePattern, language), // 用户名只能包含字母、数字和下划线
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

            <FormField
              control={form.control}
              name="confirmPassword"
              rules={{
                required: getText(translations.confirmPasswordRequired, language), // 请再次输入密码
                validate: (value) =>
                  value === form.getValues('password') || getText(translations.passwordMismatch, language),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getText(translations.confirmPassword, language)}</FormLabel> {/* 两次输入的密码不一致! */}
                  <FormControl>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={getText(translations.confirmPasswordPlaceholder, language)} // 请再次输入密码
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-2 h-4 w-4 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff /> : <Eye />}
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
              > {/* 注册中... / 注册账户 */}
                {isLoading ? getText(translations.registering, language) : getText(translations.registerAccount, language)}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {/* 已有账户? */}
                {getText(translations.haveAccount, language)}{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-medical-blue hover:text-medical-dark-blue font-medium"
                >
                  {/* 立即登录 */}
                  {getText(translations.loginNow, language)}
                </button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterDialog;
