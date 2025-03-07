import { Request, Response } from "express";
import validateAuthToken from "./validateAuthtoken";
import { AppDataSource } from "../data-source";
import { Users } from "../entity/Users";
import requestvalidation from "./requestvalidation";
import shortUUID from "short-uuid";
import { Lesson } from "../entity/Lesson";
import { Refferals } from "../entity/Refferals";
import { Teacherdetails } from "../entity/Teacherdetails";
import moment from "moment";
import { Lessonprice } from "../entity/Lessonprice";

const lessonPriceRepo = AppDataSource.getRepository(Lessonprice);
export const createLesson = async (req: Request, res: Response) => {
  const authResponse = await validateAuthToken(req.headers.authorization);

  if (!authResponse.proceed) {
    res.json({
      message: authResponse.message,
      proceed: false,
    });
    return;
  }

  const userRepo = AppDataSource.getRepository(Users);
  const role = (await userRepo.findOneBy({ id: authResponse.userid! }))?.role;
  if (role != "teacher") {
    res.json({
      message: "you are  not a teacher only teachers can create lessons",
      proceed: false,
    });
    return;
  }

  const request_response = requestvalidation(req.body, [
    "lesson_name:string",
    "duration:number",
    "start_time:string",
    "lesson_price:number",
  ]);

  if (!request_response.proceed) {
    res.json({
      message: request_response.message,
      proceed: false,
    });
    return;
  }

  const lesson_link = shortUUID.generate();
  const start_time = req.body.start_time;
  const duration = req.body.duration + 5; // add a bonus 5 minutes
  const end_time = moment(start_time).add(duration, "minutes").toISOString();

  const lesson_price = req.body.lesson_price;
  if (lesson_price < 250) {
    res.json({
      proceed: false,
      message:
        "make sure your lesson price is more or eequal to 250 for maximum profit",
    });
    return;
  }
  try {
    const lessonRepository = AppDataSource.getRepository(Lesson);
    const lessonPrice = lessonPriceRepo.create({
      lesson_price,
      lesson_uuid: lesson_link,
    });
    await lessonPriceRepo.save(lessonPrice);
    const lesson = lessonRepository.create({
      creator: authResponse.userid!,
      duration,
      lesson_name: req.body.lesson_name,
      lesson_uuid: lesson_link,
      start_time,
      end_time,
      expired: false,
    });

    await lessonRepository.save(lesson);

    res.json({
      message: "lesson created successfully",
      proceed: true,
    });
    return;
  } catch (error) {
    res.json({
      message: "error creating the lesson try again",
      proceed: false,
    });
    return;
  }
};

export const getLesson = async (req: Request, res: Response) => {
  const authResponse = await validateAuthToken(req.headers.authorization);

  if (!authResponse.proceed) {
    res.json({
      message: authResponse.message,
      proceed: false,
    });
    return;
  }

  const lessonRepository = AppDataSource.getRepository(Lesson);
  const lessons = await lessonRepository.findBy({
    creator: authResponse.userid!,
    expired: false,
  });
  res.json({
    message: "lessons retrieved",
    proceed: true,
    lessons: lessons ?? null,
  });
  return;
};

// update lesson

