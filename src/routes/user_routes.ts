import express, { Request, Response } from "express";
import router from "./router";


/* this is a example route in the users directory of the program
 you can add many routes as possible */
router.get("/", (req: Request, res: Response) => {
    res.send("Hello World from Userroute!");
  });

  export default router;