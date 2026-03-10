// src/routes/attendance.routes.js
const express = require("express");
const router = express.Router();
const { getAttendance, markAttendance, getAttendanceSummary } = require("../controllers/attendance.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getAttendance);
router.get("/summary", getAttendanceSummary);
router.post("/", authorizeRoles("ADMIN", "MANAGER"), markAttendance);

module.exports = router;
