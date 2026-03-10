# 🏗️ Construction Site Management API

A RESTful backend API built with **Node.js**, **Express**, **Prisma ORM**, and **MySQL** to manage construction site operations — including Projects, Daily Progress Reports (DPR), Attendance, Materials, and Invoicing.

---

## 📁 Project Structure

```
construction-site-api/
├── prisma/
│   └── schema.prisma          # Database schema & models
├── src/
│   ├── config/
│   │   └── db.js              # Prisma client instance
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── project.controller.js
│   │   ├── dpr.controller.js
│   │   ├── attendance.controller.js
│   │   ├── material.controller.js
│   │   └── invoice.controller.js
│   ├── middleware/
│   │   └── auth.middleware.js # JWT authentication & role authorization
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── project.routes.js
│   │   ├── dpr.routes.js
│   │   ├── attendance.routes.js
│   │   ├── material.routes.js
│   │   └── invoice.routes.js
│   ├── utils/
│   │   └── seed.js            # Database seeder
│   ├── app.js                 # Express app setup
│   └── index.js               # Entry point
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## ⚙️ Tech Stack

| Tech | Purpose |
|------|---------|
| Node.js + Express | Server & REST API |
| Prisma ORM | Database queries & migrations |
| MySQL | Relational database |
| JWT | Authentication |
| bcryptjs | Password hashing |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/construction-site-api.git
cd construction-site-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
```bash
cp .env.example .env
```
Edit `.env` and fill in:
```
DATABASE_URL="mysql://root:yourpassword@localhost:3306/construction_db"
JWT_SECRET="your_super_secret_key"
PORT=3000
```

### 4. Create the database
```sql
CREATE DATABASE construction_db;
```

### 5. Run Prisma migrations
```bash
npm run db:generate
npm run db:migrate
```

### 6. Seed dummy data (optional)
```bash
npm run db:seed
```

### 7. Start the server
```bash
npm run dev   # development (nodemon)
npm start     # production
```

Server runs at: `http://localhost:3000`

---

## 🔐 Auth Test Credentials (after seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@construction.com | Admin@123 |
| Manager | manager@construction.com | Manager@123 |
| Worker | worker@construction.com | Worker@123 |

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT token |
| GET | `/api/auth/profile` | Auth | Get current user profile |

### Projects
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/projects` | Auth | Get all projects (paginated) |
| GET | `/api/projects/:id` | Auth | Get project by ID |
| POST | `/api/projects` | Admin/Manager | Create project |
| PUT | `/api/projects/:id` | Admin/Manager | Update project |
| DELETE | `/api/projects/:id` | Admin | Delete project |
| POST | `/api/projects/:id/members` | Admin/Manager | Add member to project |

### Daily Progress Reports (DPR)
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dprs` | Auth | Get all DPRs (filter by project/date) |
| GET | `/api/dprs/:id` | Auth | Get DPR by ID |
| POST | `/api/dprs` | Auth | Submit DPR |
| PUT | `/api/dprs/:id` | Auth (owner) | Update DPR |
| DELETE | `/api/dprs/:id` | Admin | Delete DPR |

### Attendance
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/attendance` | Auth | Get attendance records |
| GET | `/api/attendance/summary` | Auth | Monthly summary by project |
| POST | `/api/attendance` | Admin/Manager | Mark attendance |

### Materials
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/materials` | Auth | Get all materials |
| GET | `/api/materials/:id` | Auth | Get material by ID |
| POST | `/api/materials` | Auth | Request material |
| PUT | `/api/materials/:id` | Admin/Manager | Update material |
| DELETE | `/api/materials/:id` | Admin | Delete material |

### Invoices
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/invoices` | Auth | Get all invoices |
| GET | `/api/invoices/:id` | Auth | Get invoice by ID |
| POST | `/api/invoices` | Admin/Manager | Create invoice |
| PATCH | `/api/invoices/:id/status` | Admin/Manager | Update invoice status |
| DELETE | `/api/invoices/:id` | Admin | Delete invoice |

---

## 🔑 Authorization Header
All protected routes require:
```
Authorization: Bearer <your_jwt_token>
```

---

## 📬 Sample Request — Login
```json
POST /api/auth/login
{
  "email": "admin@construction.com",
  "password": "Admin@123"
}
```

## 📬 Sample Request — Create Project
```json
POST /api/projects
Authorization: Bearer <token>
{
  "name": "Mumbai Skyline Tower",
  "location": "Andheri West, Mumbai",
  "startDate": "2026-01-01",
  "budget": 5000000,
  "description": "25-floor residential tower"
}
```

---

## 👨‍💻 Author
Built as a portfolio project to demonstrate backend development skills with Node.js, Express, Prisma ORM, MySQL, REST APIs, and JWT authentication.
