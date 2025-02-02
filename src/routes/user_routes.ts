import express, { Request, Response } from "express";
import router from "./router";
import { getUser, googleAccount, loginUser, verificationCode, verifyEmailCode } from "../services/auth";
import cors from 'cors';
import { corsOptions } from "../services/corsOptions";


router.post(
  "/signup-user",
  cors(corsOptions),
  async (req: Request, res: Response) => await googleAccount(req, res)
);

router.post(
  "/login-user",
  cors(corsOptions),
  async (req: Request, res: Response) => await loginUser(req, res)
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

router.get(
  "/get-user-data",
  cors(corsOptions),
  async (req: Request, res: Response) => await getUser(req, res)
);

export default router;
