// src/controllers/attendance.controller.js
const prisma = require("../config/db");

const getAttendance = async (req, res) => {
  try {
    const { projectId, userId, date, status } = req.query;

    const where = {};
    if (projectId) where.projectId = Number(projectId);
    if (userId) where.userId = Number(userId);
    if (date) where.date = new Date(date);
    if (status) where.status = status;

    const records = await prisma.attendance.findMany({
      where,
      include: {
        user: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });

    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { projectId, userId, date, status, checkIn, checkOut } = req.body;

    if (!projectId || !userId || !date || !status) {
      return res.status(400).json({ success: false, message: "projectId, userId, date, and status are required" });
    }

    const attendance = await prisma.attendance.upsert({
      where: { projectId_userId_date: { projectId: Number(projectId), userId: Number(userId), date: new Date(date) } },
      update: { status, checkIn: checkIn ? new Date(checkIn) : null, checkOut: checkOut ? new Date(checkOut) : null },
      create: {
        projectId: Number(projectId),
        userId: Number(userId),
        date: new Date(date),
        status,
        checkIn: checkIn ? new Date(checkIn) : null,
        checkOut: checkOut ? new Date(checkOut) : null,
      },
    });

    res.status(201).json({ success: true, message: "Attendance marked", data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const { projectId, month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const summary = await prisma.attendance.groupBy({
      by: ["userId", "status"],
      where: {
        projectId: Number(projectId),
        date: { gte: startDate, lte: endDate },
      },
      _count: { status: true },
    });

    res.json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAttendance, markAttendance, getAttendanceSummary };
