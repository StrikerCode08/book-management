import { Router, Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { name, userName, password } = req.body;

  try {
    const userExists = await User.findOne({ userName });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const user = new User({ name, userName, password });

    if (user) {
      await user.save();
      res.status(201).json({
        _id: user._id,
        name: user.name,
        userName: user.userName,
        token: user.generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(400).send(error);
  }
});
router.post("/login", async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user || !(await user.matchPassword(password))) {
      throw new Error("Invalid email or password");
    }
    const token = jwt.sign({ id: user._id }, `${process.env.JWT_SECRET}`, {
      expiresIn: "1h",
    });
    res.status(200).send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});
export default router;
