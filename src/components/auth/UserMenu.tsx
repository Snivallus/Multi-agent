
import React, { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { Language, getText } from '@/types/language';
import { translations } from '@/data/translations';
import SettingsDialog from './SettingsDialog';

interface UserMenuProps {
  language: Language;
}

const UserMenu: React.FC<UserMenuProps> = ({
  language,
}) => {
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);

  // 受控 DropdownMenu 的 open 状态
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
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

          {/* 设置 */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setMenuOpen(false);    // 先关闭下拉菜单, 彻底卸载它的透明层
              setSettingsOpen(true); // 再打开设置对话框
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>
              {/* '设置' / 'Setting' */}
              {getText(translations.settings, language)}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          
          {/* 注销 */}
          <DropdownMenuItem 
            className="cursor-pointer" 
            onClick={() => {
              setMenuOpen(false); // 注销前先关掉下拉菜单
              logout();
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>
              {/* '注销' / 'Logout' */}
              {getText(translations.logout, language)}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        language={language}
      />
    </>
  );
};

export default UserMenu;
