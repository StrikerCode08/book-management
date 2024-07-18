import express, { Request, Response, NextFunction } from "express";
import user from "./routes/user";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/user", user);

// Error Handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then(() => {
    app.listen(port, () => {
      console.log(`DB got Connected`);
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => console.error("Could not connect to MongoDB...", err));
