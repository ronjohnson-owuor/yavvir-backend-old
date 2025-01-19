import express, { Request, Response } from "express";
import router from "./router";
import { googleAccount } from "../services/auth";
import cors from 'cors';
import { corsOptions } from "../services/corsOptions";

router.post(
  "/google-user",
  cors(corsOptions),
  async (req: Request, res: Response) => await googleAccount(req, res)
);

export default router;
