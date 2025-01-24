import { Request, Response } from "express";
import requestvalidation from "./requestvalidation";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import { Token } from "../entity/Token";
import { encryptPassWord, generateToken } from "./passwordManager";
import checkEmail from "./checkemail";
import pin from "./generatepin";
import * as dotenv from "dotenv";
import { Resend } from "resend";
import { Emailcode } from "../entity/Emailcode";
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

// send email verification code
export const verificationCode = async (req: Request, res: Response) => {
  const { message, proceed } = requestvalidation(req.body, ["email:string"]);
  if (!proceed) {
    res.json({
      message: message,
      proceed: false,
    });
    return;
  }

  // check if the email already exist
  const { email_message, email_proceed } = await checkEmail(req.body.email);
  if (!email_proceed) {
    // if the email already exist
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

    /*     setTimeout(async () => {
      try {
        await AppDataSource.createQueryBuilder()
          .delete()
          .from(Emailcode)
          .where("email = :email", { email: req.body.email })
          .execute();
        console.log("code has expired");
      } catch (err) {
        console.error("Failed to delete verification code:", err);
      }
    }, 600000);  */ //code to expire after 10 minutes set up a cron job
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
    .delete().from(Emailcode)
    .where("code = :code", { code: req.body.code })
    .execute();

  res.send({
    message: "your email is verified",
    proceed: true,
  });
  return;
};
