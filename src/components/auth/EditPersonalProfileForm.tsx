
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import config from '@/config';

// import { Input } from '@/components/ui/input'; // 浏览器原生日历
import ReactDatePickerWrapper from './ReactDatePickerWrapper'; // react-datepicker 的封装

interface EditPersonalProfileFormProps {
  language: Language;
  onSuccess: () => void;
}

const EditPersonalProfileForm: React.FC<EditPersonalProfileFormProps> = ({
  language,
  onSuccess,
}) => {
  const { user, updateUserProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: user?.gender !== undefined ? user.gender.toString() : 'true',
    birthDate: user?.birthDate || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiBaseUrl_1}/auth/edit_personal_profile`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: user.username,
          gender: formData.gender === 'true',
          birth_date: formData.birthDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update personal profile');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        // 更新用户信息
        const updatedUser = {
          id: data.user.user_id,
          username: data.user.username,
          canModifyDialogue: data.user.can_modify,
          gender: data.user.gender,
          birthDate: data.user.birth_date,
          age: data.user.age,
        };
        
        updateUserProfile(updatedUser);
        
        toast({
          // language === 'zh' ? '个人信息更新成功' : 'Personal profile updated successfully'
          description: getText(translations.personalProfileUpdateSuccess, language),
        });
        
        onSuccess();
      } else {
        throw new Error(data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Edit personal profile error:', error);
      toast({
        // language === 'zh' ? '更新失败，请重试' : 'Update failed, please try again'
        description: getText(translations.personalProfileUpdateSuccess, language),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-3">
        <Label>
          {/* language === 'zh' ? '性别' : 'Gender' */}
          {getText(translations.gender, language)}
        </Label>
        <RadioGroup
          value={formData.gender}
          onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="male" />
            <Label htmlFor="male">
              {/* language === 'zh' ? '男' : 'Male' */}
              {getText(translations.male, language)}
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="female" />
            <Label htmlFor="female">
              {/* language === 'zh' ? '女' : 'Female' */}
              {getText(translations.female, language)}
            </Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="birth-date">
          {/* language === 'zh' ? '生日' : 'Birth Date' */}
          {getText(translations.birthDate, language)}
        </Label>
        {/* <Input
          id="birth-date"
          type="date"
          value={formData.birthDate}
          onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
          required
        /> */}
        <ReactDatePickerWrapper
          value={formData.birthDate}
          onChange={(newDateStr) => setFormData(prev => ({ ...prev, birthDate: newDateStr }))}
          language={language}
        />
      </div>
      
      {user?.age && (
        <div className="text-sm text-gray-600">
          {/* language === 'zh' ? '当前年龄: ' : 'Current age: ' */}
          {getText(translations.currentAge, language)}{user.age}
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {/* isLoading 
          ? (language === 'zh' ? '更新中...' : 'Updating...') 
          : (language === 'zh' ? '更新个人信息' : 'Update Personal Info')
         */}
        { isLoading 
          ? getText(translations.updating, language)
          : getText(translations.personalProfileUpdate, language)
        }
      </Button>
    </form>
  );
};

export default EditPersonalProfileForm;
