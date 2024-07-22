"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = authenticateAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var Role;
(function (Role) {
    Role["User"] = "user";
    Role["Admin"] = "admin";
})(Role || (Role = {}));
function authenticateAdmin(req, res, next) {
    var _a;
    const token = ((_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '')) || "";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, `${process.env.JWT_SECRET}`);
        if (decoded.user === Role.Admin) {
            next();
        }
    }
    catch (ex) {
        res.status(400).send('Invalid token.');
    }
}
