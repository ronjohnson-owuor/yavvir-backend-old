import { AppDataSource } from "../data-source";
import { Token } from "../entity/Token";

export default async function validateAuthToken(token: string|undefined) {
  const auth_token =token?.split(" ")[1];
  if (!token) {
    return {
      message:
        "you are trying to access a locked route make sure you have the permission to do so",
      proceed: false,
      userid: null,
    };
  }
  if (auth_token?.trim().length == 0) {
    return {
      message:
        "you are trying to access a locked route make sure you have the permission to do so",
      proceed: false,
      userid: null,
    };
  }
  const user = await AppDataSource.getRepository(Token).findOneBy({
    token_value: auth_token,
  });
  if (!user) {
    return {
      message: "user does not exist",
      userid: null,
      proceed: false,
    };
  }

  return {
    message: "user found",
    userid: user.id,
    proceed: true,
  };
}
