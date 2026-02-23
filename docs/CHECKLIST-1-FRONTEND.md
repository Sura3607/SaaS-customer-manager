# ✅ CHECKLIST 1: FRONTEND DEVELOPER (React + AntD UI)

**👤 Người đảm trách:** Frontend Developer  
**🎯 Mục tiêu:** Xây dựng giao diện web đầy đủ, responsive, tích hợp API từ Backend  
**📚 Công nghệ:** React, Vite, Ant Design (AntD), Axios, React Router, Context API  
**⏱️ Thời gian dự kiến:** 6 tuần

---

## 📋 GIAI ĐOẠN 1: Chuẩn bị & Thiết lập (Tuần 1)

- [ ] Setup project React + Vite
  - [ ] `npm create vite@latest frontend -- --template react`
  - [ ] Cài AntD: `npm install antd`
  - [ ] Cài Axios: `npm install axios`
  - [ ] Cài React Router: `npm install react-router-dom`
  - [ ] Cài React Query (tùy chọn): `npm install @tanstack/react-query`
- [ ] Tạo `.gitignore` (node_modules, .env, dist, build)
- [ ] Cấu hình Vite `vite.config.js`:
  - [ ] API proxy cho development (forward to Backend)
  - [ ] Env variables support
- [ ] Tạo `.env.example`:
  ```
  VITE_API_BASE_URL=http://localhost:5000/api/v1
  VITE_APP_NAME=Customer Manager SaaS
  ```
- [ ] Tạo thư mục cấu trúc:
  - [ ] `src/pages/` - tất cả pages
  - [ ] `src/components/` - reusable components
  - [ ] `src/hooks/` - custom hooks
  - [ ] `src/services/` - API calls
  - [ ] `src/context/` - React context
  - [ ] `src/styles/` - global styles
  - [ ] `src/utils/` - helper functions
- [ ] Cấu hình AntD theme (`src/styles/theme.js`):
  - [ ] Color scheme (primary, secondary, success, warning, error)
  - [ ] Typography (fonts, sizes)
  - [ ] Component customizations
- [ ] Tạo API service layer (`src/services/api.js`):
  - [ ] Axios instance
  - [ ] Base URL từ env
  - [ ] Default headers
  - [ ] Error handling

---

## 📋 GIAI ĐOẠN 2: Xác thực & Context (Tuần 1-2)

- [ ] Tạo `AuthContext.jsx` (`src/context/`)
  - [ ] State: currentUser, tenant, tokens (accessToken, refreshToken)
  - [ ] Methods: login, logout, register, refreshToken
  - [ ] Persist tokens to localStorage
- [ ] Tạo `useAuth()` hook (`src/hooks/useAuth.js`)
  - [ ] Use context value
  - [ ] Export user, tenant, isAuthenticated, login, logout
- [ ] Tạo Protected Route wrapper (`src/components/PrivateRoute.jsx`)
  - [ ] Check auth trước khi render
  - [ ] Redirect to login nếu chưa auth
- [ ] Setup JWT token persistence
  - [ ] Store accessToken + refreshToken in localStorage
  - [ ] Load on app start
  - [ ] Clear on logout
- [ ] Tạo API interceptor trong `src/services/api.js`:
  - [ ] Request interceptor: Thêm token vào Authorization header
  - [ ] Response interceptor: Handle 401 (refresh token or redirect to login)

---

## 📋 GIAI ĐOẠN 3: Trang Public (Tuần 2)

### Tenant Registration Page (`pages/TenantRegister.jsx`)
- [ ] Form với fields:
  - [ ] Company Name (required)
  - [ ] Admin Email (required, email validation)
  - [ ] Admin Password (required, min 6 chars)
  - [ ] Phone (required, phone validation)
- [ ] Submit button gọi API POST `/tenants/register`
- [ ] Success: Toast notification + Navigate to Login
- [ ] Error: Modal hoặc toast với error message
- [ ] Loading state: Disable button, show spinner
- [ ] Responsive: Work trên mobile, tablet, desktop

### Login Page (`pages/Login.jsx`)
- [ ] Form với fields:
  - [ ] Email (required, email validation)
  - [ ] Password (required)
  - [ ] Tenant Slug (optional dropdown hoặc free input)
