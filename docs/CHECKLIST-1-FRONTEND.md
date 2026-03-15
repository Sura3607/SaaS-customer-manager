# ✅ CHECKLIST 1: FRONTEND DEVELOPER (React + AntD UI)

**👤 Người đảm trách:** Frontend Developer  
**🎯 Mục tiêu:** Xây dựng giao diện web đầy đủ, responsive, tích hợp API từ Backend  
**📚 Công nghệ:** React, Vite, Ant Design (AntD), Axios, React Router, Context API  
**⏱️ Thời gian dự kiến:** 6 tuần

---

## 📋 GIAI ĐOẠN 1: Chuẩn bị & Thiết lập (Tuần 1)

- [x] Setup project React + Vite
- [ ] `npm create vite@latest frontend -- --template react`
- [x] Cài AntD: `npm install antd`
- [x] Cài Axios: `npm install axios`
- [x] Cài React Router: `npm install react-router-dom`
- [ ] Cài React Query (tùy chọn): `npm install @tanstack/react-query`
- [x] Tạo `.gitignore` (node_modules, .env, dist, build)
- [x] Cấu hình Vite `vite.config.js`:
- [x] API proxy cho development (forward to Backend)
- [x] Env variables support
- [x] Tạo `.env.example`:

  ```env
  VITE_API_BASE_URL=http://localhost:5000/api/v1
  VITE_APP_NAME=Customer Manager SaaS
  ```

- [x] Tạo thư mục cấu trúc:
- [x] `src/pages/` - tất cả pages
- [x] `src/components/` - reusable components
- [x] `src/hooks/` - custom hooks
- [x] `src/services/` - API calls
- [x] `src/context/` - React context
- [x] `src/styles/` - global styles
- [x] `src/utils/` - helper functions
- [x] Cấu hình AntD theme (`src/styles/theme.js`):
- [x] Color scheme (primary, secondary, success, warning, error)
- [x] Typography (fonts, sizes)
- [x] Component customizations
- [x] Tạo API service layer (`src/services/api.js`):
- [x] Axios instance
- [x] Base URL từ env
- [x] Default headers
- [x] Error handling

---

## 📋 GIAI ĐOẠN 2: Xác thực & Context (Tuần 1-2)

- [x] Tạo `AuthContext.jsx` (`src/context/`)
- [x] State: currentUser, tenant, tokens (accessToken, refreshToken)
- [x] Methods: login, logout, register
- [x] Persist tokens to localStorage
- [x] Tạo `useAuth()` hook (`src/hooks/useAuth.js`)
- [x] Use context value
- [x] Export user, tenant, isAuthenticated, login, logout
- [x] Tạo Protected Route wrapper (`src/components/PrivateRoute.jsx`)
- [x] Check auth trước khi render
- [x] Redirect to login nếu chưa auth
- [x] Setup JWT token persistence
- [x] Store accessToken + refreshToken in localStorage
- [x] Load on app start
- [x] Clear on logout
- [x] Tạo API interceptor trong `src/services/api.js`:
- [x] Request interceptor: Thêm token vào Authorization header
- [x] Response interceptor: Handle 401 (refresh token or redirect to login)

---

## 📋 GIAI ĐOẠN 3: Trang Public (Tuần 2)

### Tenant Registration Page (`pages/TenantRegister.jsx`)

- [x] Form với fields:
  - [x] Company Name (required)
  - [x] Admin Email (required, email validation)
  - [x] Admin Password (required, min 6 chars)
  - [x] Phone (required, phone validation)
- [x] Submit button gọi API POST `/tenants/register`
- [x] Submit button gọi API POST `/tenants/register`
- [x] Success: Toast notification + Navigate to Login
- [x] Error: Modal hoặc toast với error message
- [x] Loading state: Disable button, show spinner
- [x] Responsive: Work trên mobile, tablet, desktop

### Login Page (`pages/Login.jsx`)

- [x] Form với fields:
  - [x] Email (required, email validation)
  - [x] Password (required)
  - [x] Tenant Slug (optional dropdown hoặc free input)
- [x] Submit button gọi API POST `/auth/login`
- [x] Submit button gọi API POST `/auth/login`
- [x] Success response:
  - [x] Save accessToken, refreshToken, user info to context
  - [x] Navigate to Dashboard
  - [x] Show success toast
- [x] Error handling:
  - [x] Invalid credentials → error message
  - [x] Invalid tenant → error message
