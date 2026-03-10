// src/utils/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@construction.com" },
    update: {},
    create: { name: "Admin User", email: "admin@construction.com", password: adminPassword, role: "ADMIN" },
  });

  const manager = await prisma.user.upsert({
    where: { email: "manager@construction.com" },
    update: {},
    create: { name: "Site Manager", email: "manager@construction.com", password: await bcrypt.hash("Manager@123", 10), role: "MANAGER" },
  });

  const worker = await prisma.user.upsert({
    where: { email: "worker@construction.com" },
    update: {},
    create: { name: "John Worker", email: "worker@construction.com", password: await bcrypt.hash("Worker@123", 10), role: "WORKER" },
  });

  // Create a project
  const project = await prisma.project.create({
    data: {
      name: "Mumbai Skyline Tower",
      description: "25-floor residential tower in Andheri West",
      location: "Andheri West, Mumbai",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2027-06-30"),
      budget: 5000000.00,
      status: "ONGOING",
    },
  });

  // Add members
  await prisma.projectMember.createMany({
    data: [
      { projectId: project.id, userId: admin.id, role: "Project Owner" },
      { projectId: project.id, userId: manager.id, role: "Site Manager" },
      { projectId: project.id, userId: worker.id, role: "Civil Worker" },
    ],
    skipDuplicates: true,
  });

  // Create DPR
  await prisma.dPR.create({
    data: {
      projectId: project.id,
      submittedBy: manager.id,
      date: new Date(),
      workDone: "Completed foundation work on Block B. Poured 50 cubic meters of concrete.",
      issues: "Minor delay due to cement delivery",
      nextPlan: "Start Column work for Floor 1",
      weatherCond: "Sunny",
    },
  });

  // Create attendance
  await prisma.attendance.createMany({
    data: [
      { projectId: project.id, userId: manager.id, date: new Date(), status: "PRESENT", checkIn: new Date() },
      { projectId: project.id, userId: worker.id, date: new Date(), status: "PRESENT", checkIn: new Date() },
    ],
    skipDuplicates: true,
  });

  // Create materials
  await prisma.material.createMany({
    data: [
      { projectId: project.id, name: "Cement (50kg bag)", unit: "bags", quantity: 500, unitCost: 380, status: "IN_STOCK" },
      { projectId: project.id, name: "Steel Rebar (12mm)", unit: "kg", quantity: 2000, unitCost: 65, status: "APPROVED" },
      { projectId: project.id, name: "River Sand", unit: "cubic meters", quantity: 100, unitCost: 1200, status: "REQUESTED" },
    ],
  });

  // Create invoice
  await prisma.invoice.create({
    data: {
      projectId: project.id,
      invoiceNo: "INV-000001",
      amount: 250000,
      tax: 18,
      totalAmount: 295000,
      dueDate: new Date("2026-04-01"),
      description: "Q1 2026 - Foundation and groundwork charges",
      status: "PENDING",
    },
  });

  console.log("✅ Seeding complete!");
  console.log("\nTest Credentials:");
  console.log("Admin:   admin@construction.com   / Admin@123");
  console.log("Manager: manager@construction.com / Manager@123");
  console.log("Worker:  worker@construction.com  / Worker@123");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
