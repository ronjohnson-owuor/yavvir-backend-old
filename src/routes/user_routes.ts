import express, { Request, Response } from "express";
import router from "./router";
import { googleAccount, verificationCode, verifyEmailCode } from "../services/auth";
import cors from 'cors';
import { corsOptions } from "../services/corsOptions";


router.post(
  "/signup-user",
  cors(corsOptions),
  async (req: Request, res: Response) => await googleAccount(req, res)
);

router.post(
  "/generate-email-code",
  cors(corsOptions),
  async (req: Request, res: Response) => await verificationCode(req, res)
);
router.post(
  "/verify-email-code",
  cors(corsOptions),
  async (req: Request, res: Response) => await verifyEmailCode(req, res)
);

export default router;
