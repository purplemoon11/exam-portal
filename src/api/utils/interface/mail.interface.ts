import { User } from "../../entity/user.entity";

export interface IEmailOptions {
  subject?: string;
  otp?: string;
  email?: any;
  password?: string;
  text?: string;
  html?: string;
  token?: string;
  currentUrl?: string;
  origin?: string;
  registerUrl?: string;
  link?: string;
  htmlContent?: string;
  user?: typeof User;
}
