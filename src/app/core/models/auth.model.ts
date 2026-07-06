export interface SignUpRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
}

export interface AuthResponse extends AuthUser {
  token: string;
}