- [ ] Submit button gọi API POST `/auth/login`
- [ ] Success response:
  - [ ] Save accessToken, refreshToken, user info to context
  - [ ] Navigate to Dashboard
  - [ ] Show success toast
- [ ] Error handling:
  - [ ] Invalid credentials → error message
  - [ ] Invalid tenant → error message
- [ ] "Remember me" functionality (tùy chọn, save tenant slug to localStorage)
- [ ] Loading state, disabled submit during request
- [ ] Responsive layout

---

## 📋 GIAI ĐOẠN 4: Layout & Navigation (Tuần 2)

### Main Layout (`components/layout/MainLayout.jsx`)
- [ ] Header:
  - [ ] Logo/App title (left)
  - [ ] User info (middle - "Welcome, John Doe")
  - [ ] Logout button (right)
  - [ ] Responsive: Hamburger menu on mobile
- [ ] Sidebar (Left):
  - [ ] Navigation menu items:
    - [ ] Dashboard (icon + text)
    - [ ] Customers (icon + text)
    - [ ] Messaging (icon + text)
    - [ ] Logs (icon + text)
    - [ ] Settings (icon + text, tùy chọn)
  - [ ] Active menu item highlight
  - [ ] Collapse on mobile
- [ ] Content area (Main)
  - [ ] Outlet for pages
  - [ ] Padding/margins
- [ ] Footer (tùy chọn)
  - [ ] Copyright, version, links

### Header Component (`components/layout/Header.jsx`)
- [ ] Display tenant name
- [ ] Display current user email
- [ ] Logout button with confirmation modal
- [ ] Responsive (hamburger menu trigger on mobile)

### Navigation Setup (`App.jsx` + React Router)
- [ ] Setup Router with routes:
  - [ ] `/register` - TenantRegister (public)
  - [ ] `/login` - Login (public)
  - [ ] `/dashboard` - Dashboard (protected)
  - [ ] `/customers` - Customers (protected)
  - [ ] `/customers/:id` - CustomerDetail (protected)
  - [ ] `/messaging` - Messaging (protected)
  - [ ] `/logs` - Logs (protected)
  - [ ] `/settings` - Settings (protected, tùy chọn)
  - [ ] `*` - 404 Not Found
- [ ] PrivateRoute wrapper cho protected routes
- [ ] Layout wrapper (MainLayout) cho protected pages

---

## 📋 GIAI ĐOẠN 5: Dashboard (Tuần 2-3)

### Dashboard Page (`pages/Dashboard.jsx`)
- [ ] Call API GET `/tenants/{id}/stats` on component mount
  - [ ] Get tenantId from context
  - [ ] Handle loading, error states
- [ ] Display Stats Cards (using AntD Statistic):
  - [ ] Total Customers (number, icon)
  - [ ] Total Messages Sent (number, icon)
  - [ ] Messages This Month (number, icon)
  - [ ] Delivery Success Rate (percentage, icon)
- [ ] Display Charts:
  - [ ] Messages sent by type (SMS vs Email) - Pie chart or Bar chart
  - [ ] Messages sent over time (last 7 days) - Line chart
  - [ ] Could use recharts or antd/charts
- [ ] Recent Messages Table (last 10 messages):
  - [ ] Columns: Type (SMS/Email), Recipient, Status, Sent Time, Action (View)
  - [ ] Clickable row → navigate to Logs with filter
- [ ] Loading skeleton while fetching
- [ ] Error state: Show alert + retry button
- [ ] Responsive layout: Cards stack on mobile

---

## 📋 GIAI ĐOẠN 6: Quản lý Khách hàng - Danh sách (Tuần 3-4)

### Customers List Page (`pages/Customers.jsx`)
- [ ] Table with columns:
  - [ ] ID
  - [ ] Full Name
  - [ ] Phone
  - [ ] Email
  - [ ] Created Date
  - [ ] Actions (Edit, Delete, Send Message)
