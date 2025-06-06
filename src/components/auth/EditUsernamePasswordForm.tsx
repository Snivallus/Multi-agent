
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Language } from '@/types/language';
import config from '@/config';

interface EditUsernamePasswordFormProps {
  language: Language;
  onSuccess: () => void;
}

const EditUsernamePasswordForm: React.FC<EditUsernamePasswordFormProps> = ({
  language,
  onSuccess,
}) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    newUsername: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        description: language === 'zh' ? '密码确认不匹配' : 'Password confirmation does not match',
        variant: 'destructive',
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        description: language === 'zh' ? '密码至少需要6个字符' : 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl_1}/auth/edit_username_and_password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: user.username,
          new_username: formData.newUsername,
          new_password: formData.newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update username and password');
      }

      const data = await response.json();
      
      if (data.success) {
        toast({
          description: language === 'zh' ? '用户名和密码更新成功，请重新登录' : 'Username and password updated successfully, please log in again',
        });
        
        // 由于用户名和密码都变了，需要重新登录
        logout();
        onSuccess();
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Edit username/password error:', error);
      toast({
        description: language === 'zh' ? '更新失败，请重试' : 'Update failed, please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="current-username">
          {language === 'zh' ? '当前用户名' : 'Current Username'}
        </Label>
        <Input
          id="current-username"
          value={user?.username || ''}
          disabled
          className="bg-gray-100"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-username">
          {language === 'zh' ? '新用户名' : 'New Username'}
        </Label>
        <Input
          id="new-username"
          value={formData.newUsername}
          onChange={(e) => setFormData(prev => ({ ...prev, newUsername: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="new-password">
          {language === 'zh' ? '新密码' : 'New Password'}
        </Label>
        <Input
          id="new-password"
          type="password"
          value={formData.newPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">
          {language === 'zh' ? '确认新密码' : 'Confirm New Password'}
        </Label>
        <Input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
          required
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading 
          ? (language === 'zh' ? '更新中...' : 'Updating...') 
          : (language === 'zh' ? '更新用户名和密码' : 'Update Username & Password')
        }
      </Button>
    </form>
  );
};

export default EditUsernamePasswordForm;
