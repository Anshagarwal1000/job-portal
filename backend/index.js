import express from "express"
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.routes.js"
import companyRoutes from "./routes/company.routes.js"
import jobRoutes from "./routes/job.routes.js"
import applicationRoutes from "./routes/application.routes.js"
dotenv.config({});
const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions={
    origin:"http://localhost:5173", ///check for react url here
    credentials:true
}
app.use(cors(corsOptions)); 
const PORT=process.env.PORT ;
connectDB()
app.listen(PORT, "127.0.0.1", () => {
  

  console.log("Listening on", PORT, "PID:", process.pid);
});


app.use("/api/v1/user",userRoutes);
app.use("/api/v1/company",companyRoutes);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/application",applicationRoutes)



app.get("/", (req, res) => {
  res.status(200).send("API is running in th eprevious one ");
});


