# SaaS Customer Manager - Cloud Computing Project

Hệ thống SaaS quản lý liên hệ khách hàng và gửi SMS/Email qua Twilio & SendGrid, triển khai trên AWS.

## Tính năng chính

- ✅ Multi-tenant (nhiều tổ chức độc lập)
- ✅ CRUD khách hàng (Họ tên, Địa chỉ, SĐT, Email)
- ✅ Gửi SMS qua Twilio
- ✅ Gửi Email qua SendGrid
- ✅ Lịch sử gửi tin nhắn
- ✅ Dashboard thống kê
- ✅ Bảo mật JWT + tenant isolation

## Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express
- **ORM:** Prisma (Singleton pattern)
- **Database:** MySQL (AWS RDS)
- **SMS:** Twilio SDK
- **Email:** SendGrid SDK
- **Auth:** JWT

### Frontend

- **Framework:** React + Vite
- **Routing:** React Router
- **UI Library:** Ant Design (AntD)
- **HTTP Client:** Axios

### AWS Services

- **Compute:** ECS Fargate (backend Docker)
- **Storage:** S3 + CloudFront (frontend static)
- **Database:** RDS MySQL
- **Monitoring:** CloudWatch
- **Load Balancer:** Application Load Balancer
- **SSL/TLS:** AWS Certificate Manager

## Cấu trúc dự án

```text
SaaS-customer-manager/
├── backend/          # Node.js + Express + Prisma
├── frontend/         # React + Vite + AntD
├── infra/           # AWS architecture, Docker configs
├── docs/            # Documentation
└── plan.md          # Kế hoạch chi tiết
```

## Tài liệu chi tiết

- [Kế hoạch dự án (plan.md)](plan.md) - Phân tích yêu cầu, các giai đoạn, checklist
- [API Endpoints (endpoints.md)](endpoints.md) - Danh sách đầy đủ các endpoint
- [Cấu trúc dự án (project-structure.md)](project-structure.md) - Folder structure, tech notes

## Quick Start (Development)

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Cấu hình .env: DATABASE_URL, TWILIO_*, SENDGRID_*
npx prisma migrate dev
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm install recharts
npm run dev
```

### Docker (Local)

```bash
docker-compose up
```

## Deployment

Xem chi tiết trong [docs/deployment.md](docs/deployment.md)

## License

MIT License
