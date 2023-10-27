import datasource from "../../../config/ormConfig";
import { User } from "../../entity/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AppErrorUtil from "../../utils/error-handler/appError";
import { sendMailService } from "../../utils/sendOtpMail";

const userRepository = datasource.getRepository(User);

export const forgetPassword = async (data: any, origin: any) => {
  const { email } = data;

  const user = await userRepository.findOneBy({ email: email });
  if (!user) {
    throw new AppErrorUtil(404, "User with this email not found");
  } else {
    const payload = { id: user.id, email: user.email };

    const secretKey = process.env.JWT_SECRET_KEY!;

    const token = jwt.sign(payload, secretKey, {
      expiresIn: "1d",
    });

    const emailSuccess = await sendMailService({
      email,
      token,
      subject: "Click the link below to reset password",
      origin,
    });
    return { emailSuccess, token };
  }
};

export const resetPassword = async (data: any) => {
  const { newPassword, confirmPassword, token } = data;

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])[\w!@#$%^&*?]{8,20}$/;

  if (!passwordPattern.test(newPassword)) {
    throw new AppErrorUtil(
      400,
      "The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character"
    );
  }
  if (newPassword !== confirmPassword) {
    throw new AppErrorUtil(400, "Password doesnot match");
  }
  const secretKey = process.env.JWT_SECRET_KEY!;
  const payload: any = jwt.verify(token, secretKey);
  console.log({ payload });
  const user = await userRepository.findOneBy({
    id: payload.passportNum,
  });
  console.log({ user });
  if (!user) {
    throw new AppErrorUtil(400, "Cannot find user");
  } else {
    user.password = await bcrypt.hash(newPassword, 10);
    const result = await userRepository.save(user);
    return result;
  }
};
