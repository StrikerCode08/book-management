import { Router, Request, Response } from "express";
import { User } from "../models/User";
const router = Router();

router.post('/signup',async (req:Request,res:Response)=>{
    const { name, userName, password } = req.body;

    const userExists = await User.findOne({ userName });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
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
        res.status(400).json({ message: 'Invalid user data' });
    }
})
export default router;
