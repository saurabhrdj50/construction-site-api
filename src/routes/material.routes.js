// src/routes/material.routes.js
const express = require("express");
const router = express.Router();
const { getMaterials, getMaterialById, createMaterial, updateMaterial, deleteMaterial } = require("../controllers/material.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getMaterials);
router.get("/:id", getMaterialById);
router.post("/", createMaterial);
router.put("/:id", authorizeRoles("ADMIN", "MANAGER"), updateMaterial);
router.delete("/:id", authorizeRoles("ADMIN"), deleteMaterial);

module.exports = router;