- [x] "Remember me" functionality (tùy chọn, save tenant slug to localStorage)
- [x] Loading state, disabled submit during request
- [x] Responsive layout

---

## 📋 GIAI ĐOẠN 4: Layout & Navigation (Tuần 2)

### Main Layout (`components/layout/MainLayout.jsx`)

- [x] Header:
  - [x] Logo/App title (left)
  - [x] User info (middle - "Welcome, John Doe")
  - [x] Logout button (right)
  - [x] Responsive: Hamburger menu on mobile
- [x] Sidebar (Left):
  - [x] Navigation menu items:
    - [x] Dashboard (icon + text)
    - [x] Customers (icon + text)
    - [x] Messaging (icon + text)
    - [x] Logs (icon + text)
    - [x] Settings (icon + text, tùy chọn)
  - [x] Active menu item highlight
  - [x] Collapse on mobile
- [x] Content area (Main)
  - [x] Outlet for pages
  - [x] Padding/margins
- [x] Footer (tùy chọn)
  - [x] Copyright, version, links

### Header Component (`components/layout/Header.jsx`)

- [x] Display tenant name
- [x] Display current user email
- [x] Logout button with confirmation modal
- [x] Responsive (hamburger menu trigger on mobile)

### Navigation Setup (`App.jsx` + React Router)

- [x] Setup Router with routes:
  - [x] `/register` - TenantRegister (public)
  - [x] `/login` - Login (public)
  - [x] `/dashboard` - Dashboard (protected)
  - [x] `/customers` - Customers (protected)
  - [x] `/customers/:id` - CustomerDetail (protected)
  - [x] `/messaging` - Messaging (protected)
  - [x] `/logs` - Logs (protected)
  - [x] `/settings` - Settings (protected, tùy chọn)
  - [x] `*` - 404 Not Found
- [x] PrivateRoute wrapper cho protected routes
- [x] Layout wrapper (MainLayout) cho protected pages

---

## 📋 GIAI ĐOẠN 5: Dashboard (Tuần 2-3)

### Dashboard Page (`pages/Dashboard.jsx`)

- [x] Call API GET `/tenants/{id}/stats` on component mount
- [x] Call API GET `/tenants/{id}/stats` on component mount
- [x] Get tenantId from context
- [x] Handle loading, error states
- [x] Display Stats Cards (using AntD Statistic):
  - [x] Total Customers (number, icon)
  - [x] Total Messages Sent (number, icon)
  - [ ] Messages This Month (number, icon)
  - [ ] Delivery Success Rate (percentage, icon)
- [ ] Display Charts:
  - [ ] Messages sent by type (SMS vs Email) - Pie chart or Bar chart
  - [ ] Messages sent over time (last 7 days) - Line chart
  - [ ] Could use recharts or antd/charts
- [x] Recent Messages Table (last 10 messages):
  - [x] Columns: Type (SMS/Email), Recipient, Status, Sent Time, Action (View)
  - [x] Clickable row → navigate to Logs with filter
- [x] Loading skeleton while fetching
- [x] Error state: Show alert + retry button
- [x] Responsive layout: Cards stack on mobile

---

## 📋 GIAI ĐOẠN 6: Quản lý Khách hàng - Danh sách (Tuần 3-4)

### Customers List Page (`pages/Customers.jsx`)

- [x] Table with columns:
  - [x] ID
  - [x] Full Name
  - [x] Phone
  - [x] Email
  - [x] Created Date
  - [x] Actions (Edit, Delete, Send Message)
- [x] Features:
  - [x] **Search bar** (real-time filter or "Search" button):
    - [x] Search by Full Name, Phone, Email
    - [x] Call API GET `/customers?q=<query>&page=1&limit=10`
  - [x] **Pagination** (AntD Pagination component):
    - [x] Page size: 10, 20, 50
    - [x] Display total count
    - [x] Navigate between pages
  - [x] **Sort by columns** (click column header):
    - [x] Full Name ascending/descending
    - [x] Created Date ascending/descending
  - [x] **Bulk select**:
    - [x] Checkbox column (select one, many, all)
    - [x] "Select All" checkbox in header
    - [x] Batch delete button (with confirmation)
    - [x] "Send Message" button (select multiple, then send)
  - [x] **Row Actions**:
    - [x] Edit button → open modal or navigate to detail
    - [x] Delete button → confirmation modal, then call API DELETE
    - [x] View button → navigate to CustomerDetail page