- [ ] Features:
  - [ ] **Search bar** (real-time filter or "Search" button):
    - [ ] Search by Full Name, Phone, Email
    - [ ] Call API GET `/customers?q=<query>&page=1&limit=10`
  - [ ] **Pagination** (AntD Pagination component):
    - [ ] Page size: 10, 20, 50
    - [ ] Display total count
    - [ ] Navigate between pages
  - [ ] **Sort by columns** (click column header):
    - [ ] Full Name ascending/descending
    - [ ] Created Date ascending/descending
  - [ ] **Bulk select**:
    - [ ] Checkbox column (select one, many, all)
    - [ ] "Select All" checkbox in header
    - [ ] Batch delete button (with confirmation)
    - [ ] "Send Message" button (select multiple, then send)
  - [ ] **Row Actions**:
    - [ ] Edit button → open modal or navigate to detail
    - [ ] Delete button → confirmation modal, then call API DELETE
    - [ ] View button → navigate to CustomerDetail page
- [ ] Top toolbar with:
  - [ ] "Add Customer" button (green, icon) → open AddCustomer modal
  - [ ] "Delete Selected" button (red, only if items selected) → bulk delete with confirm
  - [ ] "Send Message" button (blue, only if items selected) → navigate to Messaging with selected IDs
  - [ ] Refresh button
- [ ] Empty state:
  - [ ] "No customers found" message with "Add Customer" button
  - [ ] Show when list is empty or search has no results
- [ ] Error state:
  - [ ] Show error message + "Retry" button
- [ ] Loading state:
  - [ ] Skeleton table or spin
- [ ] Responsive:
  - [ ] On mobile: Hide some columns (ID, Created Date), show in detail

---

## 📋 GIAI ĐOẠN 7: Quản lý Khách hàng - Form (Tuần 3-4)

### Customer Form Component (`components/customer/CustomerForm.jsx`)
- [ ] Form fields (AntD Form):
  - [ ] Full Name (required, text input)
  - [ ] Address (optional, text area)
  - [ ] Phone (required, phone format validation)
  - [ ] Email (required, email format validation)
- [ ] Validation:
  - [ ] Full Name: required, min 2 chars, max 100 chars
  - [ ] Phone: required, valid phone format (regex or library)
  - [ ] Email: required, valid email format
  - [ ] Address: optional, max 500 chars
- [ ] Submit button:
  - [ ] "Create" if new customer
  - [ ] "Update" if editing
  - [ ] Disabled during submit
  - [ ] Loading spinner
- [ ] Cancel button (close modal / navigate back)
- [ ] Error handling:
  - [ ] Validation errors shown below fields (red text)
  - [ ] API error shown as modal or alert
- [ ] Success handling:
  - [ ] Toast notification "Customer created/updated successfully"
  - [ ] Close modal or refresh list

### Add/Edit Modal in Customers Page
- [ ] Modal triggers:
  - [ ] "Add Customer" button → modal with empty form (mode: create)
  - [ ] Edit row action → modal with pre-filled form (mode: edit)
- [ ] Form inside modal:
  - [ ] Use CustomerForm component
  - [ ] Pass onSubmit callback
  - [ ] Pass initialValues (for edit mode)
- [ ] Modal controls:
  - [ ] OK button (submit)
  - [ ] Cancel button (close without save)

---

## 📋 GIAI ĐOẠN 8: Quản lý Khách hàng - Detail (Tuần 3-4, Tùy chọn)

### Customer Detail Page (`pages/CustomerDetail.jsx`)
- [ ] URL: `/customers/:id`
- [ ] Load customer data: GET `/customers/{id}`
- [ ] Display:
  - [ ] Full Name (large heading)
  - [ ] Phone (clickable tel: link)
  - [ ] Email (clickable mailto: link)
  - [ ] Address (formatted)
  - [ ] Created Date, Last Modified Date
- [ ] Recent Communication History (from Logs):
  - [ ] Table: Type (SMS/Email), Content, Status, Sent Time
- [ ] Actions:
  - [ ] Send SMS button → navigate to Messaging with this customer pre-selected
  - [ ] Send Email button → navigate to Messaging with this customer pre-selected
  - [ ] Edit button → open edit modal
  - [ ] Delete button → confirm + delete + navigate back
- [ ] Back button or breadcrumb

---

## 📋 GIAI ĐOẠN 9: Messaging - UI Structure (Tuần 4-5)

### Messaging Page (`pages/Messaging.jsx`)
- [ ] Tabs (AntD Tabs):
  - [ ] SMS Tab
  - [ ] Email Tab
