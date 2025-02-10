import { Request, Response } from "express";
import validateAuthToken from "./validateAuthtoken";
import requestvalidation from "./requestvalidation";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import https from "https";
import shortUUID from "short-uuid";
import { Receipt } from "../entity/Receipt";
import { Teacherdetails } from "../entity/Teacherdetails";

const secret_key = process.env.PAYSTACK_SECRET_KEY;
const teacherDetailsRepo = AppDataSource.getRepository(Teacherdetails);
const receiptRepo = AppDataSource.getRepository(Receipt);
export const initializePayment = async (req: Request, res: Response) => {
    let amount = 0;
  const authResponse = await validateAuthToken(req.headers.authorization);
  if (!authResponse.proceed) {
    res.json({
      message: authResponse.message,
      proceed: false,
    });
    return;
  }
  const userId = authResponse.userid!;
  //   validate the body for anount
  const { message, proceed } = requestvalidation(req.body, [
    "payment_type:number"
  ]);
  if (!proceed) {
    res.json({
      message,
      proceed,
    });
    return;
  }

  //   if the user wants to become a premium teacher he must first update his teacher details.
  if (req.body.payment_type == 1) {
    amount = 1505;
    const teacher_details = await teacherDetailsRepo.findOneBy({ user_id: userId });
    if (!teacher_details) {
      res.json({
        message:
          "update your teacher details before you apply for a premium teacher spot",
        proceed: false,
      });
      return;
    }
  }

  const user = await AppDataSource.getRepository(Users).findOneBy({
    id: userId,
  });
  if (!user) {
    res.json({
      message: "user does not exist",
      proceed: false,
    });
    return;
  }

  const email = user.email;

  const custom_refference = shortUUID.generate();
  const params = JSON.stringify({
    email,
    amount: amount * 100,
    metadata: JSON.stringify({
      payment_type: req.body.payment_type,
      user_id: user.id,
      receipt_number: custom_refference,
    }),
  });

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: "/transaction/initialize",
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret_key}`,
      "Content-Type": "application/json",
    },
  };

  const paystackReq = https
    .request(options, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", async () => {
        let parsedData = JSON.parse(data);
        if (!parsedData.status) {
          res.json({
            message: "payment not initialized",
            proceed: false,
          });
          return;
        }
        const url = parsedData.data.authorization_url;
        const refference = parsedData.data.reference;
        // generate a receipt and store it in the db
        const receipt = receiptRepo.create({
          customer_id: user.id,
          refference,
          receipt: custom_refference,
        });
        await receiptRepo.save(receipt);

        res.json({
          message: "payment initialized",
          proceed: true,
          url,
        });
        return;
      });
    })
    .on("error", (error) => {
      res.json({
        message: "payment not initialized",
        proceed: false,
      });
      return;
    });
  paystackReq.write(params);
  paystackReq.end();
};

export const paymentCallBack = async (req: Request, res: Response) => {
  const reference = req.params.reference || req.query.reference;

  if (!reference) {
    res.json({
      proceed: false,
      message: "Transaction reference is missing",
    });
    return;
  }

  const options = {
    hostname: "api.paystack.co",
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: "GET",
    headers: {
      Authorization: `Bearer ${secret_key}`,
    },
  };

  const paystackReq = https
    .request(options, (payment_response) => {
      let data = "";

      payment_response.on("data", (chunk) => {
        data += chunk;
      });

      payment_response.on("end", async () => {
        const data_parsed = JSON.parse(data);
        if (!data_parsed.status) {
          // transaction failed
          res.send("transaction failled");
          return;
        }

        // check typeof payment
        const payment_type = data_parsed.data.metadata.payment_type;
        const receipt_number = data_parsed.data.metadata.receipt_number;
        const refference = data_parsed.data.reference;
        const receiptRepo = AppDataSource.getRepository(Receipt);
        const user_id = data_parsed.data.metadata.user_id;
        await receiptRepo.update(
          { refference, receipt: receipt_number },
          {
            paid: true,
          }
        );
        /* 
    ####### HANDLE DIFFERENT TYPES OF PAYMENTS HERE FOR YOUR SERVICES ###############
    */
        if (payment_type == 1) {
          const { proceed } = await handlePremiumTeacherPayment(user_id);
          if (proceed) {
            res.send(`<h1>You are now a premium teacher</h1>`);
            return;
          }
          res.send(
            "there was an error if you have paid contact the sales team"
          );
          return;
        }

        /* 
    #####################################################################################
    */
      });
    })
    .on("error", (error) => {
      console.error(error);
      res.json({
        proceed: false,
        message: "unable to finish your request" + error.message,
      });
      return;
    });
  paystackReq.end();
};

const handlePremiumTeacherPayment = async (user_id: number) => {
  // set the teacher to peremium
  await teacherDetailsRepo.update({user_id }, { premium: true });
  return { proceed: true };
};