- [x] Top toolbar with:
  - [x] "Add Customer" button (green, icon) → open AddCustomer modal
  - [x] "Delete Selected" button (red, only if items selected) → bulk delete with confirm
  - [x] "Send Message" button (blue, only if items selected) → navigate to Messaging with selected IDs
  - [x] Refresh button
- [x] Empty state:
  - [x] "No customers found" message with "Add Customer" button
  - [x] Show when list is empty or search has no results
- [x] Error state:
  - [x] Show error message + "Retry" button
- [x] Loading state:
  - [x] Skeleton table or spin
- [x] Responsive:
  - [x] On mobile: Hide some columns (ID, Created Date), show in detail

---

## 📋 GIAI ĐOẠN 7: Quản lý Khách hàng - Form (Tuần 3-4)

### Customer Form Component (`components/customer/CustomerForm.jsx`)

- [x] Form fields (AntD Form):
  - [x] Full Name (required, text input)
  - [x] Address (optional, text area)
  - [x] Phone (required, phone format validation)
  - [x] Email (required, email format validation)
- [x] Validation:
  - [x] Full Name: required, min 2 chars, max 100 chars
  - [x] Phone: required, valid phone format (regex or library)
  - [x] Email: required, valid email format
  - [x] Address: optional, max 500 chars
- [x] Submit button:
  - [x] "Create" if new customer
  - [x] "Update" if editing
  - [x] Disabled during submit
  - [x] Loading spinner
- [x] Cancel button (close modal / navigate back)
- [x] Error handling:
  - [x] Validation errors shown below fields (red text)
  - [x] API error shown as modal or alert
- [x] Success handling:
  - [x] Toast notification "Customer created/updated successfully"
  - [x] Close modal or refresh list

### Add/Edit Modal in Customers Page

- [x] Modal triggers:
  - [x] "Add Customer" button → modal with empty form (mode: create)
  - [x] Edit row action → modal with pre-filled form (mode: edit)
- [x] Form inside modal:
  - [x] Use CustomerForm component
  - [x] Pass onSubmit callback
  - [x] Pass initialValues (for edit mode)
- [x] Modal controls:
  - [x] OK button (submit)
  - [x] Cancel button (close without save)

---

## 📋 GIAI ĐOẠN 8: Quản lý Khách hàng - Detail (Tuần 3-4, Tùy chọn)

### Customer Detail Page (`pages/CustomerDetail.jsx`)

- [x] URL: `/customers/:id`
- [x] Load customer data: GET `/customers/{id}`
- [x] Display:
  - [x] Full Name (large heading)
  - [x] Phone (clickable tel: link)
  - [x] Email (clickable mailto: link)
  - [x] Address (formatted)
  - [x] Created Date, Last Modified Date
- [x] Recent Communication History (from Logs):
  - [x] Table: Type (SMS/Email), Content, Status, Sent Time
- [x] Actions:
  - [x] Send SMS button → navigate to Messaging with this customer pre-selected
  - [x] Send Email button → navigate to Messaging with this customer pre-selected
  - [x] Edit button → open edit modal
  - [x] Delete button → confirm + delete + navigate back
- [x] Back button or breadcrumb

---

## 📋 GIAI ĐOẠN 9: Messaging - UI Structure (Tuần 4-5)

### Messaging Page (`pages/Messaging.jsx`)

- [x] Tabs (AntD Tabs):
  - [x] SMS Tab
  - [x] Email Tab
- [x] Each tab has form inside

### SMS Form Component (`components/messaging/SMSForm.jsx`)

- [x] **Recipient Selection Panel**:
  - [x] Radio buttons: "Single Customer" or "Multiple Customers"
  - [x] **If "Single":**
    - [x] Dropdown: Select customer from list
    - [x] Display customer phone number below dropdown
  - [x] **If "Multiple":**
    - [x] Show table with checkboxes (customers list)
    - [x] "Select All" checkbox
    - [x] Display count: "5 customers selected"
    - [x] Could be searchable dropdown with multi-select
- [x] **Message Content Panel**:
  - [x] From (read-only): Show sender phone number from config
  - [x] Content (required): textarea
    - [x] Character counter (max 160 for SMS)
    - [x] Warning: "SMS will be split into 2 messages" if > 160 chars
  - [x] Preview:
    - [x] Show how message will look in SMS format
    - [x] Estimated cost (Twilio pricing) if available
