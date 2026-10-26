import { API_BASE_URL } from "./config";

export interface CaptchaResponse {
  captcha: string;
  salt: string;
}

export interface LoginPayload {
  username: string;
  password: string;
  salt: string;
  captcha_answer: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export async function getCaptcha(): Promise<CaptchaResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch CAPTCHA: ${response.status}`);
  }

  return response.json() as Promise<CaptchaResponse>;
}


export async function login(
  payload: LoginPayload
): Promise<LoginResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(`Login failed: ${response.status}`);
  }

  return response.json() as Promise<LoginResponse>;
}