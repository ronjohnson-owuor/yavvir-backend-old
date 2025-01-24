import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";

export default async function checkEmail(email: string) {
  const userRepository = AppDataSource.getRepository(Users);
  const user = await userRepository.findOneBy({
    email: email,
  });

  if (user) {
    return {
      email_message: "that user email is already in use",
      email_proceed: false,
    };
  } else {
    return {
      email_message: "check your email account for verification code",
      email_proceed: true,
    };
  }
}
