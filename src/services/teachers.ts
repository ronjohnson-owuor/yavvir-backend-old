import { Request, Response } from "express";
import requestvalidation from "./requestvalidation";
import validateAuthToken from "./validateAuthtoken";
import { AppDataSource } from "../data-source";
import { Teacherdetails } from "../entity/Teacherdetails";
import { Users } from "../entity/Users";

export const edit_teacher_details = async (req: Request, res: Response) => {
  const authresponse = await validateAuthToken(req.headers.authorization);

  if (!authresponse.proceed) {
    res.json({
      message: authresponse.message,
      proceed: authresponse.proceed,
    });
    return;
  }

  try {
    let user_id = authresponse.userid!;
    let certificates = req.body.certificates || null;
    let ground_tutor = req.body.ground_tutor || undefined;
    let location = req.body.location || null;
    let school = req.body.school || null;
    let subjects = req.body.subjects || null;
    let bio = req.body.bio || null;
    let extra_info = req.body.extra_info || null;

    const teacherRepo = await AppDataSource.getRepository(
      Teacherdetails
    ).findOneBy({ user_id });

    if (teacherRepo) {
      // if the request body is not null then update the changes
      await AppDataSource.createQueryBuilder()
        .update(Teacherdetails)
        .set({
          user_id,
          certificates: certificates ? certificates : teacherRepo.certificates,
          ground_tutor:
            ground_tutor !== undefined
              ? ground_tutor
              : teacherRepo.ground_tutor,
          location: location ? location : teacherRepo.location,
          school: school ? school : teacherRepo.school,
          subjects: subjects ? subjects : teacherRepo.subjects,
          bio: bio ? bio : teacherRepo.bio,
          extra_info: extra_info ? extra_info : teacherRepo.extra_info,
        })
        .where("user_id = :user_id", { user_id })
        .execute();

      res.json({
        message: "changes updated successfully",
        proceed: true,
      });
      return;
    }
    // I validate the ground tutor if its there only if its the users first time signing up to the platform
    /* but if the user has already updated his profile once no need to require the ground tutor */
    const validationresponse = requestvalidation(req.body, [
      "ground_tutor:boolean",
    ]);

    if (!validationresponse.proceed) {
      res.json({
        message: validationresponse.message,
        proceed: validationresponse.proceed,
      });
      return;
    }

    await AppDataSource.createQueryBuilder()
      .insert()
      .into(Teacherdetails)
      .values([
        {
          user_id,
          certificates,
          ground_tutor,
          location,
          school,
          subjects,
          bio,
          extra_info,
        },
      ])
      .execute();

    res.json({
      message: "changes updated successfully",
      proceed: true,
    });
    return;
  } catch (err) {
    res.json({
      message: "there was an error updating the profile",
      proceed: false,
      err,
    });
    return;
  }
};

export const get_teacher_details = async (req: Request, res: Response) => {
  const authResponse = await validateAuthToken(req.headers.authorization);
  // check if the user exist
  if (!authResponse.proceed) {
    res.json({
      message: authResponse.message,
      proceed: authResponse.proceed,
    });
    return;
  }

  // get the user basic details
  const teacherRepo = await AppDataSource.getRepository(Users).findOneBy({
    id: authResponse.userid!,
  });
  const basic_data = {
    username: teacherRepo?.username,
    picture: teacherRepo?.picture,
    phone: teacherRepo?.phone,
    email: teacherRepo?.email,
  };
  // fetch the teachers other details
  const teacherDetailsRepo = await AppDataSource.getRepository(
    Teacherdetails
  ).findOneBy({ user_id: authResponse.userid! });
  const teacher_data = {
    certificates: teacherDetailsRepo?.certificates,
    ground_tutor: teacherDetailsRepo?.ground_tutor,
    location: teacherDetailsRepo?.location,
    school: teacherDetailsRepo?.school,
    subject: teacherDetailsRepo?.subjects,
    bio: teacherDetailsRepo?.bio,
    extra_info: teacherDetailsRepo?.extra_info,
  };
  null;

  res.json({
    message: "Teacher data retrieved",
    proceed: true,
    basic_data,
    teacher_data,
  });

  return;
};

export const checkProfileCompleteness = async (req: Request, res: Response) => {
  let profile_score = 100;
  const tokenResponse = await validateAuthToken(req.headers.authorization);
  if (!tokenResponse.proceed) {
    res.json({
      proceed: false,
      message: tokenResponse.message,
    });
    return;
  }
  // check if the profile picture is there
  const user = await AppDataSource.getRepository(Users).findOneBy({
    id: tokenResponse.userid!,
  });
  if (!user?.picture) {
    profile_score -= 20;
  }
  // check if the teacher details are availlable
  const teacherdata = await AppDataSource.getRepository(
    Teacherdetails
  ).findOneBy({ user_id: tokenResponse.userid! });
  if (!teacherdata?.bio) {
    profile_score -= 10;
  }

  if (!teacherdata?.extra_info) {
    profile_score -= 10;
  }

  if (!teacherdata?.subjects) {
    profile_score -= 10;
  }

  if (!teacherdata?.certificates) {
    profile_score -= 20;
  }

  if (!teacherdata?.location) {
    profile_score -= 10;
  }

  if (!teacherdata?.school) {
    profile_score -= 10;
  }

  res.json({
    proceed: true,
    score: profile_score,
  });
  return;
};

export const isPremium = async (req:Request,res:Response) =>{
  const {message,proceed,userid} = await validateAuthToken(req.headers.authorization);
  if(!proceed){
    res.json({
      proceed,
      premium:false
    });
    return
  }

  const teacher_data = await AppDataSource.getRepository(Teacherdetails).findOneBy({user_id:userid!});
  if(!teacher_data){
    res.json({
      proceed:false,
      premium:false
    });
    return;
  }

  res.json({
    proceed:true,
    premium:teacher_data.premium
  });
  return;
}
