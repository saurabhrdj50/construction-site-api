// src/routes/project.routes.js
const express = require("express");
const router = express.Router();
const { getAllProjects, getProjectById, createProject, updateProject, deleteProject, addMember } = require("../controllers/project.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getAllProjects);
router.get("/:id", getProjectById);
router.post("/", authorizeRoles("ADMIN", "MANAGER"), createProject);
router.put("/:id", authorizeRoles("ADMIN", "MANAGER"), updateProject);
router.delete("/:id", authorizeRoles("ADMIN"), deleteProject);
router.post("/:id/members", authorizeRoles("ADMIN", "MANAGER"), addMember);

module.exports = router;
