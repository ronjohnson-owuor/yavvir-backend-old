import  express from "express";
import router from "./src/routes/router";
import { AppDataSource } from "./src/data-source";
import * as dotenv from 'dotenv';
import userRoutes from "./src/routes/user_routes";
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(router);
app.use("/api",userRoutes); // default routes for users
const PORT = process.env.APP_PORT;
AppDataSource.initialize().then(()=>{
    console.log("database connected successfully");
    app.listen(PORT,()=>{
        console.log(`server running at port http://localhost:${PORT}`);
    })    
}).catch((error)=>{
    console.error("DB_ERROR: "+ error);
});