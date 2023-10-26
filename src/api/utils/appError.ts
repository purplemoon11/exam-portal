export default class AppErrorUtil extends Error {
  status: number;
  message: string;
  success?: Boolean;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}
