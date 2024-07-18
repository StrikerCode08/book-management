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
        const token = jsonwebtoken_1.default.sign({ id: user._id }, `${process.env.JWT_SECRET}`, {
            expiresIn: "1h",
        });
        res.status(200).send({ token });
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
exports.default = router;
