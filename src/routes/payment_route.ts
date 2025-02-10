import { Express, Request, Response } from "express";
import router from "./router";
import cors from "cors";
import { corsOptions } from "../services/corsOptions";
import { initializePayment, paymentCallBack } from "../services/payments";

router.post(
    "/initialize-payment",
    cors(corsOptions),
    async (req: Request, res: Response) => initializePayment(req, res)
  );

  router.get(
    "/payment-callback",
    async (req: Request, res: Response) => paymentCallBack(req, res)
  );
export default router;