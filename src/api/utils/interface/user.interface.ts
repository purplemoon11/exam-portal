export class UserType {
  full_name: string;
  phone_number: string;
  passport: string;
  otpVerified?: string;
  email?: string;
  password: string;
}

export interface RegistrationData {
  passport: string;
  password: string;
}
