// src/routes/invoice.routes.js
const express = require("express");
const router = express.Router();
const { getInvoices, getInvoiceById, createInvoice, updateInvoiceStatus, deleteInvoice } = require("../controllers/invoice.controller");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");

router.use(authenticate);

router.get("/", getInvoices);
router.get("/:id", getInvoiceById);
router.post("/", authorizeRoles("ADMIN", "MANAGER"), createInvoice);
router.patch("/:id/status", authorizeRoles("ADMIN", "MANAGER"), updateInvoiceStatus);
router.delete("/:id", authorizeRoles("ADMIN"), deleteInvoice);

module.exports = router;
