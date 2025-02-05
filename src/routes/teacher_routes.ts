import { Express, Request, Response } from "express";

import cors from "cors";
import router from "./router";
import { corsOptions } from "../services/corsOptions";
import {
  checkProfileCompleteness,
  edit_teacher_details,
  get_teacher_details,
} from "../services/teachers";
import { uploadData } from "../services/filemanager";
import { createLesson, deleteLesson, getLesson, updateLesson } from "../services/lesson";

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
router.post(
  "/profile-completeness",
  cors(corsOptions),
  async (req: Request, res: Response) => checkProfileCompleteness(req, res)
);

router.post(
  "/create-lesson",
  cors(corsOptions),
  async (req: Request, res: Response) => createLesson(req, res)
);

router.post(
  "/get-lesson",
  cors(corsOptions),
  async (req: Request, res: Response) => getLesson(req, res)
);

router.post(
  "/update-lesson",
  cors(corsOptions),
  async (req: Request, res: Response) => updateLesson(req, res)
);

router.post(
  "/delete-lesson",
  cors(corsOptions),
  async (req: Request, res: Response) => deleteLesson (req, res)
);

export default router;