- [x] **Actions**:
  - [x] "Preview" button (show modal with preview)
  - [x] "Send" button (green, large):
    - [x] Show confirmation modal: "Send SMS to 5 customers?"
    - [x] On confirm: Call API POST `/messages/sms` or `/messages/sms/batch`
    - [x] Loading state, disable during send
    - [x] Success toast: "SMS sent successfully! Message ID: ..."
    - [x] Error modal with error details & retry option

### Email Form Component (`components/messaging/EmailForm.jsx`)

- [x] Similar structure to SMS
- [x] **Recipient Selection**: Single or Multiple (same as SMS)
- [x] **Message Content Panel**:
  - [x] From (read-only): SENDGRID_FROM_EMAIL
  - [x] Subject (required): text input
  - [x] Content (required): rivtext editor or textarea
  - [x] Preview option
- [x] **Actions**:
  - [x] "Send" button (call API POST `/messages/email` or `/messages/email/batch`)
  - [x] Confirmation modal

### General Features (Both SMS & Email)

- [x] Loading state (spinner)
- [x] Error handling:
  - [x] Invalid phone/email → clear error message
  - [x] API error → show error modal with details
- [x] Success notification:
  - [x] Toast: "Message sent! ID: ... Status: pending"
- [x] Rate limit warning:
  - [x] If hit rate limit (429), show info: "Too many requests, try again in 1 minute"
- [x] Form reset after successful send (or option to send again)
- [x] Responsive: stacked layout on mobile

---

## 📋 GIAI ĐOẠN 10: Message Logs/History (Tuần 5)

### Logs Page (`pages/Logs.jsx`)

- [x] Table with columns:
  - [x] ID (small)
  - [x] Type (SMS / Email, badge)
  - [x] To (recipient phone/email)
  - [x] Status (badge: Pending, Sent, Delivered, Failed)
  - [x] Message (truncated text, tooltip on hover)
  - [x] Sent Time (formatted date)
  - [x] Actions (View)
- [x] **Filters** (top toolbar):
  - [x] Type filter (dropdown): All, SMS, Email
  - [x] Status filter (dropdown): All, Pending, Sent, Delivered, Failed
  - [x] Date range picker: From date, To date
  - [x] Search by recipient (phone/email)
  - [x] "Apply Filter" button or real-time filter
- [x] **Pagination**:
  - [x] Page size: 10, 20, 50
  - [x] Navigation
- [x] **Sort**:
  - [x] Click column headers to sort by: Type, Status, Sent Time
- [x] **Row Actions**:
  - [x] View button → open modal with full details:
    - [x] Message ID
    - [x] Type
    - [x] Recipient
    - [x] Full content
    - [x] Status
    - [x] Sent time, Delivered time (if applicable)
    - [x] Provider response (if failed, show error why)
- [x] **Empty state**: "No messages found"
- [x] **Error state**: Error message + Retry button
- [x] **Loading state**: Skeleton or spin
- [x] Responsive: Hide some columns on mobile, show in modal/drawer

---

## 📋 GIAI ĐOẠN 11: Settings Page (Tuần 5, Tùy chọn)

### Settings Page (`pages/Settings.jsx`)

- [x] Sections:
  - [x] **Tenant Information**:
    - [x] Company Name (readonly or editable with save button)
    - [x] Tenant Slug (readonly)
    - [x] Phone (editable)
    - [x] Created Date (readonly)
  - [x] **Integration Status**:
    - [x] SMS Provider: "Twilio - Connected" (green badge) or "Disconnected" (red badge)
    - [x] Email Provider: "SendGrid - Connected" (green badge) or "Disconnected"
  - [x] **API Configuration** (if tenant manages keys):
    - [x] Twilio Account SID (masked input)
    - [x] SendGrid API Key (masked input)
    - [x] Save button with confirm modal
  - [x] **Security**:
    - [x] Change password (open modal form)
    - [x] Logout all devices (button + confirm)
  - [x] **User Management** (if multi-user):
    - [x] List users in tenant
    - [x] Add user (modal form)
    - [x] Remove user (button + confirm)
- [x] Success toast after save
- [x] Error alert if save fails

---

## 📋 GIAI ĐOẠN 12: Styling & Responsive Design (Tuần 5)