- [ ] Each tab has form inside

### SMS Form Component (`components/messaging/SMSForm.jsx`)
- [ ] **Recipient Selection Panel**:
  - [ ] Radio buttons: "Single Customer" or "Multiple Customers"
  - [ ] **If "Single":**
    - [ ] Dropdown: Select customer from list
    - [ ] Display customer phone number below dropdown
  - [ ] **If "Multiple":**
    - [ ] Show table with checkboxes (customers list)
    - [ ] "Select All" checkbox
    - [ ] Display count: "5 customers selected"
    - [ ] Could be searchable dropdown with multi-select
- [ ] **Message Content Panel**:
  - [ ] From (read-only): Show sender phone number from config
  - [ ] Content (required): textarea
    - [ ] Character counter (max 160 for SMS)
    - [ ] Warning: "SMS will be split into 2 messages" if > 160 chars
  - [ ] Preview:
    - [ ] Show how message will look in SMS format
    - [ ] Estimated cost (Twilio pricing) if available
- [ ] **Actions**:
  - [ ] "Preview" button (show modal with preview)
  - [ ] "Send" button (green, large):
    - [ ] Show confirmation modal: "Send SMS to 5 customers?"
    - [ ] On confirm: Call API POST `/messages/sms` or `/messages/sms/batch`
    - [ ] Loading state, disable during send
    - [ ] Success toast: "SMS sent successfully! Message ID: ..."
    - [ ] Error modal with error details & retry option

### Email Form Component (`components/messaging/EmailForm.jsx`)
- [ ] Similar structure to SMS
- [ ] **Recipient Selection**: Single or Multiple (same as SMS)
- [ ] **Message Content Panel**:
  - [ ] From (read-only): SENDGRID_FROM_EMAIL
  - [ ] Subject (required): text input
  - [ ] Content (required): rivtext editor or textarea
  - [ ] Preview option
- [ ] **Actions**:
  - [ ] "Send" button (call API POST `/messages/email` or `/messages/email/batch`)
  - [ ] Confirmation modal

### General Features (Both SMS & Email)
- [ ] Loading state (spinner)
- [ ] Error handling:
  - [ ] Invalid phone/email → clear error message
  - [ ] API error → show error modal with details
- [ ] Success notification:
  - [ ] Toast: "Message sent! ID: ... Status: pending"
- [ ] Rate limit warning:
  - [ ] If hit rate limit (429), show info: "Too many requests, try again in 1 minute"
- [ ] Form reset after successful send (or option to send again)
- [ ] Responsive: stacked layout on mobile

---

## 📋 GIAI ĐOẠN 10: Message Logs/History (Tuần 5)

### Logs Page (`pages/Logs.jsx`)
- [ ] Table with columns:
  - [ ] ID (small)
  - [ ] Type (SMS / Email, badge)
  - [ ] To (recipient phone/email)
  - [ ] Status (badge: Pending, Sent, Delivered, Failed)
  - [ ] Message (truncated text, tooltip on hover)
  - [ ] Sent Time (formatted date)
  - [ ] Actions (View)
- [ ] **Filters** (top toolbar):
  - [ ] Type filter (dropdown): All, SMS, Email
  - [ ] Status filter (dropdown): All, Pending, Sent, Delivered, Failed
  - [ ] Date range picker: From date, To date
  - [ ] Search by recipient (phone/email)
  - [ ] "Apply Filter" button or real-time filter
- [ ] **Pagination**:
  - [ ] Page size: 10, 20, 50
  - [ ] Navigation
- [ ] **Sort**:
  - [ ] Click column headers to sort by: Type, Status, Sent Time
- [ ] **Row Actions**:
  - [ ] View button → open modal with full details:
    - [ ] Message ID
    - [ ] Type
    - [ ] Recipient
    - [ ] Full content
    - [ ] Status
    - [ ] Sent time, Delivered time (if applicable)
    - [ ] Provider response (if failed, show error why)
- [ ] **Empty state**: "No messages found"
- [ ] **Error state**: Error message + Retry button
- [ ] **Loading state**: Skeleton or spin
- [ ] Responsive: Hide some columns on mobile, show in modal/drawer

---

