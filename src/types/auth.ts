
export interface User {
  id: number;
  username: string;
  canModifyDialogue: boolean; // 是否能在 Dialogue Simulation 使用修改按钮
  gender?: boolean; // true = male, false = female
  birthDate?: string; // YYYY-MM-DD format
  age?: number;
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

export interface EditUsernamePasswordRequest {
  username: string;
  new_username: string;
  new_password: string;
}

export interface EditPersonalProfileRequest {
  username: string;
  gender: boolean;
  birth_date: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: {
    user_id: number;
    username: string;
    can_modify: boolean;
    gender?: boolean;
    birth_date?: string;
    age?: number;
  };
  token?: string;
}
