# Báo Cáo Đồng Bộ Frontend – Backend

Ngày: 2026-03-11  
Phạm vi: Toàn bộ luồng `signup → login`, quản lý khách hàng, gửi tin nhắn, cài đặt, nhật ký, hiển thị lỗi.

---

## 1. Bảng vấn đề theo mức độ ưu tiên

### 🔴 Khẩn cấp (gây lỗi trực tiếp cho người dùng)

| # | Vấn đề | Tác động | Vị trí frontend | Vị trí backend |
|---|---|---|---|---|
| 1 | `tenantSlug` bắt buộc ở backend nhưng frontend cho phép bỏ trống; sau khi đăng ký không lưu `slug` để điền vào trang login | **Nguyên nhân trực tiếp gây lỗi "Login failed" ngay sau signup** | `Login.jsx:32` (`\|\| undefined`), `Login.jsx:85` (`required: false`), `TenantRegister.jsx:28–36` (không lưu slug) | `auth.validator.js:19`, `auth.service.js:29` |
| 2 | Frontend đọc sai key lỗi: dùng `response.data.message`, nhưng backend luôn trả `{ error, code, details }` (không có key `message`) | **Toàn bộ thông báo lỗi trong app hiển thị chuỗi mặc định** thay vì lý do thật từ backend | `Login.jsx:39`, `TenantRegister.jsx:38`, `Customers.jsx:66,96`, `CustomerForm.jsx:33`, `CustomerDetail.jsx:26,65`, `Settings.jsx:270,291,310,332,349` | `error.middleware.js:52,77` |

---

### 🟡 Trung bình (gây hỏng tính năng nhưng không crash app)

| # | Vấn đề | Tác động | Vị trí frontend | Vị trí backend |
|---|---|---|---|---|
| 3 | Parse sai cấu trúc response refresh token: `r.data` thay vì `r.data.data` | Khi access token hết hạn sẽ không lấy được token mới, người dùng bị đăng xuất đột ngột | `api.js:36` | `auth.controller.js:34` (trả `{ success, data: { accessToken } }`) |
| 4 | Form đăng ký có field `fullName` nhưng không gửi `adminFullName` lên API | Tên admin luôn bị lưu là `'Admin'` trong database | `TenantRegister.jsx:28–34` (thiếu `adminFullName: values.fullName`) | `tenant.service.js:51` (`adminFullName \|\| 'Admin'`) |
| 5 | Settings gửi `name: companyName` thay vì `companyName` khi cập nhật thông tin tenant | Cập nhật tên công ty không có tác dụng (field bị `stripUnknown` loại bỏ) | `Settings.jsx:handleSaveTenantInfo()` | `updateTenantSchema` chỉ nhận `companyName` |
| 6 | Settings gửi `twilioAccountSid`, `twilioAuthToken`, `sendgridApiKey`, `sendgridFromEmail` — đều không có trong `updateTenantSchema` | **Cấu hình Twilio/SendGrid không bao giờ được lưu** dù UI báo thành công | `Settings.jsx:handleSaveTenantInfo()` | `updateTenantSchema` (chỉ nhận `companyName`, `phone`) |
| 7 | Dashboard và Messaging dùng `tenant?.name`, nhưng backend trả về `companyName` | Tên tổ chức trên header tất cả màn hình luôn hiện `'Acme Corp'` (giá trị fallback) | `Dashboard.jsx:~152`, `Messaging.jsx:~55` | Login response: `tenant.companyName` |
| 8 | Settings `fetchTenantData()` dùng `data.name` để set state, backend trả `companyName` | Ô nhập tên công ty luôn rỗng khi mở trang Settings | `Settings.jsx:fetchTenantData()` | GET `/tenants/:id` trả về `companyName` |
| 9 | Logs gửi `fromDate`/`toDate` và tham số tìm kiếm `q`, trong khi backend schema chỉ nhận `startDate`/`endDate` và không có param search | Bộ lọc theo ngày và tìm kiếm văn bản trong Logs hoàn toàn không hoạt động | `Logs.jsx:fetchLogs()` | `logQuerySchema`: chỉ có `startDate`, `endDate`, không có `q` |
| 10 | Logs gửi giá trị `type` dạng chữ thường (`'sms'`, `'email'`), backend chỉ valid `'SMS'`, `'EMAIL'` (chữ hoa) | Bộ lọc theo loại tin nhắn trong Logs luôn bị lỗi validation | `Logs.jsx:filters.type` | `logQuerySchema: Joi.valid('SMS', 'EMAIL')` |
| 11 | `CustomerDetail` lấy 10 logs gần nhất rồi filter `customerId` ngay phía client | Nếu 10 logs đầu không chứa log của khách đang xem, phần "Lịch sử liên lạc" hiển thị trống dù có dữ liệu | `CustomerDetail.jsx:39–50` | `/messages/logs` hỗ trợ filter phía server |
| 12 | Interceptor toàn cục xóa token và redirect `/login` khi gặp bất kỳ lỗi 401 nào (kể cả khi đang thực hiện login) | Che mất lỗi thật, khó debug, gây reload trang không cần thiết | `api.js:52–56` | — |

---

## 2. Phân tích chi tiết lỗi "Signup xong → Login fail"

```
Bước 1: Người dùng đăng ký tại /register
  → API trả về { tenant: { slug: "acme-corp-a1b2c3", ... } }
  → Frontend KHÔNG lưu slug này (TenantRegister.jsx:28–36)
  → Redirect thẳng về /login

Bước 2: Người dùng ở trang /login
  → Trường "Organization" rỗng (localStorage 'tenantSlug' chưa có)
  → tenantSlug: values.tenantSlug || undefined  ← gửi undefined lên backend

Bước 3: Backend nhận request
  → Joi validator: tenantSlug là required → reject 400 VALIDATION_ERROR
  → Trả về: { error: "Validation error", details: [{ field: "tenantSlug", ... }] }

Bước 4: Frontend nhận lỗi
  → err.response.data.message → undefined (key này không tồn tại!)
  → Fallback: "Login failed"  ← người dùng thấy thông báo chung chung này
```

---

## 3. Yêu cầu log lỗi frontend đầy đủ

Hiện tại toàn bộ catch block trong frontend chỉ log `console.error(err)` và hiển thị `err.response?.data?.message` — là key không tồn tại trong response backend. Cần chuẩn hóa như sau:

### Cấu trúc log đề xuất

| Trường | Nguồn | Mô tả |
|---|---|---|
| `feature` | hardcode theo từng chức năng | Ví dụ `auth.login`, `customer.create`, `sms.send` |
| `httpStatus` | `err.response?.status` | Mã HTTP (400, 401, 404, 409, 422, 500…) |
| `backendCode` | `err.response?.data?.code` | Mã lỗi nghiệp vụ (`VALIDATION_ERROR`, `UNAUTHORIZED`, `NOT_FOUND`…) |
| `backendError` | `err.response?.data?.error` | Thông điệp lỗi chính từ backend |
| `backendDetails` | `err.response?.data?.details` | Danh sách trường và lý do (nếu là lỗi validation) |
| `request` | local state (ẩn mật khẩu) | Dữ liệu gửi đi, dùng `hasPassword: !!password` thay vì log mật khẩu thô |
| `timestamp` | `new Date().toISOString()` | Thời điểm xảy ra lỗi |

### Ví dụ log khi thiếu tenantSlug

```json
{
  "feature": "auth.login",
  "httpStatus": 400,
  "backendCode": "VALIDATION_ERROR",
  "backendError": "Validation error",
  "backendDetails": [
    { "field": "tenantSlug", "message": "Tenant slug is required" }
  ],
  "request": {
    "email": "user@acme.com",
    "tenantSlug": "",
    "hasPassword": true
  },
  "timestamp": "2026-03-11T10:15:22.000Z"
}
```

### Ví dụ log khi nhập sai mật khẩu

```json
{
  "feature": "auth.login",
  "httpStatus": 401,
  "backendCode": "UNAUTHORIZED",
  "backendError": "Invalid email or password",
  "backendDetails": null,
  "request": {
    "email": "user@acme.com",
    "tenantSlug": "acme-corp",
    "hasPassword": true
  },
  "timestamp": "2026-03-11T10:16:05.000Z"
}
```

### Ví dụ log khi tenant không tồn tại

```json
{
  "feature": "auth.login",
  "httpStatus": 404,
  "backendCode": "NOT_FOUND",
  "backendError": "Tenant not found",
  "backendDetails": null,
  "request": {
    "email": "user@acme.com",
    "tenantSlug": "wrong-slug",
    "hasPassword": true
  },
  "timestamp": "2026-03-11T10:17:10.000Z"
}
```

### Hàm helper đọc lỗi backend (nên dùng chung toàn app)

```javascript
// utils/parseApiError.js
export function parseApiError(err) {
  const status = err.response?.status
  const data = err.response?.data
  const details = data?.details?.map(d => `${d.field}: ${d.message}`).join(', ')
  return details || data?.error || `Lỗi server (HTTP ${status})`
}
```

---

## 4. Thứ tự ưu tiên fix

| Thứ tự | Fix cần thực hiện | File cần sửa |
|---|---|---|
| 1 | Sau signup lưu `slug` vào localStorage, tự điền vào form login | `TenantRegister.jsx` |
| 2 | Bắt buộc nhập `tenantSlug` trên form login (`required: true`) | `Login.jsx:85` |
| 3 | Chuẩn hóa đọc lỗi: `data?.error` + `data?.details`, tạo helper `parseApiError` | Tất cả catch block trong `Login.jsx`, `TenantRegister.jsx`, `Customers.jsx`, `CustomerForm.jsx`, `CustomerDetail.jsx`, `Settings.jsx` |
| 4 | Sửa parse refresh token: `r.data` → `r.data.data` | `api.js:36` |
| 5 | Map `fullName → adminFullName` trong form đăng ký | `TenantRegister.jsx:28` |
| 6 | Sửa `name` → `companyName` khi PUT cập nhật tenant | `Settings.jsx:handleSaveTenantInfo()` |
| 7 | Sửa `data.name` → `data.companyName` khi load dữ liệu tenant | `Settings.jsx:fetchTenantData()` |
| 8 | Sửa `tenant?.name` → `tenant?.companyName` trên header | `Dashboard.jsx`, `Messaging.jsx` |
| 9 | Sửa tên param date filter: `fromDate/toDate` → `startDate/endDate` | `Logs.jsx` |
| 10 | Chuyển type filter sang chữ hoa trước khi gửi (`'sms'` → `'SMS'`) | `Logs.jsx` |
| 11 | Truyền `customerId` làm query param khi gọi `/messages/logs` để filter phía server | `CustomerDetail.jsx:loadCommunicationHistory()` |
| 12 | Thu hẹp điều kiện redirect trong interceptor: chỉ redirect khi không phải đang xử lý auth request | `api.js:52–56` |