### Global Styles (`src/styles/global.css`)

- [x] AntD theme variables override
- [x] Global typography (font family, sizes)
- [x] Colors (primary, secondary, success, warning, error)
- [x] Responsive breakpoints:
  - [x] Desktop: >= 1024px (2 columns, full sidebar)
  - [x] Tablet: 768px - 1023px (responsive, collapsible sidebar)
  - [x] Mobile: < 768px (1 column, hamburger menu, stack everything)
- [x] Utility classes (margins, paddings, borders, shadows)
- [x] Print styles (if needed)

### AntD Theme Configuration (`src/styles/theme.js`)

- [x] Primary color (blue / green / purple - choose one)
- [x] Component overlays (border radius, shadow depth)
- [x] Dark mode support (tùy chọn)

### Responsive Testing

- [x] Test on Chrome DevTools (mobile, tablet, desktop sizes)
- [x] Test on real devices (if possible)
- [x] Ensure no horizontal scroll
- [x] Touch targets >= 44x44px on mobile
- [x] Text readable on all sizes

### Performance Optimization

- [x] Code splitting (lazy load pages)
- [x] Image optimization (if any)
- [x] CSS minification (Vite handles)
- [x] JS bundle analysis (`vite-plugin-visualizer`, tùy chọn)

---

## 📋 GIAI ĐOẠN 13: Testing & Validation (Tuần 5)

### Unit Testing (tùy chọn)

- [x] Setup Jest + React Testing Library
- [x] Write tests for key components:
  - [x] AuthContext (login, logout, token persistence)
  - [x] PrivateRoute (redirect if not auth)
  - [x] CustomerForm (validation, submit)
  - [x] Messaging forms (SMS/Email send)

### Integration Testing (tùy chọn)

- [x] Test full flows:
  - [x] Register → Login → Dashboard → Create Customer
  - [x] Select customers → Send SMS → View in Logs
  - [x] Send Email → Check delivered status

### Manual Testing

- [x] Register new tenant:
  - [x] Valid input → Success, navigate to login
  - [x] Invalid email → Error message
  - [x] Weak password → Error message
- [x] Login:
  - [x] Valid credentials → Success, dashboard shows
  - [x] Invalid credentials → Error message
  - [x] Token persists after page refresh
- [x] Create Customer:
  - [x] Valid input → Success, appears in table
  - [x] Invalid phone → Error message below field
  - [x] Duplicate email → Error from API, handled gracefully
- [x] Send SMS:
  - [x] Single SMS → Success, appears in logs
  - [x] Batch SMS (5 customers) → All sent, visible in logs
  - [x] Invalid phone → Error message
- [x] Send Email:
  - [x] Single email → Success, email received in inbox
  - [x] Batch email → All received
  - [x] Invalid email → Error message
- [x] Logs:
  - [x] Filter by type (SMS/Email) → correct messages shown
  - [x] Filter by status → correct status shown
  - [x] View message detail → full content displayed
- [x] Navigation:
  - [x] Click menu items → pages load
  - [x] Back button → navigate back
  - [x] Logout → redirect to login
- [x] Error scenarios:
  - [x] Network down → error message + retry
  - [x] Server 500 → error message displayed
  - [x] Token expired → redirect to login

---

## 📋 GIAI ĐOẠN 14: Docker Build & Deployment (Tuần 5)

### Dockerfile for Frontend

- [x] Create `Dockerfile` in frontend root:

  ```dockerfile
  # Build stage
  FROM node:18-alpine AS builder
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  # Serve stage
  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
  CMD ["nginx", "-g", "daemon off;"]
  ```

### nginx.conf Configuration

- [x] Create `nginx.conf`:
  - [x] Serve `index.html` for all non-file routes (React Router support)
  - [x] Gzip compression enabled
  - [x] Cache control headers for assets
  - [x] Proper error pages (404 → index.html)
  - [x] CORS headers if needed (for local API proxy)

### Build & Test Locally

- [x] `npm run build` → generates `dist/` folder
- [x] `docker build -t frontend:v1 .`
- [ ] `docker run -p 3000:80 frontend:v1`
- [ ] Open <http://localhost:3000> in browser
- [ ] Test all pages load, navigation works
- [ ] Stop container

### Build & Test Results

