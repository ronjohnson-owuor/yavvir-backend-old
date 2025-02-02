import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import validateAuthToken from "./validateAuthtoken";
import { AppDataSource } from "../data-source";
import { Certificates } from "../entity/Certificates";
import { Teacherdetails } from "../entity/Teacherdetails";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_KEY!,
    accessKeyId: process.env.AWS_ACCESS_KEY!,
  },
});

export const uploadData = async (req: Request, res: Response) => {
  const requestresponse = await validateAuthToken(req.headers.authorization);
  if (!requestresponse.proceed) {
    res.json({
      message: requestresponse.message,
      proceed: false,
    });
    return;
  }

  if (!req.files?.data) {
    res.json({
      message: "you have not selected any files for upload",
      proceed: false,
    });
    return;
  }

  const filedata = req.files?.data as UploadedFile;
  let filemime = filedata.mimetype;

  const imageMimes = ["image/png", "image/jpeg"];
  const fileMime = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  let folder = "";

  if (imageMimes.includes(filemime)) {
    folder = "images/";
  } else if (fileMime.includes(filemime)) {
    folder = "files/";
  } else {
    res.json({
      message:
        "that file is not supported,please upload a .png or .jpeg or a .pdf or a word document",
      proceed: false,
    });
    return;
  }

  const fileKey = `${folder}${Date.now()}_${filedata.name}`;
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileKey,
        Body: filedata.data,
        ACL: "public-read",
      })
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${fileKey}`;

    const userId = requestresponse.userid;
    await AppDataSource.getRepository(Certificates).insert({
      userid: userId!,
      certificate_path: fileUrl,
    });

    const certificate_number = await AppDataSource.getRepository(
      Certificates
    ).count({
      where: { userid: userId! },
    });
    await AppDataSource.createQueryBuilder()
      .update(Teacherdetails)
      .set({ certificates: certificate_number })
      .where("user_id = :id", { id: userId })
      .execute();

    res.json({
      message: "file successfully uploaded",
      proceed: true,
      fileUrl,
    });
  } catch (error) {
    res.json({
      message: "there was an error while uploading files" + error,
      proceed: false,
    });
  }
};
