// src/controllers/material.controller.js
const prisma = require("../config/db");

const getMaterials = async (req, res) => {
  try {
    const { projectId, status } = req.query;

    const where = {};
    if (projectId) where.projectId = Number(projectId);
    if (status) where.status = status;

    const materials = await prisma.material.findMany({
      where,
      include: { project: { select: { id: true, name: true } } },
      orderBy: { requestedAt: "desc" },
    });

    res.json({ success: true, data: materials });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await prisma.material.findUnique({
      where: { id: Number(req.params.id) },
      include: { project: { select: { id: true, name: true } } },
    });

    if (!material) return res.status(404).json({ success: false, message: "Material not found" });
    res.json({ success: true, data: material });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createMaterial = async (req, res) => {
  try {
    const { projectId, name, unit, quantity, unitCost } = req.body;

    if (!projectId || !name || !unit || !quantity || !unitCost) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const material = await prisma.material.create({
      data: { projectId: Number(projectId), name, unit, quantity, unitCost },
    });

    res.status(201).json({ success: true, message: "Material request created", data: material });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const material = await prisma.material.findUnique({ where: { id: Number(req.params.id) } });
    if (!material) return res.status(404).json({ success: false, message: "Material not found" });

    const updated = await prisma.material.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json({ success: true, message: "Material updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const material = await prisma.material.findUnique({ where: { id: Number(req.params.id) } });
    if (!material) return res.status(404).json({ success: false, message: "Material not found" });

    await prisma.material.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: "Material deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial };
