import logger from "../../config/logger";
import bcrypt from "bcrypt";
import ormConfig from "../../config/ormConfig";
import { User } from "../entity/user.entity";
console.log(
  "><><><><><><>< ------------ seeder running ------------ ><><><><><><><"
);
const userRepo = ormConfig.getRepository(User);
async function AdminSeeder() {
  const user = await userRepo.findOne({
    where: {
      role: "admin",
    },
  });
  if (!user) {
    const date = Date.now();
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 10);
    let user = new User();
    user.fullname = "Admin";
    user.email = process.env.ADMIN_EMAIL!;
    user.phNumber = "9878678765";
    user.password = hashedPassword;
    user.role = "admin";
    user.passportNum = process.env.ADMIN_PASSPORT!;
    user.birthDate = new Date("2000-01-01");
    userRepo
      .save(user)
      .then((data) => {
        console.log("admin user seeded.", data);
        logger.info("admin user seeded.");
      })
      .catch((err) => {
        if (err.code === "ER_DUP_ENTRY") {
          return logger.error("admin user already available.");
        }
        logger.error(err);
      });
  } else {
    console.log("admin user is already available");
    logger.error("admin user is already available");
  }
}
(async () => {
  await ormConfig.initialize();
  AdminSeeder();
})();
