import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";

//configure env
dotenv.config();

//connect database config
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes

app.use("/worko/user", authRoutes);

//rest api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to Worko.ai</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, () => {
  console.log(
    `server is running on ${process.env.dot_env} mode on port ${PORT}`.bgCyan
      .white
  );
});

export default app;
