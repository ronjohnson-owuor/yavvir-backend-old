import { Request, Response } from "express";
import requestvalidation from "./requestvalidation";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Token } from "../entity/Token";
import {
  decryptedPassword,
  encryptPassWord,
  generateToken,
} from "./passwordManager";
import checkEmail from "./checkemail";
import pin from "./generatepin";
import * as dotenv from "dotenv";
import { Resend } from "resend";
import { Emailcode } from "../entity/Emailcode";
import validateAuthToken from "./validateAuthtoken";
dotenv.config();

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

  let successfull = true;
  const encryptedPassword = encryptPassWord(req.body.password);
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
        url: `/${type}-dashboard`, // url that the user is going to be redirected to in the frontend.
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

export const verificationCode = async (req: Request, res: Response) => {
  const { message, proceed } = requestvalidation(req.body, ["email:string"]);
  if (!proceed) {
    res.json({
      message: message,
      proceed: false,
    });
    return;
  }

  const { email_message, email_proceed } = await checkEmail(req.body.email);
  if (!email_proceed) {
    res.json({
      message: email_message,
      proceed: false,
    });
    return;
  }
  let { generatedPin } = pin();
  let number_pin = Number(generatedPin);
  const emailRepo = await AppDataSource.getRepository(Emailcode).findOneBy({
    email: req.body.email,
  });
  if (emailRepo) {
    res.json({
      message:
        "that email already has a verification code wait after 10 minutes for the code to expire",
      proceed: false,
    });
    return;
  }
  const resend_key = process.env.RESEND_API_KEY!;
  const resend = new Resend(resend_key);
  const { data, error } = await resend.emails.send({
    from: "authentication@yavvir.com",
    to: [req.body.email],
    subject: "yavvir verification code",
    html: `<h1>Hello,its yavvir bot</h1></br><p>your verification code is <strong style='color:red'>${number_pin} </strong> </p><br><br><p>If its not you then someone is trying to login to our service using your email that is all we know</p>
    <br>
    <p>note:this pin expires after 10 minutes </p>
    `,
  });

  if (error) {
    res.json({
      message: error.message + "  try again later",
      proceed: false,
    });
    return;
  }

  try {
    AppDataSource.createQueryBuilder()
      .insert()
      .into(Emailcode)
      .values([
        {
          email: req.body.email,
          code: number_pin,
        },
      ])
      .execute();
  } catch (err) {
    res.json({
      message: "network error try again in 5sec",
      proceed: false,
    });
    return;
  }

  res.json({
    message: email_message,
    proceed: true,
  });
  return;
};

export const verifyEmailCode = async (req: Request, res: Response) => {
  const { message, proceed } = requestvalidation(req.body, [
    "email:string",
    "code:number",
  ]);
  if (!proceed) {
    res.send({
      message,
      proceed,
    });
    return;
  }
  const email_code = await AppDataSource.getRepository(Emailcode).findOneBy({
    code: req.body.code,
  });
  if (!email_code) {
    res.send({
      message: "that code does not exist or it has expired",
      proceed: false,
    });
    return;
  }
  if (email_code.email !== req.body.email) {
    res.send({
      message: "Email mismatch.Please regenerate a new code",
      proceed: false,
    });
    return;
  }

  if (email_code.code !== req.body.code) {
    res.send({
      message: "code mismatch.Please regenerate a new code that code is wrong",
      proceed: false,
    });
    return;
  }

  await AppDataSource.createQueryBuilder()
    .delete()
    .from(Emailcode)
    .where("code = :code", { code: req.body.code })
    .execute();

  res.send({
    message: "your email is verified",
    proceed: true,
  });
  return;
};

export const loginUser = async (req: Request, res: Response) => {
  let { message, proceed } = requestvalidation(req.body, [
    "email:string",
    "password:string",
  ]);
  if (!proceed) {
    res.json({
      message,
      proceed,
    });
    return;
  }

  const user = await AppDataSource.getRepository(Users).findOneBy({
    email: req.body.email,
  });
  if (!user) {
    res.json({
      message: "that user does not exist",
      proceed: false,
    });
    return;
  }
  let password = decryptedPassword(user.password);
  if (password != req.body.password) {
    res.json({
      message: "invalid password,that is a wrong password.",
      proceed: false,
    });
    return;
  }
  const token = await generateToken();
  await AppDataSource.createQueryBuilder()
    .update(Token)
    .set({ token_value: token })
    .where("id =:id", { id: user.id })
    .execute();
  res.json({
    message: "login successfull",
    proceed: true,
    token,
    url: `/${user.role}-dashboard`,
  });
  return;
};

export const getUser = async (req: Request, res: Response) => {
  const { message, proceed, userid } = await validateAuthToken(
    req.headers.authorization
  );

  if (!proceed) {
    res.json({
      message,
      proceed,
    });
    return;
  }

  const user = await AppDataSource.getRepository(Users).findOneBy({
    id: userid!,
  });
  const userobject = {
    username:user?.username,
    email:user?.email,
    id:user?.id,
    phone:user?.phone,
    picture:user?.picture,
    role:user?.role
    
  }
  res.json({
    message,
    proceed,
    user:userobject,
  });
  return;
};
