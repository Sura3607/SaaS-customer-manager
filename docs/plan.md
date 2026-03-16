# Kế hoạch dự án (UI → APP)

## 1) Phân tích yêu cầu & phạm vi

**Mục tiêu:** SaaS quản lý liên hệ khách hàng và gửi SMS/Email qua dịch vụ ngoài, chạy trên AWS.

### Tính năng bắt buộc

- CRUD khách hàng (Họ tên, Địa chỉ, SĐT, Email).
- UI web thân thiện.
- Gửi SMS/Email cho 1 hoặc nhiều khách hàng.
- Tích hợp ít nhất 1 dịch vụ SMS hoặc Email (Twilio/AWS SNS/SES/SendGrid...).
- Triển khai SaaS trên AWS, có URL public, bảo mật cơ bản, có monitoring.

**Xác nhận yêu cầu:**

- Hệ thống **multi-tenant** (nhiều tổ chức/công ty độc lập).
- Mỗi tenant có tài khoản admin riêng, quản lý khách hàng riêng.
- **Email:** SendGrid.
- **SMS:** Twilio.
- **UI Library:** Ant Design (AntD).
- **ORM:** Prisma với pattern Singleton để tránh tràn RAM.

## 2) Luồng UI chính

1. **Tenant Registration** → Đăng ký tenant mới (tổ chức).
2. **Login** → Xác thực người dùng theo tenant.
3. **Dashboard** → Tổng quan số khách hàng, số tin nhắn gửi của tenant.
4. **Customers**
   - Danh sách, tìm kiếm, lọc (theo tenant).
   - Tạo/Sửa/Xóa.
   - Xem chi tiết, lịch sử liên lạc.
   - Chọn nhiều khách hàng để gửi.
5. **Messaging**
   - Chọn kênh: SMS (Twilio) / Email (SendGrid).
   - Soạn nội dung, xem trước.
   - Gửi đơn lẻ hoặc hàng loạt.
6. **Logs**
   - Lịch sử gửi SMS/Email, trạng thái thành công/thất bại.
7. **Settings**
   - Thông tin tenant, API credentials (nếu tenant tự quản lý keys).

## 3) Kế hoạch triển khai theo giai đoạn

### Giai đoạn 1 – Discovery & Planning

- [ ] Xác nhận scope multi-tenant.
- [ ] Chốt use cases: tenant registration, user roles (tenant admin, staff).
- [ ] Đăng ký tài khoản Twilio (SMS) và SendGrid (Email).
- [ ] Lấy API credentials từ Twilio và SendGrid.

### Giai đoạn 2 – UX/UI Design

- [ ] Wireframe: Tenant Registration, Login, Dashboard, Customers, Customer Detail, Messaging, Logs.
- [ ] Chọn AntD components: Layout, Table, Form, Modal, Button, Notification.
- [ ] Prototype luồng đăng ký tenant → login → gửi SMS/Email.
- [ ] Design responsive layout cho mobile/desktop.

### Giai đoạn 3 – Backend (Node.js/Express + Prisma)

- [ ] Thiết kế DB schema multi-tenant (Tenants, Users, Customers, Messages, MessageLogs).
- [ ] Setup Prisma ORM với Singleton pattern (tránh tràn RAM).
- [ ] Tạo migrations cho MySQL trên AWS RDS.
- [ ] Xây REST API:
  - [ ] Tenant registration/management.
  - [ ] Auth (JWT) với tenant context.
  - [ ] Customers CRUD (scoped by tenant).
  - [ ] Messaging: Twilio SMS, SendGrid Email.
  - [ ] Message logs.
- [ ] Tích hợp Twilio SDK:
  - [ ] Test gửi SMS đơn.
  - [ ] Test gửi SMS hàng loạt.
  - [ ] Xử lý callback/webhook từ Twilio.
- [ ] Tích hợp SendGrid SDK:
  - [ ] Test gửi Email đơn.
  - [ ] Test gửi Email hàng loạt.
  - [ ] Xử lý bounce/spam reports.
- [ ] Middleware: tenant isolation, rate limiting.
- [ ] Logging & error handling.

### Giai đoạn 4 – Frontend (React + AntD)

- [ ] Setup Vite hoặc Create React App.
- [ ] Cấu hình React Router (public/private routes).
- [ ] Tích hợp AntD theme.
- [ ] Tạo API service layer (Axios).
- [ ] Implement pages:
  - [ ] Tenant Registration.
  - [ ] Login (với tenant subdomain hoặc slug).
  - [ ] Dashboard (số liệu tổng quan).
  - [ ] Customers (CRUD, search, filter).
  - [ ] Messaging (chọn kênh, soạn nội dung, gửi).
  - [ ] Logs (lịch sử gửi, trạng thái).
- [ ] Form validation (email, phone).
- [ ] Error handling & toast notifications.

### Giai đoạn 5 – DevOps & AWS (Docker)

- [ ] Viết Dockerfile cho Backend.
- [ ] Viết Dockerfile cho Frontend (nginx serve static).
- [ ] Viết docker-compose.yml (local test).
- [ ] AWS setup:
  - [ ] VPC, Subnets, Security Groups.
  - [ ] RDS MySQL (multi-AZ nếu cần HA).
  - [ ] ECR: Push Docker images.
  - [ ] ECS Fargate hoặc EC2 + Docker Compose: Deploy backend.
  - [ ] S3 + CloudFront: Deploy frontend (hoặc nginx container).
  - [ ] ALB/ELB: Load balancer cho backend.
  - [ ] CloudWatch: Logs & metrics.
- [ ] Environment variables (secrets trong ECS hoặc .env trên EC2).
- [ ] SSL/TLS certificate (ACM).

### Giai đoạn 6 – Testing & Documentation

- [ ] Test multi-tenant isolation (tenant A không thấy data tenant B).
- [ ] Test CRUD customers.
- [ ] **Test gửi SMS qua Twilio:**
  - [ ] Gửi thành công.
  - [ ] Xử lý lỗi (số không hợp lệ, hết credit).
- [ ] **Test gửi Email qua SendGrid:**
  - [ ] Gửi thành công.
  - [ ] Xử lý lỗi (email không hợp lệ, bounce).
- [ ] Test batch sending (nhiều khách hàng).
- [ ] Test rate limiting.
- [ ] Load test (nếu có thời gian).
- [ ] Viết report PDF:
  - [ ] System overview.
  - [ ] AWS architecture diagram.
  - [ ] Twilio/SendGrid integration.
  - [ ] Docker deployment process.
  - [ ] Security considerations.
  - [ ] Screenshots.
- [ ] Chuẩn bị live demo.

## 4) Checklist giao nộp

- [ ] Source code + README.
- [ ] Cloud architecture diagram.
- [ ] Demo live URL.
- [ ] Report PDF.
