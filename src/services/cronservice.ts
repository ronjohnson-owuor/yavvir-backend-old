import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Emailcode } from "../entity/Emailcode";
import { LessThan } from "typeorm";
import { Lesson } from "../entity/Lesson";

// executes every minute
export const everyminuteTask = cron.schedule(
  "* * * * *",
  () => {
    // retrieve all the pin from the database in typeorm
    deleteExpiredPin();
    deleteExpiredLessons();
  },
  {
    scheduled: false,
  }
);

const deleteExpiredPin = async () => {
  console.log("called");
  const pinRepository = AppDataSource.getRepository(Emailcode);
  const expirationTime = 30 * 60 * 1000;
  const cutoffDate = new Date(Date.now() - expirationTime);
  try {
    const result = await pinRepository.delete({
      createdAt: LessThan(cutoffDate),
    });
    if (result.affected && result.affected > 0) {
      console.log(`${result.affected} pin/s are deleted from the database`);
    }
    return;
  } catch (error) {
    console.log("there was an error in deletion of pins");
  }
};

const deleteExpiredLessons = async () => {
  try {
    let date = new Date(Date.now());
    const expiredLessons = await AppDataSource.getRepository(Lesson).update(
      { start_time: LessThan(date) },
      { expired: true }
    );
    if (expiredLessons.affected && expiredLessons.affected > 0) {
      console.log("expired lessons are deleted");
      return;
    }
  } catch (err) {
    console.log("Error deleting the lessons");
  }
};