- [x] `npm run build` → generates `dist/` folder
- [x] `docker build -t frontend:v1 .`
- [x] `docker run -p 3000:80 frontend:v1`
- [x] Open <http://localhost:3000> in browser
- [x] Test all pages load, navigation works
- [x] Stop container

### Environment Setup

- [x] Create `.env.production` (used by Vite during build):

  ```env
  VITE_API_BASE_URL=https://api.example.com/api/v1
  ```

- [x] Build includes production API URL
- [x] Secrets/sensitive data NOT in frontend (use backend only)

---

## 📋 GIAI ĐOẠN 15: Integration with Backend (Tuần 5-6)

### Test with Local Backend (docker-compose)

- [x] Backend running: `npm start` or Docker container
- [x] Frontend running: `npm run dev` or Docker container
- [x] Test API calls:
  - [x] POST `/auth/login` → get token, saved to localStorage ✓
  - [x] GET `/customers` → list displayed in table ✓
  - [x] POST `/customers` → form submit works ✓
  - [x] POST `/messages/sms` → SMS sent ✓
  - [x] GET `/messages/logs` → logs displayed ✓
- [x] Error handling:
  - [x] 401 Unauthorized → redirect to login ✓
  - [x] 400 Bad Request → error message shown ✓
  - [x] Network error → retry option ✓
- [x] CORS working (backend returns correct headers)
- [x] Token refresh flow works (if token expired mid-request)

### Integration Checklist

- [x] ✓ Frontend can authenticate via Backend
- [x] ✓ JWT tokens persisted correctly
- [x] ✓ All CRUD operations work
- [x] ✓ SMS/Email send and logs appear
- [x] ✓ No console errors or warnings
- [x] ✓ No security issues (passwords, tokens leaked?)

---

## ✅ SUCCESS CRITERIA FOR FRONTEND

- [x] All 7 pages functional (Register, Login, Dashboard, Customers, Detail, Messaging, Logs)
- [x] All forms validate inputs correctly
- [x] API calls made to correct endpoints with correct data
- [x] Error handling (user-friendly messages for all error scenarios)
- [x] Responsive design (tested on mobile, tablet, desktop)
- [x] Can perform full workflows:
  - [x] Register → Login → Dashboard → Create Customers → Send SMS/Email → View Logs
- [x] Docker image builds without errors
- [x] Docker container runs and serves at <http://localhost:3000>
- [x] All navigation works smoothly
- [x] Token/Auth persists across page refreshes
- [x] No console errors or warnings (in production build)
- [x] Deployment ready (code clean, documented, gitignored properly)

---

## 📝 NOTES FOR THIS PERSON

1. **API Dependencies**: Wait for Backend dev to finalize API specs (endpoints.md provides draft - confirm any changes weekly in sync meetings)
2. **Coordinate with Backend**: Test API endpoints early (W2-3), don't wait until W5 to discover integration issues
3. **Coordinate with DevOps**: Get ALB/CloudFront URL in W5 for final deployment
4. **Code Quality**: Use ESLint, Prettier for consistent formatting
5. **Git Workflow**: Commit daily, meaningful commit messages, keep branch updated with main
6. **Mobile First**: Design for mobile first, then expand to desktop (not vice versa)
7. **Accessibility**: Use semantic HTML, proper ARIA labels (AntD helps), test with keyboard navigation
8. **Performance**: Lazy load pages with React.lazy + Suspense, minimize bundle size
9. **User Experience**:
   - Show loading states
   - Disable buttons during async operations
   - Confirm before destructive actions (delete)
   - Toast notifications for feedback
   - Error boundaries to catch crashes
10. **Communication**: Update weekly progress, flag blockers early, ask Backend/DevOps for help if stuck

---

## 📅 WEEK-BY-WEEK BREAKDOWN

| Week | Focus | Output | Sync Point |
| ------ | ------- | -------- | ----------- |
| W1 | Setup, Auth Context, Login/Register pages | Auth flows working locally | Backend API ready? |
| W2 | Dashboard, Customers CRUD | Core features visible | Backend endpoints ready? |
| W3 | Messaging UI (SMS/Email forms) | Messaging UI complete | Backend SMS/Email ready? |
| W4 | Logs page, forms validation, polish | All pages complete | Integration test with Backend |
| W5 | Docker, responsive, error handling | Docker image builds, responsive works | DevOps provides ALB URL |
| W6 | Integration testing, deployment, final QA | All features tested, deployed to AWS | UAT, final demo |
