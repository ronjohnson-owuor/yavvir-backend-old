import  express from "express";
import router from "./src/routes/router";
import { AppDataSource } from "./src/data-source";
import * as dotenv from 'dotenv';
import userRoutes from "./src/routes/user_routes";
import defaultRoute from "./src/routes/default";
import teacherRoutes from './src/routes/teacher_routes'
import paymentRoutes from './src/routes/payment_route';
import cors from "cors";
import { everyminuteTask } from "./src/services/cronservice";
import fileUpload from "express-fileupload";
dotenv.config();

const app = express();
app.use(fileUpload());
app.use(cors());
app.use(express.json());
app.use(router);
app.use("/api",userRoutes); // default routes for users
app.use("/",defaultRoute);
app.use("/api/teacher-api",teacherRoutes);
app.use("/api/payment-api",paymentRoutes);
const PORT = process.env.APP_PORT;
AppDataSource.initialize().then(()=>{
    console.log("database connected successfully");
    // every minute cron-task
    everyminuteTask.start();
    app.listen(PORT,()=>{
        console.log(`server running at port http://localhost:${PORT}`);
    })    
}).catch((error)=>{
    console.error("DB_ERROR: "+ error);
});