"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/signup', (req, res) => {
    res.json({ "message": "" });
});
exports.default = router;
