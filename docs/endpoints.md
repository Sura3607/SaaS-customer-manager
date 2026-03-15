# Danh sách API Endpoints (chi tiết)

**Base URL:** `/api/v1`

## 1) Tenants

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| POST | `/tenants/register` | Đăng ký tenant mới | `{ companyName, adminEmail, adminPassword, phone }` | `{ tenantId, slug, admin }` |
| GET | `/tenants/:id` | Thông tin tenant | — | `{ id, companyName, slug, createdAt }` |
| PUT | `/tenants/:id` | Cập nhật thông tin tenant | `{ companyName, phone }` | `{ id, ... }` |
| GET | `/tenants/:id/stats` | Thống kê tenant | — | `{ totalCustomers, totalMessagesSent }` |

## 2) Auth

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| POST | `/auth/login` | Đăng nhập | `{ email, password, tenantSlug }` | `{ accessToken, refreshToken, user, tenant }` |
| POST | `/auth/logout` | Đăng xuất | — | `204` |
| POST | `/auth/refresh` | Refresh token | `{ refreshToken }` | `{ accessToken }` |
| GET | `/auth/me` | Thông tin user hiện tại | — | `{ id, name, email, role, tenantId }` |

## 3) Customers

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| GET | `/customers` | Danh sách, tìm kiếm, phân trang (scoped by tenant) | `q, page, limit, sort` | `{ data, total, page, limit }` |
| POST | `/customers` | Tạo khách hàng | `{ fullName, address, phone, email }` | `{ id, ... }` |
| GET | `/customers/:id` | Chi tiết khách hàng | — | `{ id, fullName, address, phone, email }` |
| PUT | `/customers/:id` | Cập nhật khách hàng | `{ fullName, address, phone, email }` | `{ id, ... }` |
| DELETE | `/customers/:id` | Xóa khách hàng | — | `204` |
| POST | `/customers/bulk` | Tạo nhiều khách hàng | `[ { fullName, ... } ]` | `{ createdCount }` |

## 4) Messaging (Twilio SMS / SendGrid Email)

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| POST | `/messages/sms` | Gửi SMS cho 1 khách (Twilio) | `{ customerId, content }` | `{ messageId, status, twilioSid }` |
| POST | `/messages/email` | Gửi Email cho 1 khách (SendGrid) | `{ customerId, subject, content }` | `{ messageId, status, sendGridId }` |
| POST | `/messages/sms/batch` | Gửi SMS hàng loạt | `{ customerIds[], content }` | `{ batchId, queued, total }` |
| POST | `/messages/email/batch` | Gửi Email hàng loạt | `{ customerIds[], subject, content }` | `{ batchId, queued, total }` |
| POST | `/messages/twilio/webhook` | Webhook nhận trạng thái SMS từ Twilio | Twilio payload | `200` |
| POST | `/messages/sendgrid/webhook` | Webhook nhận sự kiện từ SendGrid | SendGrid payload | `200` |

## 5) Message Logs

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| GET | `/messages/logs` | Lịch sử gửi (scoped by tenant) | `type, status, page, limit` | `{ data, total }` |
| GET | `/messages/logs/:id` | Chi tiết lịch sử gửi | — | `{ id, type, to, status, providerResponse }` |

## 6) System & Health

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| GET | `/health` | Health check | — | `{ status: "ok" }` |
| GET | `/metrics` | Metrics (nếu cần) | — | Prometheus text |

## 7) Settings (tùy chọn, nếu cần UI cấu hình)

| Method | Endpoint | Mô tả | Body/Query chính | Response chính |
| --- | --- | --- | --- | --- |
| GET | `/settings/integration` | Xem trạng thái cấu hình | — | `{ smsProvider, emailProvider }` |
| PUT | `/settings/integration` | Cập nhật cấu hình | `{ smsProvider, emailProvider }` | `{ ok: true }` |

---

## Ghi chú bảo mật tối thiểu

- **Multi-tenant isolation:** Mọi request phải kiểm tra tenantId từ JWT, chỉ truy xuất data của tenant đó.
- Bảo vệ bằng JWT (access token) cho tất cả endpoint trừ `/auth/*`, `/tenants/register`, và `/health`.
- Rate limit cho endpoint gửi SMS/Email (tránh spam).
- Validate dữ liệu đầu vào (email/phone format).
- Lưu API keys Twilio/SendGrid trong biến môi trường (không commit vào code).
- Log lỗi & audit trail.
