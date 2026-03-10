// src/controllers/dpr.controller.js
const prisma = require("../config/db");

const getAllDPRs = async (req, res) => {
  try {
    const { projectId, date } = req.query;

    const where = {};
    if (projectId) where.projectId = Number(projectId);
    if (date) where.date = new Date(date);

    const dprs = await prisma.dPR.findMany({
      where,
      include: {
        project: { select: { id: true, name: true } },
        submitter: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
    });

    res.json({ success: true, data: dprs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getDPRById = async (req, res) => {
  try {
    const dpr = await prisma.dPR.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        project: { select: { id: true, name: true } },
        submitter: { select: { id: true, name: true } },
      },
    });

    if (!dpr) return res.status(404).json({ success: false, message: "DPR not found" });
    res.json({ success: true, data: dpr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createDPR = async (req, res) => {
  try {
    const { projectId, date, workDone, issues, nextPlan, weatherCond } = req.body;

    if (!projectId || !date || !workDone) {
      return res.status(400).json({ success: false, message: "projectId, date, and workDone are required" });
    }

    const dpr = await prisma.dPR.create({
      data: {
        projectId: Number(projectId),
        submittedBy: req.user.id,
        date: new Date(date),
        workDone,
        issues,
        nextPlan,
        weatherCond,
      },
    });

    res.status(201).json({ success: true, message: "DPR submitted successfully", data: dpr });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateDPR = async (req, res) => {
  try {
    const dpr = await prisma.dPR.findUnique({ where: { id: Number(req.params.id) } });
    if (!dpr) return res.status(404).json({ success: false, message: "DPR not found" });

    if (dpr.submittedBy !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ success: false, message: "Not authorized to edit this DPR" });
    }

    const updated = await prisma.dPR.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json({ success: true, message: "DPR updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteDPR = async (req, res) => {
  try {
    const dpr = await prisma.dPR.findUnique({ where: { id: Number(req.params.id) } });
    if (!dpr) return res.status(404).json({ success: false, message: "DPR not found" });

    await prisma.dPR.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: "DPR deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllDPRs, getDPRById, createDPR, updateDPR, deleteDPR };
