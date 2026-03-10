// src/app.js
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const dprRoutes = require("./routes/dpr.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const materialRoutes = require("./routes/material.routes");
const invoiceRoutes = require("./routes/invoice.routes");

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Construction Site Management API",
    version: "1.0.0",
    status: "running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/dprs", dprRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/invoices", invoiceRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
