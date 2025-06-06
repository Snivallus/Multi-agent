
import React from 'react';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import EditUsernamePasswordForm from './EditUsernamePasswordForm';
import EditPersonalProfileForm from './EditPersonalProfileForm';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  language: Language;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  language,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {/* '设置' / 'Settings' */}
            {getText(translations.settings, language)}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="username-password" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="username-password">
              {/* '修改用户名和密码' / 'Username & Password' */}
              {getText(translations.usernamePassword, language)}
            </TabsTrigger>
            <TabsTrigger value="personal-info">
              {/* '修改个人信息' / 'Personal Profile' */}
              {getText(translations.personalProfile, language)}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="username-password" className="space-y-4">
            <EditUsernamePasswordForm 
              language={language} 
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
          
          <TabsContent value="personal-info" className="space-y-4">
            <EditPersonalProfileForm 
              language={language}
              onSuccess={() => onOpenChange(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