export const updateLesson = async (req: Request, res: Response) => {
  const authResponse = await validateAuthToken(req.headers.authorization);

  if (!authResponse.proceed) {
    res.json({
      message: authResponse.message,
      proceed: false,
    });
    return;
  }

  const request_response = requestvalidation(req.body, ["id:number"]);

  if (!request_response.proceed) {
    res.json({
      message: request_response.message,
      proceed: false,
    });
    return;
  }

  const lessonId = req.body.id;

  const lessonRepository = AppDataSource.getRepository(Lesson);
  const lessons = await lessonRepository.findOneBy({
    creator: authResponse.userid!,
    id: lessonId,
  });

  if (!lessons) {
    res.json({
      message:
        "Lesson not found check the lesson and make sure you are the owner of the lesson",
      proceed: false,
    });
    return;
  }
  const start_time = req.body.start_time || lessons.start_time;
  const duration =
    (req.body.duration && req.body.duration + 5) || lessons.duration;
  lessons.lesson_name = req.body.lesson_name || lessons.lesson_name;
  lessons.duration = duration;
  lessons.start_time = start_time;

  const lesson_price = req.body.lesson_price;
  if (lesson_price) {
    if(lesson_price < 250){
      res.json({
        proceed: false,
        message:
          "make sure your lesson price is more or eequal to 250 for maximum profit",
      });
      return;
    }
    lessonPriceRepo.update({lesson_uuid:lessons.lesson_uuid},{lesson_price});
  }


  const end_time = moment(start_time).add(duration, "minutes").toDate();
  lessons.end_time = end_time;
  await lessonRepository.save(lessons);

  res.json({
    message: "Lesson updated successfully",
    proceed: true,
  });
  return;
};



export const deleteLesson = async (req: Request, res: Response) => {
  const authResponse = await validateAuthToken(req.headers.authorization);

  if (!authResponse.proceed) {
    res.json({
      message: authResponse.message,
      proceed: false,
    });
    return;
  }

  const request_response = requestvalidation(req.body, ["id:number"]);

  if (!request_response.proceed) {
    res.json({
      message: request_response.message,
      proceed: false,
    });
    return;
  }

  const lessonId = req.body.id;

  const lessonRepository = AppDataSource.getRepository(Lesson);
  const lesson = await lessonRepository.findOneBy({
    creator: authResponse.userid!,
    id: lessonId,
  });

  if (!lesson) {
    res.json({
      message:
        "Lesson not found check the lesson and make sure you are the owner of the lesson",
      proceed: false,
    });
    return;
  }
  lesson.expired = true;
  await lessonRepository.save(lesson);
  res.json({
    message: "Lesson deleted successfully",
    proceed: true,
  });
  return;
};

export const generateRefUrl = async (req: Request, res: Response) => {
  const { proceed, message, userid } = await validateAuthToken(
    req.headers.authorization
  );
  if (!proceed) {
    res.json({
      message,
      proceed,
    });
    return;
  }

  const refferalCode = shortUUID.generate();
  try {
    const refRepository = AppDataSource.getRepository(Refferals);
    // check if the user already has a code
    const code = await refRepository.findOneBy({ userid: userid! });
    if (code) {
      res.json({
        message: "retrieved",
        proceed: true,
        reff: code.ref_value,
      });
      return;
    }

    const ref_query = refRepository.create({
      userid: userid!,
      ref_value: refferalCode,
    });

    await refRepository.save(ref_query);

    res.json({
      proceed: true,
      reff: refferalCode,
      message: "generated",
    });

    return;
  } catch (error) {
    res.json({
      proceed: false,
      message: "error generating refferal link,try again later",
    });
    return;
  }
};

export const lessonData = async (req: Request, res: Response) => {
  const { message, userid, proceed } = await validateAuthToken(
    req.headers.authorization
  );
  if (!proceed) {
    res.json({
      message,
      proceed,
    });
    return;
  }

  const lessonRepo = AppDataSource.getRepository(Lesson);
  const teacherDetailsRepo = AppDataSource.getRepository(Teacherdetails);
  const totalLesson = await lessonRepo.count({ where: { creator: userid! } });
  const teacherDetails = await teacherDetailsRepo.findOneBy({
    user_id: userid!,
  });
  const expiredLesson = await lessonRepo.count({
    where: { creator: userid!, expired: true },
  });
  const pendingLesson = await lessonRepo.count({
    where: { creator: userid!, expired: false },
  });

  res.json({
    proceed: true,
    isPremium: teacherDetails?.premium ?? false,
    lesson: {
      total: totalLesson,
      expired: expiredLesson,
      pending: pendingLesson,
    },
  });
  return;
};
