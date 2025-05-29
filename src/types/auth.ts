
export interface User {
  id: number;
  username: string;
  canModifyDialogue: boolean; // 是否能在 Dialogue Simulation 使用修改按钮
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}
