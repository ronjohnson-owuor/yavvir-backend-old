import cron from "node-cron";
import { AppDataSource } from "../data-source";
import { Emailcode } from "../entity/Emailcode";
import { LessThan } from "typeorm";

// executes every minute
export const everyminuteTask = cron.schedule(
  "* * * * *",
  () => {
    // retrieve all the pin from the database in typeorm
    deleteExpiredPin();
  },
  {
    scheduled: false,
  }
);

const deleteExpiredPin = async () => {
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
