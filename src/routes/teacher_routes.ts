import { Express, Request, Response } from "express";

import cors from "cors";
import router from "./router";
import { corsOptions } from "../services/corsOptions";
import {
  edit_teacher_details,
  get_teacher_details,
} from "../services/teachers";
import { uploadData } from "../services/filemanager";

router.post(
  "/edit-teacher-details",
  cors(corsOptions),
  async (req: Request, res: Response) => edit_teacher_details(req, res)
);
router.post(
  "/get-teacher-details",
  cors(corsOptions),
  async (req: Request, res: Response) => get_teacher_details(req, res)
);

router.post(
    "/upload-teacher-files",
    cors(corsOptions),
    async (req: Request, res: Response) => uploadData(req, res)
  );

export default router;
