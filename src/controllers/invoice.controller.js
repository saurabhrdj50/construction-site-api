// src/controllers/invoice.controller.js
const prisma = require("../config/db");

const generateInvoiceNo = () => {
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${timestamp}`;
};

const getInvoices = async (req, res) => {
  try {
    const { projectId, status } = req.query;

    const where = {};
    if (projectId) where.projectId = Number(projectId);
    if (status) where.status = status;

    const invoices = await prisma.invoice.findMany({
      where,
      include: { project: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: invoices });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: Number(req.params.id) },
      include: { project: true },
    });

    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });
    res.json({ success: true, data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const { projectId, amount, tax = 0, dueDate, description } = req.body;

    if (!projectId || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: "projectId, amount, and dueDate are required" });
    }

    const taxAmount = (Number(amount) * Number(tax)) / 100;
    const totalAmount = Number(amount) + taxAmount;

    const invoice = await prisma.invoice.create({
      data: {
        projectId: Number(projectId),
        invoiceNo: generateInvoiceNo(),
        amount,
        tax,
        totalAmount,
        dueDate: new Date(dueDate),
        description,
      },
    });

    res.status(201).json({ success: true, message: "Invoice created", data: invoice });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateInvoiceStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await prisma.invoice.findUnique({ where: { id: Number(req.params.id) } });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    const updated = await prisma.invoice.update({
      where: { id: Number(req.params.id) },
      data: { status, paidAt: status === "PAID" ? new Date() : null },
    });

    res.json({ success: true, message: "Invoice status updated", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await prisma.invoice.findUnique({ where: { id: Number(req.params.id) } });
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found" });

    await prisma.invoice.delete({ where: { id: Number(req.params.id) } });
    res.json({ success: true, message: "Invoice deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getInvoices, getInvoiceById, createInvoice, updateInvoiceStatus, deleteInvoice };
