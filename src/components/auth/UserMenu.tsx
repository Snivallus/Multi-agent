
import React from 'react';
import { User, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';

interface UserMenuProps {
  language: Language;
}

const UserMenu: React.FC<UserMenuProps> = ({
  language,
}) => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // 点击 Settings 时调用的函数
  const handleSettingsClick = () => {
    toast({
      description: getText(translations.featureNotImplemented, language), // 功能尚未实现，敬请期待!
      variant: 'destructive',
    });
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <User className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {
                user.canModifyDialogue 
                ? getText(translations.administer, language)  // 管理员
                : getText(translations.regularUser, language) // 普通用户
              } 
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
          {/* 点击 Settings 弹窗项, 弹出 “功能尚未实现，敬请期待!” */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleSettingsClick}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>{getText(translations.settings, language)}</span>
          </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>{getText(translations.logout, language)}</span> {/* 退出登录 */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
