// src/routes/dpr.routes.js
const express = require("express");
const router = express.Router();
const { getAllDPRs, getDPRById, createDPR, updateDPR, deleteDPR } = require("../controllers/dpr.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getAllDPRs);
router.get("/:id", getDPRById);
router.post("/", createDPR);
router.put("/:id", updateDPR);
router.delete("/:id", authorizeRoles("ADMIN"), deleteDPR);

module.exports = router;