## 📋 GIAI ĐOẠN 11: Settings Page (Tuần 5, Tùy chọn)

### Settings Page (`pages/Settings.jsx`)
- [ ] Sections:
  - [ ] **Tenant Information**:
    - [ ] Company Name (readonly or editable with save button)
    - [ ] Tenant Slug (readonly)
    - [ ] Phone (editable)
    - [ ] Created Date (readonly)
  - [ ] **Integration Status**:
    - [ ] SMS Provider: "Twilio - Connected" (green badge) or "Disconnected" (red badge)
    - [ ] Email Provider: "SendGrid - Connected" (green badge) or "Disconnected"
  - [ ] **API Configuration** (if tenant manages keys):
    - [ ] Twilio Account SID (masked input)
    - [ ] SendGrid API Key (masked input)
    - [ ] Save button with confirm modal
  - [ ] **Security**:
    - [ ] Change password (open modal form)
    - [ ] Logout all devices (button + confirm)
  - [ ] **User Management** (if multi-user):
    - [ ] List users in tenant
    - [ ] Add user (modal form)
    - [ ] Remove user (button + confirm)
- [ ] Success toast after save
- [ ] Error alert if save fails

---

## 📋 GIAI ĐOẠN 12: Styling & Responsive Design (Tuần 5)

### Global Styles (`src/styles/global.css`)
- [ ] AntD theme variables override
- [ ] Global typography (font family, sizes)
- [ ] Colors (primary, secondary, success, warning, error)
- [ ] Responsive breakpoints:
  - [ ] Desktop: >= 1024px (2 columns, full sidebar)
  - [ ] Tablet: 768px - 1023px (responsive, collapsible sidebar)
  - [ ] Mobile: < 768px (1 column, hamburger menu, stack everything)
- [ ] Utility classes (margins, paddings, borders, shadows)
- [ ] Print styles (if needed)

### AntD Theme Configuration (`src/styles/theme.js`)
- [ ] Primary color (blue / green / purple - choose one)
- [ ] Component overlays (border radius, shadow depth)
- [ ] Dark mode support (tùy chọn)

### Responsive Testing
- [ ] Test on Chrome DevTools (mobile, tablet, desktop sizes)
- [ ] Test on real devices (if possible)
- [ ] Ensure no horizontal scroll
- [ ] Touch targets >= 44x44px on mobile
- [ ] Text readable on all sizes

### Performance Optimization
- [ ] Code splitting (lazy load pages)
- [ ] Image optimization (if any)
- [ ] CSS minification (Vite handles)
- [ ] JS bundle analysis (`vite-plugin-visualizer`, tùy chọn)

---

## 📋 GIAI ĐOẠN 13: Testing & Validation (Tuần 5)

### Unit Testing (tùy chọn)
- [ ] Setup Jest + React Testing Library
- [ ] Write tests for key components:
  - [ ] AuthContext (login, logout, token persistence)
  - [ ] PrivateRoute (redirect if not auth)
  - [ ] CustomerForm (validation, submit)
  - [ ] Messaging forms (SMS/Email send)

### Integration Testing (tùy chọn)
- [ ] Test full flows:
  - [ ] Register → Login → Dashboard → Create Customer
  - [ ] Select customers → Send SMS → View in Logs
  - [ ] Send Email → Check delivered status

### Manual Testing
- [ ] Register new tenant:
  - [ ] Valid input → Success, navigate to login
  - [ ] Invalid email → Error message
  - [ ] Weak password → Error message
- [ ] Login:
  - [ ] Valid credentials → Success, dashboard shows
  - [ ] Invalid credentials → Error message
  - [ ] Token persists after page refresh
- [ ] Create Customer:
  - [ ] Valid input → Success, appears in table
  - [ ] Invalid phone → Error message below field
  - [ ] Duplicate email → Error from API, handled gracefully
- [ ] Send SMS:
  - [ ] Single SMS → Success, appears in logs
  - [ ] Batch SMS (5 customers) → All sent, visible in logs
  - [ ] Invalid phone → Error message
- [ ] Send Email:
  - [ ] Single email → Success, email received in inbox
  - [ ] Batch email → All received
  - [ ] Invalid email → Error message
- [ ] Logs:
  - [ ] Filter by type (SMS/Email) → correct messages shown
  - [ ] Filter by status → correct status shown
  - [ ] View message detail → full content displayed
