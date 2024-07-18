"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = authenticateAdmin;
var Role;
(function (Role) {
    Role["User"] = "user";
    Role["Admin"] = "admin";
})(Role || (Role = {}));
function authenticateAdmin(req, res, next) {
    if (req.user && req.user.role === Role.Admin) {
        next();
    }
    else {
        res.status(403).send('Access denied. Admins only.');
    }
}
