import { Express, Request, Response } from "express";

import cors from "cors";
import router from "./router";
import { corsOptions } from "../services/corsOptions";
import {
  checkProfileCompleteness,
  edit_teacher_details,
  get_teacher_details,
  getTeacherFinancialDetails,
  isPremium,
  requestWithdrawal,
  teacherPaymentHistory,
  unpaidRequests,
} from "../services/teachers";
import { uploadData } from "../services/filemanager";
import { createLesson, deleteLesson, getLesson, lessonData, updateLesson } from "../services/lesson";

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

router.post(
  "/lessons-data",
  cors(corsOptions),
  async (req: Request, res: Response) => lessonData (req, res)
);

router.get(
  "/is-premium",
  cors(corsOptions),
  async (req: Request, res: Response) => isPremium (req, res)
);

router.post (
  "/get-finance-details",
  cors(corsOptions),
  async (req: Request, res: Response) => getTeacherFinancialDetails (req, res)
);

router.post (
  "/withdraw",
  cors(corsOptions),
  async (req: Request, res: Response) => requestWithdrawal (req, res)
);

router.post (
  "/transaction-tracker",
  cors(corsOptions),
  async (req: Request, res: Response) => teacherPaymentHistory (req, res)
);

router.post (
  "/pending-transactions",
  cors(corsOptions),
  async (req: Request, res: Response) => unpaidRequests (req, res)
);

export default router;

