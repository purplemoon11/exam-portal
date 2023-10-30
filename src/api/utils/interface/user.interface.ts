export class UserType {
  full_name: string;
  phone_number: string;
  passport: string;
  otpVerified?: string;
  email?: string;
  password: string;
}

export interface LoginData {
  passportNum: string;
  password: string;
}

export interface OTP {
  userId: number;
  otpData: string;
}
