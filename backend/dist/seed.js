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
// src/seed.ts
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("./models/User");
dotenv_1.default.config();
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to the database
        yield mongoose_1.default.connect(process.env.MONGODB_URL);
        // Check if admin user already exists
        const adminUser = yield User_1.User.findOne({ role: User_1.Role.Admin });
        if (!adminUser) {
            // Create admin user
            const newAdmin = new User_1.User({
                userName: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD,
                name: process.env.ADMIN_NAME,
                role: User_1.Role.Admin,
            });
            yield newAdmin.save();
            console.log('Admin user created.');
        }
        else {
            console.log('Admin user already exists.');
        }
        // Close the connection
        yield mongoose_1.default.connection.close();
    }
    catch (error) {
        console.error('Error seeding database:', error);
    }
});
seedDB();
