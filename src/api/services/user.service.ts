import { User } from "../entity/user.entity";
import ormConfig from "../../config/ormConfig";

const userRepository = ormConfig.getRepository(User);

export interface IUpdateProfile {
  fullname: string;
  phNumber: string;
  email: string;
  passportNum: string;
  birthDate: Date;
  profileImage: string;
}

export const userRegister = async (userData: object) => {
  let user = await userRepository.save(userData);

  return user;
};

export const findByIdUser = async (userId: number) => {
  const user = await userRepository.findOne({ where: { id: userId } });
  return user;
};

export const updateUser = async (
  existingUser: User,
  dataToUpdate: IUpdateProfile
) => {
  // try{
  const mergeData = User.merge(existingUser, dataToUpdate);
  return await User.save(mergeData);
  // }catch(err:any){
  //   return  {message:err.message}
  // }
};
