// src/controllers/project.controller.js
const prisma = require("../config/db");

const getAllProjects = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const where = status ? { status } : {};

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        skip: Number(skip),
        take: Number(limit),
        include: {
          _count: { select: { members: true, dprs: true, invoices: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.project.count({ where }),
    ]);

    res.json({
      success: true,
      data: projects,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: Number(req.params.id) },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, role: true } } } },
        _count: { select: { dprs: true, materials: true, invoices: true } },
      },
    });

    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    res.json({ success: true, data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { name, description, location, startDate, endDate, budget } = req.body;

    if (!name || !location || !startDate || !budget) {
      return res.status(400).json({ success: false, message: "Name, location, startDate, and budget are required" });
    }

    const project = await prisma.project.create({
      data: { name, description, location, startDate: new Date(startDate), endDate: endDate ? new Date(endDate) : null, budget },
    });

    res.status(201).json({ success: true, message: "Project created successfully", data: project });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: Number(req.params.id) } });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const updated = await prisma.project.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json({ success: true, message: "Project updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: Number(req.params.id) } });
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    await prisma.project.delete({ where: { id: Number(req.params.id) } });

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const projectId = Number(req.params.id);

    const member = await prisma.projectMember.create({
      data: { projectId, userId, role },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    res.status(201).json({ success: true, message: "Member added", data: member });
  } catch (err) {
    if (err.code === "P2002") return res.status(409).json({ success: false, message: "User already a member" });
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getAllProjects, getProjectById, createProject, updateProject, deleteProject, addMember };