- [ ] Navigation:
  - [ ] Click menu items → pages load
  - [ ] Back button → navigate back
  - [ ] Logout → redirect to login
- [ ] Error scenarios:
  - [ ] Network down → error message + retry
  - [ ] Server 500 → error message displayed
  - [ ] Token expired → redirect to login

---

## 📋 GIAI ĐOẠN 14: Docker Build & Deployment (Tuần 5)

### Dockerfile for Frontend
- [ ] Create `Dockerfile` in frontend root:
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
- [ ] Create `nginx.conf`:
  - [ ] Serve `index.html` for all non-file routes (React Router support)
  - [ ] Gzip compression enabled
  - [ ] Cache control headers for assets
  - [ ] Proper error pages (404 → index.html)
  - [ ] CORS headers if needed (for local API proxy)

### Build & Test Locally
- [ ] `npm run build` → generates `dist/` folder
- [ ] `docker build -t frontend:v1 .`
- [ ] `docker run -p 3000:80 frontend:v1`
- [ ] Open http://localhost:3000 in browser
- [ ] Test all pages load, navigation works
- [ ] Stop container

### Environment Setup
- [ ] Create `.env.production` (used by Vite during build):
  ```
  VITE_API_BASE_URL=https://api.example.com/api/v1
  ```
- [ ] Build includes production API URL
- [ ] Secrets/sensitive data NOT in frontend (use backend only)

---

## 📋 GIAI ĐOẠN 15: Integration with Backend (Tuần 5-6)

### Test with Local Backend (docker-compose)
- [ ] Backend running: `npm start` or Docker container
- [ ] Frontend running: `npm run dev` or Docker container
- [ ] Test API calls:
  - [ ] POST `/auth/login` → get token, saved to localStorage ✓
  - [ ] GET `/customers` → list displayed in table ✓
  - [ ] POST `/customers` → form submit works ✓
  - [ ] POST `/messages/sms` → SMS sent ✓
  - [ ] GET `/messages/logs` → logs displayed ✓
- [ ] Error handling:
  - [ ] 401 Unauthorized → redirect to login ✓
  - [ ] 400 Bad Request → error message shown ✓
  - [ ] Network error → retry option ✓
- [ ] CORS working (backend returns correct headers)
- [ ] Token refresh flow works (if token expired mid-request)

### Integration Checklist
- [ ] ✓ Frontend can authenticate via Backend
- [ ] ✓ JWT tokens persisted correctly
- [ ] ✓ All CRUD operations work
- [ ] ✓ SMS/Email send and logs appear
- [ ] ✓ No console errors or warnings
- [ ] ✓ No security issues (passwords, tokens leaked?)

---

## ✅ SUCCESS CRITERIA FOR FRONTEND

- [ ] All 7 pages functional (Register, Login, Dashboard, Customers, Detail, Messaging, Logs)
- [ ] All forms validate inputs correctly
- [ ] API calls made to correct endpoints with correct data
- [ ] Error handling (user-friendly messages for all error scenarios)
- [ ] Responsive design (tested on mobile, tablet, desktop)
- [ ] Can perform full workflows:
  - [ ] Register → Login → Dashboard → Create Customers → Send SMS/Email → View Logs
- [ ] Docker image builds without errors
- [ ] Docker container runs and serves at http://localhost:3000
- [ ] All navigation works smoothly
- [ ] Token/Auth persists across page refreshes
- [ ] No console errors or warnings (in production build)
- [ ] Deployment ready (code clean, documented, gitignored properly)

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
|------|-------|--------|-----------|
| W1 | Setup, Auth Context, Login/Register pages | Auth flows working locally | Backend API ready? |
| W2 | Dashboard, Customers CRUD | Core features visible | Backend endpoints ready? |
| W3 | Messaging UI (SMS/Email forms) | Messaging UI complete | Backend SMS/Email ready? |
| W4 | Logs page, forms validation, polish | All pages complete | Integration test with Backend |
| W5 | Docker, responsive, error handling | Docker image builds, responsive works | DevOps provides ALB URL |
| W6 | Integration testing, deployment, final QA | All features tested, deployed to AWS | UAT, final demo |

