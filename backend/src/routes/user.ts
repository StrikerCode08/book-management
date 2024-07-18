import { Router, Request, Response } from "express";
import { User } from "../models/User";
import jwt from "jsonwebtoken";
import authenticateToken from "../middleware/userAuth";
import { Book } from "../models/Book";
import { authenticateAdmin } from "../middleware/adminAuth";
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
router.post("/borrow", authenticateToken, async (req: Request, res: Response) => {
    const { userId, bookId } = req.body;
    try {
      const user = await User.findById(userId);
      const book = await Book.findById(bookId);
      if (!user || !book) {
        throw new Error("User or Book not found");
      }
      if (!book.available) {
        throw new Error("Book is not available");
      }
      book.available = false;
      user.borrowedBooks.push(book._id);
      await book.save();
      await user.save();
      res.status(200).send("Book borrowed successfully");
    } catch (error) {
      res.status(400).send(error);
    }
  }
);
router.post('/return', authenticateToken, async (req: Request, res: Response) => {
    const { userId, bookId } = req.body;
    try {
        const user = await User.findById(userId);
    const book = await Book.findById(bookId);

    if (!user || !book) {
        throw new Error('User or Book not found');
    }

    book.available = true;
    user.borrowedBooks = user.borrowedBooks.filter(id => !id.equals(book._id));

    await book.save();
    await user.save();
        res.status(200).send('Book returned successfully');
    } catch (error) {
        res.status(400).send(error);
    }
});
router.post("/add", authenticateToken, authenticateAdmin, async (req: Request, res: Response) => {
  const { title, author, genre } = req.body;
  try {
    const newBook = new Book({ title, author, genre });
    await newBook.save();
    res.status(201).send(newBook);
  } catch (error) {
    res.status(400).send(error);
  }
});
router.put("/update/:id", authenticateToken, authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, author, genre } = req.body;
    try {
      const book = await Book.findByIdAndUpdate(
        id,
        { title, author, genre },
        { new: true }
      );
      if (!book) {
        return res.status(404).send("Book not found.");
      }
      res.send(book);
    } catch (error) {
      res.status(400).send(error);
    }
  }
);
router.delete("/delete/:id", authenticateToken, authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const book = await Book.findByIdAndDelete(id);
      if (!book) {
        return res.status(404).send("Book not found.");
      }
      res.send("Book deleted.");
    } catch (error) {
      res.status(400).send(error);
    }
  }
);
export default router;
