import { Request, Response } from "express";
import router from "./router";

router.get("/",(req:Request,res:Response)=>{
    res.send("<h1> 403 Forbidden Error</h1>");
    return;
});
export default router;