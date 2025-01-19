import { Request, Response } from "express";
import requestvalidation from "./requestvalidation";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Token } from "../entity/Token";
import { encryptPassWord, generateToken } from "./passwordManager";

export const googleAccount = async (req: Request, res: Response) => {
  // validate the body request
  const { message, proceed } = requestvalidation(req.body, [
    "username:string",
    "password:string",
    "email:string",
    "phone:string",
    "type:number",
  ]);
  if (!proceed) {
    res.json({
      message,
      proceed,
    });
    return;
  }

  // check email if its already in the database
  const userRepository = AppDataSource.getRepository(Users);
  const user = await userRepository.findOneBy({
    email: req.body.email,
  });

  if (user) {
    res.json({
      message: "that user email is already in use",
      proceed: false,
    });
    return;
  }

  // register the user
  let successfull = true;
  // encrypt userpassword
  const encryptedPassword = encryptPassWord(req.body.password);
  // generate token
  const userToken = await generateToken();
  const type =
    req.body.type == 1 ? "student" : req.body.type == 2 ? "teacher" : "parent";

  try {
    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Users)
      .values([
        {
          username: req.body.username,
          password: encryptedPassword,
          email: req.body.email,
          phone: req.body.phone,
          role: type,
          picture: req.body.picture ? req.body.picture : null,
        },
      ])
      .execute();
    const user = await AppDataSource.getRepository(Users).findOne({
      where: { email: req.body.email },
    });
    

    if (user) {
      const userId = user.id;
      const tokenFunction = await AppDataSource.createQueryBuilder()
        .insert()
        .into(Token)
        .values([
          {
            userid: userId,
            token_value: userToken,
          },
        ])
        .execute();

      if (!tokenFunction) {
        successfull = false;
      }
    } else {
      successfull = false;
    }

    if (successfull) {
      res.json({
        message: `welcome to yavvir,signup successfull as a ${type}`,
        proceed: true,
        token: userToken,
      });
      return;
    } else {
      res.json({
        message: `trouble in logging in ${type}s try again later`,
        proceed: false,
      });
      return;
    }
  } catch (err) {
    res.json({
      message: `our server is having some trouble..try again ${err} `,
      proceed: false,
    });
    return;
  }
};
