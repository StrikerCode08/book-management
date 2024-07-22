"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../models/User");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userAuth_1 = __importDefault(require("../middleware/userAuth"));
const Book_1 = require("../models/Book");
const adminAuth_1 = require("../middleware/adminAuth");
const User_2 = require("../models/User");
const router = (0, express_1.Router)();
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, userName, password } = req.body;
    try {
        const userExists = yield User_1.User.findOne({ userName });
        if (userExists) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        const user = new User_1.User({ name, userName, password });
        if (user) {
            yield user.save();
            res.status(201).json({
                _id: user._id,
                name: user.name,
                userName: user.userName,
                token: user.generateToken(user._id),
                role: User_2.Role.User
            });
        }
        else {
            res.status(400).json({ message: "Invalid user data" });
        }
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    try {
        const user = yield User_1.User.findOne({ userName });
        if (!user || !(yield user.matchPassword(password))) {
            throw new Error("Invalid email or password");
        }
        const token = jsonwebtoken_1.default.sign({ user: user.role }, `${process.env.JWT_SECRET}`, {
            expiresIn: "1h",
        });
        res.status(200).send({
            _id: user._id,
            name: user.name,
            userName: user.userName,
            token: token,
            role: user.role
        });
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.post("/borrow", userAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, bookId } = req.body;
    try {
        const user = yield User_1.User.findById(userId);
        const book = yield Book_1.Book.findById(bookId);
        if (!user || !book) {
            throw new Error("User or Book not found");
        }
        if (!book.available) {
            throw new Error("Book is not available");
        }
        book.available = false;
        user.borrowedBooks.push(book._id);
        yield book.save();
        yield user.save();
        res.status(200).send("Book borrowed successfully");
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.post('/return', userAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, bookId } = req.body;
    try {
        const user = yield User_1.User.findById(userId);
        const book = yield Book_1.Book.findById(bookId);
        if (!user || !book) {
            throw new Error('User or Book not found');
        }
        book.available = true;
        user.borrowedBooks = user.borrowedBooks.filter(id => !id.equals(book._id));
        yield book.save();
        yield user.save();
        res.status(200).send('Book returned successfully');
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.post("/add", userAuth_1.default, adminAuth_1.authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, author, available } = req.body;
    try {
        const newBook = new Book_1.Book({ title, author, available: available || false });
        yield newBook.save();
        res.status(201).send(newBook);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.put("/update/:id", userAuth_1.default, adminAuth_1.authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, author, genre } = req.body;
    try {
        const book = yield Book_1.Book.findByIdAndUpdate(id, { title, author, genre }, { new: true });
        if (!book) {
            return res.status(404).send("Book not found.");
        }
        res.send(book);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.delete("/delete/:id", userAuth_1.default, adminAuth_1.authenticateAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const book = yield Book_1.Book.findByIdAndDelete(id);
        if (!book) {
            return res.status(404).send("Book not found.");
        }
        res.send("Book deleted.");
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
router.get('/books/available', userAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.query.userId;
        // If userId is provided, find the user and get their borrowed books
        if (userId) {
            const user = yield User_1.User.findById(userId).populate('borrowedBooks');
            if (!user) {
                return res.status(404).send({ error: 'User not found' });
            }
            const borrowedBookIds = user.borrowedBooks.map(book => book._id);
            const books = yield Book_1.Book.find({ _id: { $in: borrowedBookIds }, available: true });
            return res.status(200).send(books);
        }
        // If no userId is provided, return all available books
        const books = yield Book_1.Book.find({ available: true });
        res.status(200).send(books);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
// Route to get books borrowed by the authenticated user
router.get('/books/borrowed/:user_id', userAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id } = req.params;
    try {
        const user = yield User_1.User.findById(user_id).populate('borrowedBooks');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).send(user.borrowedBooks);
    }
    catch (error) {
        res.status(400).send(error);
    }
}));
exports.default = router;
