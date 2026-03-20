<div align="center">

# SaaS Customer Manager

**Hệ thống SaaS quản lý khách hàng đa tổ chức – gửi SMS & Email tự động, triển khai trên AWS.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://docs.docker.com/compose/)
[![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazonaws&logoColor=white)](https://aws.amazon.com/)
[![SendGrid](https://img.shields.io/badge/SendGrid-Email-1A82E2?logo=twilio&logoColor=white)](https://sendgrid.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)

</div>

---

## Tính năng chính

| Tính năng | Mô tả |
|---|---|
| **Multi-tenant** | Nhiều tổ chức hoạt động độc lập, dữ liệu hoàn toàn cách ly |
| **Quản lý khách hàng** | CRUD: họ tên, địa chỉ, số điện thoại, email |
| **Gửi SMS** | Tích hợp SpeedSMS API |
| **Gửi Email** | Tích hợp SendGrid với webhook tracking |
| **Dashboard** | Thống kê tỷ lệ gửi thành công / thất bại |
| **Lịch sử tin nhắn** | Tra cứu trạng thái từng lần gửi |
| **Bảo mật** | JWT (2 bước: login → chọn tenant) + tenant isolation |

---

## Tech Stack

### Backend
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=flat-square)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white&style=flat-square)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=white&style=flat-square)](https://jwt.io/)

| Công nghệ | Vai trò |
|---|---|
| Node.js 20 | Runtime |
| Express | HTTP Framework |
| Prisma | ORM (Singleton pattern) |
| MySQL 8.0 | Cơ sở dữ liệu (AWS RDS) |
| JWT | Xác thực người dùng |
| SendGrid SDK | Gửi email |
| SpeedSMS API | Gửi SMS |

### Frontend
[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat-square)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white&style=flat-square)](https://vitejs.dev/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-0170FE?logo=antdesign&logoColor=white&style=flat-square)](https://ant.design/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white&style=flat-square)](https://axios-http.com/)

| Công nghệ | Vai trò |
|---|---|
| React 18 + Vite | UI Framework & build tool |
| React Router | Client-side routing |
| Ant Design (AntD) | Component library |
| Axios | HTTP client |
| Recharts | Biểu đồ dashboard |

### AWS Infrastructure
[![AWS ECS](https://img.shields.io/badge/ECS_Fargate-FF9900?logo=amazonaws&logoColor=white&style=flat-square)](https://aws.amazon.com/ecs/)
[![AWS S3](https://img.shields.io/badge/S3-569A31?logo=amazons3&logoColor=white&style=flat-square)](https://aws.amazon.com/s3/)
[![AWS RDS](https://img.shields.io/badge/RDS_MySQL-527FFF?logo=amazonrds&logoColor=white&style=flat-square)](https://aws.amazon.com/rds/)
[![AWS CloudFront](https://img.shields.io/badge/CloudFront-8C4FFF?logo=amazonaws&logoColor=white&style=flat-square)](https://aws.amazon.com/cloudfront/)

| Service | Mục đích |
|---|---|
| ECS Fargate | Chạy backend Docker container |
| S3 + CloudFront | Host frontend tĩnh + CDN |
| RDS MySQL | Cơ sở dữ liệu quan hệ |
| Application Load Balancer | Cân bằng tải + HTTPS |
| Certificate Manager (ACM) | SSL/TLS tự động |
| CloudWatch | Logging & monitoring |

---

## Cấu trúc dự án

```text
SaaS-customer-manager/
├── backend/                # Node.js + Express + Prisma
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Auth, validation, tenant isolation
│   │   ├── validators/     # Joi schemas
│   │   └── app.js          # Express app setup
│   ├── prisma/             # Database schema & migrations
│   ├── __tests__/          # Jest unit tests
│   └── Dockerfile
├── frontend/               # React + Vite + AntD
│   ├── src/
│   │   ├── pages/          # Route pages (Dashboard, Customers, Messages…)
│   │   ├── components/     # Reusable UI components
│   │   └── services/       # Axios API calls
│   └── Dockerfile
├── docs/                   # Project documentation
├── docker-compose.yml      # Local development stack
└── README.md
```

---

## Chạy Local (Development)

> **Yêu cầu:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (khuyến nghị) hoặc Node.js 20+ & MySQL 8.0

### Cách 1 – Docker Compose (Nhanh nhất)

```bash
# 1. Clone repo
git clone https://github.com/Sura3607/SaaS-customer-manager.git
cd SaaS-customer-manager

# 2. Tạo file .env cho backend
cp backend/.env.example backend/.env
# Mở backend/.env và điền SENDGRID_API_KEY, JWT_SECRET (tối thiểu 32 ký tự), v.v.

# 3. Tạo file .env cho frontend
cp frontend/.env.example frontend/.env

# 4. Khởi động toàn bộ stack (MySQL + Backend + Frontend)
docker compose up --build

# Dừng khi xong
docker compose down
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000/api/v1 |
| MySQL | localhost:3306 |

---

### Cách 2 – Chạy thủ công (Manual)

#### Bước 1 – Khởi động MySQL

Đảm bảo MySQL 8.0 đang chạy cục bộ hoặc dùng Docker:

```bash
docker run -d \
  --name saas-mysql \
  -e MYSQL_ROOT_PASSWORD=rootpassword123 \
  -e MYSQL_DATABASE=saas_db \
  -e MYSQL_USER=saas_user \
  -e MYSQL_PASSWORD=saas_password123 \
  -p 3306:3306 \
  mysql:8.0
```

#### Bước 2 – Backend

```bash
cd backend

# Cài dependencies
npm install

# Cấu hình môi trường
cp .env.example .env
# Chỉnh sửa .env: DATABASE_URL, JWT_SECRET, SENDGRID_API_KEY, SPEEDSMS_API_TOKEN

# Tạo database schema & seed dữ liệu mẫu
npx prisma db push
npx prisma db seed       # (nếu có seed)

# Khởi động server
npm run dev              # Chạy với nodemon (hot-reload)
# hoặc
npm start                # Chạy production mode
```

> Backend chạy tại: **http://localhost:5000**

#### Bước 3 – Frontend

```bash
cd frontend

# Cài dependencies
npm install

# Cấu hình môi trường
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:5000/api/v1 (mặc định)

# Khởi động dev server
npm run dev
```

> Frontend chạy tại: **http://localhost:5173**

#### Bước 4 – Build Frontend (Production)

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

---

## Biến môi trường quan trọng

### Backend (`backend/.env`)

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `DATABASE_URL` | Kết nối MySQL | `mysql://saas_user:pass@localhost:3306/saas_db` |
| `JWT_SECRET` | Secret key JWT (≥ 32 ký tự) | `my-super-secret-key-minimum-32chars` |
| `SENDGRID_API_KEY` | API key SendGrid | `SG.xxxxxxxx` |
| `SPEEDSMS_API_TOKEN` | Token SpeedSMS | `your_token_here` |
| `PORT` | Cổng backend | `5000` |

### Frontend (`frontend/.env`)

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL của backend API | `http://localhost:5000/api/v1` |

---

## Chạy Tests

```bash
# Backend tests (Jest)
cd backend
npm test

# Frontend tests (Jest + Testing Library)
cd frontend
npm test
```

---

## Tài liệu

- [API Endpoints](docs/endpoints.md) – Danh sách đầy đủ các endpoint
- [Project Structure](docs/project-structure.md) – Chi tiết cấu trúc thư mục
- [Deployment Guide](docs/plan.md) – Hướng dẫn triển khai AWS
- [API Security Audit](docs/API_SECURITY_AUDIT.md) – Báo cáo bảo mật
- [UI Usage Guide](docs/UI-USAGE-GUIDE.md) – Hướng dẫn sử dụng giao diện

---

## Đóng góp

1. Fork repository
2. Tạo nhánh mới: `git checkout -b feature/ten-tinh-nang`
3. Commit thay đổi: `git commit -m 'feat: thêm tính năng X'`
4. Push lên nhánh: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request trên [![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=flat-square)](https://github.com/Sura3607/SaaS-customer-manager)

---

## License

Dự án này được phân phối theo giấy phép **MIT**. Xem file [LICENSE](./LICENSE) để biết thêm chi tiết.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

<div align="center">
  Made with love using
  <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=flat-square" alt="Node.js"/>
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=flat-square" alt="React"/>
  <img src="https://img.shields.io/badge/AWS-FF9900?logo=amazonaws&logoColor=white&style=flat-square" alt="AWS"/>
</div>
