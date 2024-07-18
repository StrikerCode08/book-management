import express, { Request, Response, NextFunction } from "express";
import user from "./routes/user";
import admin from "./routes/admin";
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/user", user);
app.use("/api/v1/admin", admin);

// Error Handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
