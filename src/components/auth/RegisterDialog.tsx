
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
        title: getText(translations.registerFailed, language),
        description: getText(translations.passwordMismatch, language),
        variant: 'destructive',
      });
      return;
    }

    const success = await register(data.username, data.password);
    
    if (success) {
      toast({
        title: getText(translations.registerSuccess, language),
        description: getText(translations.registerSuccessDescription, language),
      });
      onOpenChange(false);
      form.reset();
    } else {
      toast({
        title: getText(translations.registerFailed, language),
        description: getText(translations.registerFailedDescription, language),
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-medical-blue">
            {getText(translations.userRegister, language)}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            {getText(translations.createAccount, language)}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              rules={{
                required: getText(translations.usernameRequired, language),
                minLength: {
                  value: 3,
                  message: getText(translations.usernameMinLength, language),
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: getText(translations.usernamePattern, language),
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getText(translations.username, language)}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder={getText(translations.usernamePlaceholder, language)}
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
                required: getText(translations.passwordRequired, language),
                minLength: {
                  value: 6,
                  message: getText(translations.passwordMinLength, language),
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getText(translations.password, language)}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={getText(translations.passwordPlaceholder, language)}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
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
                required: getText(translations.confirmPasswordRequired, language),
                validate: (value) =>
                  value === form.getValues('password') || getText(translations.passwordMismatch, language),
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{getText(translations.confirmPassword, language)}</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CheckCircle2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder={getText(translations.confirmPasswordPlaceholder, language)}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
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
              >
                {isLoading ? getText(translations.registering, language) : getText(translations.registerAccount, language)}
              </Button>

              <div className="text-center text-sm text-gray-600">
                {getText(translations.haveAccount, language)}{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-medical-blue hover:text-medical-dark-blue font-medium"
                >
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
