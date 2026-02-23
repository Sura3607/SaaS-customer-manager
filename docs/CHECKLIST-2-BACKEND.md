# ✅ CHECKLIST 2: BACKEND DEVELOPER (Node.js/Express + Prisma)

**👤 Người đảm trách:** Backend Developer  
**🎯 Mục tiêu:** Xây dựng RESTful API hoàn chỉnh, multi-tenant, kết nối database + external services  
**📚 Công nghệ:** Node.js, Express, Prisma ORM, JWT, MySQL, Docker  
**⏱️ Thời gian dự kiến:** 6 tuần

---

## 📋 GIAI ĐOẠN 1: Chuẩn bị & Thiết lập (Tuần 1)

### Project Setup
- [ ] Khởi tạo Node.js project: `npm init -y`
- [ ] Tạo `.gitignore` (node_modules, .env, logs, dist, coverage)
- [ ] Cài Dependencies:
  - [ ] `npm install express`
  - [ ] `npm install @prisma/client prisma`
  - [ ] `npm install jsonwebtoken`
  - [ ] `npm install bcryptjs` (password hashing)
  - [ ] `npm install dotenv` (environment variables)
  - [ ] `npm install cors` (CORS headers)
  - [ ] `npm install twilio` (SMS)
  - [ ] `npm install @sendgrid/mail` (Email)
  - [ ] `npm install express-rate-limit` (Rate limiting)
  - [ ] `npm install joi` hoặc `yup` (Validation)
  - [ ] `npm install uuid` (ID generation)
- [ ] Cài Dev Dependencies:
  - [ ] `npm install -D nodemon` (auto-reload)
  - [ ] `npm install -D eslint prettier` (linting)
- [ ] Cấu hình package.json scripts:
  ```json
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:seed": "node prisma/seed.js"
  }
  ```

### Directory Structure
- [ ] Tạo thư mục cấu trúc:
  ```
  backend/
  ├─ src/
  │  ├─ app.js          # Express app
  │  ├─ server.js       # Server entry point
  │  ├─ config/
  │  │  ├─ env.js       # Environment variables
  │  │  ├─ db.js        # Prisma Client Singleton
  │  │  └─ providers.js # Twilio & SendGrid config
  │  ├─ routes/
  │  │  ├─ tenants.routes.js
  │  │  ├─ auth.routes.js
  │  │  ├─ customers.routes.js
  │  │  ├─ messages.routes.js
  │  │  ├─ logs.routes.js
  │  │  └─ health.routes.js
  │  ├─ controllers/
  │  │  ├─ tenants.controller.js
  │  │  ├─ auth.controller.js
  │  │  ├─ customers.controller.js
  │  │  ├─ messages.controller.js
  │  │  └─ logs.controller.js
  │  ├─ services/
  │  │  ├─ twilio.service.js
  │  │  ├─ sendgrid.service.js
  │  │  ├─ tenant.service.js
  │  │  ├─ customer.service.js
  │  │  └─ message.service.js
  │  ├─ middlewares/
  │  │  ├─ auth.middleware.js
  │  │  ├─ tenant.middleware.js
  │  │  └─ ratelimit.middleware.js
  │  ├─ validators/
  │  │  ├─ customer.validator.js
  │  │  └─ message.validator.js
  │  ├─ utils/
  │  │  ├─ logger.js
  │  │  ├─ errors.js
  │  │  └─ formatters.js
  │  └─ jobs/
  │     └─ (batch jobs if needed)
  ├─ prisma/
  │  ├─ schema.prisma
  │  ├─ migrations/
  │  └─ seed.js
  ├─ Dockerfile
  ├─ package.json
  ├─ .env.example
  └─ .gitignore
  ```

### Environment Variables
- [ ] Tạo `.env.example`:
  ```
  NODE_ENV=development
  PORT=5000
  LOG_LEVEL=debug
  
  DATABASE_URL=mysql://user:password@localhost:3306/saas_db
  
  JWT_SECRET=your-super-secret-jwt-key-min-32-chars
  JWT_EXPIRE=15m
  JWT_REFRESH_EXPIRE=7d
  
  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
  TWILIO_AUTH_TOKEN=your_auth_token_here
  TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
  
  SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
  SENDGRID_FROM_EMAIL=noreply@saas.example.com
  
  RATE_LIMIT_WINDOW=15m
  RATE_LIMIT_MAX_REQUESTS=100
  ```
- [ ] Tạo `.env` file cho development (KHÔNG commit)
- [ ] Cấu hình env variables (`src/config/env.js`):
  - [ ] Read từ .env
  - [ ] Provide default values nếu cần
  - [ ] Validate required variables

---

## 📋 GIAI ĐOẠN 2: Database Schema & Prisma (Tuần 1)

### Prisma Schema Design (`prisma/schema.prisma`)
- [ ] Setup datasource:
  ```prisma
  datasource db {
    provider = "mysql"
    url      = env("DATABASE_URL")
  }
  ```
- [ ] Setup generator:
  ```prisma
  generator client {
    provider = "prisma-client-js"
  }
  ```

### Models & Schema
- [ ] **Tenant** model:
  - [ ] id (String, @id, @default(cuid()))
  - [ ] companyName (String, required)
  - [ ] slug (String, @unique, required) - for subdomain/routing
  - [ ] phone (String)
  - [ ] createdAt (DateTime, @default(now()))
  - [ ] updatedAt (DateTime, @updatedAt)
  - [ ] Relations: users[], customers[], messages[], messageLogs[]

- [ ] **User** model:
  - [ ] id (String, @id, @default(cuid()))
  - [ ] email (String, @unique, required)
  - [ ] password (String, required) - hashed
  - [ ] fullName (String)
  - [ ] role (Enum: ADMIN, STAFF) - @default(STAFF)
  - [ ] tenantId (String, FK to Tenant)
  - [ ] createdAt (DateTime, @default(now()))
  - [ ] updatedAt (DateTime, @updatedAt)
  - [ ] Relations: tenant, refreshTokens[]

- [ ] **Customer** model:
  - [ ] id (String, @id, @default(cuid()))
  - [ ] tenantId (String, FK to Tenant)
  - [ ] fullName (String, required)
  - [ ] address (String)
  - [ ] phone (String, required)
  - [ ] email (String, required)
  - [ ] createdAt (DateTime, @default(now()))
  - [ ] updatedAt (DateTime, @updatedAt)
  - [ ] @@unique([tenantId, email]) - email unique per tenant
  - [ ] @@unique([tenantId, phone]) - phone unique per tenant
  - [ ] Relations: messages[], messageLogs[]

- [ ] **Message** model:
  - [ ] id (String, @id, @default(cuid()))
  - [ ] tenantId (String, FK to Tenant)
  - [ ] customerId (String, FK to Customer)
  - [ ] type (Enum: SMS, EMAIL)
  - [ ] content (String, required)
  - [ ] subject (String) - for email only
  - [ ] status (Enum: PENDING, SENT, DELIVERED, FAILED) - @default(PENDING)
  - [ ] recipientPhone (String) - denormalized, for logging
  - [ ] recipientEmail (String) - denormalized, for logging
  - [ ] createdAt (DateTime, @default(now()))
  - [ ] sentAt (DateTime)
  - [ ] Relations: messageLogs[]

- [ ] **MessageLog** model:
  - [ ] id (String, @id, @default(cuid()))
  - [ ] messageId (String, FK to Message)
  - [ ] status (Enum: PENDING, SENT, DELIVERED, FAILED, BOUNCED)
  - [ ] providerMessageId (String) - from Twilio/SendGrid
  - [ ] providerResponse (Json) - store provider response as JSON
  - [ ] errorReason (String) - why it failed
  - [ ] timestamp (DateTime, @default(now()))
  - [ ] updatedAt (DateTime, @updatedAt)

- [ ] **AuditLog** model (optional, for compliance):
  - [ ] id (String, @id, @default(cuid()))
  - [ ] tenantId (String, FK to Tenant)
  - [ ] userId (String, FK to User)
  - [ ] action (String) - "CREATE_CUSTOMER", "SEND_SMS", etc
  - [ ] resourceType (String) - "Customer", "Message"
  - [ ] resourceId (String)
  - [ ] changes (Json) - what changed
  - [ ] timestamp (DateTime, @default(now()))

### Setup Database Connection
- [ ] Cấu hình MySQL connection (AWS RDS hoặc local)
- [ ] Test connection: `npx prisma db push` (tạo schema mà không cần migration)
- [ ] Hoặc `npx prisma migrate dev --name init` (tạo migration)
- [ ] Verify tables created in database

### Prisma Client Singleton (`src/config/db.js`)
- [ ] Implement Singleton pattern để tránh multiple client instances:
  ```javascript
  let prisma;

  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }

  export default prisma;
  ```

---

## 📋 GIAI ĐOẠN 3: Express App & Middleware (Tuần 1-2)

### Express App Setup (`src/app.js`)
- [ ] Import Express, CORS, middlewares
- [ ] Create Express app
- [ ] Setup middlewares:
  ```javascript
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  ```
- [ ] Setup routes:
  - [ ] `app.use('/api/v1/health', require('./routes/health.routes'));`
  - [ ] `app.use('/api/v1/tenants', require('./routes/tenants.routes'));`
  - [ ] `app.use('/api/v1/auth', require('./routes/auth.routes'));`
  - [ ] `app.use('/api/v1/customers', require('./routes/customers.routes'));`
  - [ ] `app.use('/api/v1/messages', require('./routes/messages.routes'));`
  - [ ] `app.use('/api/v1/logs', require('./routes/logs.routes'));`
- [ ] Setup error handling middleware (catch-all at end)
- [ ] Export app

### Server Entry Point (`src/server.js`)
- [ ] Import app
- [ ] Start server: `app.listen(PORT, ...)`
- [ ] Log: "Server running on port 5000"
- [ ] Graceful shutdown: Handle SIGTERM, close DB connection

### Auth Middleware (`src/middlewares/auth.middleware.js`)
- [ ] Extract JWT token from Authorization header: `Bearer <token>`
- [ ] Verify token using JWT_SECRET
- [ ] Extract userId, tenantId from token
- [ ] Set `req.user = { userId, tenantId }`
- [ ] Next() or throw 401 Unauthorized
- [ ] Handle expired token: throw 401 (let refresh endpoint handle refresh)

### Tenant Middleware (`src/middlewares/tenant.middleware.js`)
- [ ] Verify `req.user.tenantId` exists (user must be authenticated)
- [ ] Add `req.tenantId = req.user.tenantId` to all requests
- [ ] All DB queries should filter by tenantId automatically
- [ ] Prevent tenant A from accessing data of tenant B

### Rate Limit Middleware (`src/middlewares/ratelimit.middleware.js`)
- [ ] Use `express-rate-limit`:
  - [ ] General limit: 100 requests per 15 minutes per IP
  - [ ] Messaging endpoints: 10 requests per minute per user (to prevent spam)
- [ ] Return 429 Too Many Requests with Retry-After header

### Error Handler Middleware
- [ ] Catch all errors
- [ ] Log error (with context)
- [ ] Return error response:
  - [ ] 400 Bad Request (validation error)
  - [ ] 401 Unauthorized (auth failure)
  - [ ] 403 Forbidden (not allowed)
  - [ ] 404 Not Found
  - [ ] 429 Too Many Requests (rate limit)
  - [ ] 500 Internal Server Error (unexpected error)
- [ ] Response format: `{ error: "message", code: "ERROR_CODE", details: {...} }`

---

## 📋 GIAI ĐOẠN 4: Authentication & Tenant Management (Tuần 2)

### Auth Service (`src/services/auth.service.js`)
- [ ] **login(email, password, tenantSlug)**:
  - [ ] Find user by email + tenantSlug (join with Tenant)
  - [ ] Verify password using bcrypt.compare()
  - [ ] Generate accessToken (15 min):
    - [ ] Payload: { userId, tenantId, email }
    - [ ] Secret: JWT_SECRET
    - [ ] Expiry: 15m
  - [ ] Generate refreshToken (7 days):
    - [ ] Payload: { userId, tenantId }
    - [ ] Secret: JWT_SECRET + user password (rotation on password change)
    - [ ] Expiry: 7d
  - [ ] Store refreshToken in DB (optional, for revocation)
  - [ ] Return: { accessToken, refreshToken, user: { id, email, role, tenantId }, tenant: { id, slug } }
  
- [ ] **refreshToken(refreshToken)**:
  - [ ] Verify refreshToken
  - [ ] Get userId, tenantId from token
  - [ ] Generate new accessToken
  - [ ] Return: { accessToken }
  
- [ ] **logout(userId)**:
  - [ ] Remove refreshToken from DB (if stored)
  - [ ] Return success

### Auth Controller (`src/controllers/auth.controller.js`)
- [ ] **POST /auth/login**:
  - [ ] Extract email, password, tenantSlug from body
  - [ ] Validate inputs
  - [ ] Call authService.login()
  - [ ] Return tokens + user info or error
  
- [ ] **POST /auth/logout** (protected):
  - [ ] Extract userId from JWT
  - [ ] Call authService.logout()
  - [ ] Return 204 No Content
  
- [ ] **POST /auth/refresh**:
  - [ ] Extract refreshToken from body
  - [ ] Call authService.refreshToken()
  - [ ] Return new accessToken
  
- [ ] **GET /auth/me** (protected):
  - [ ] Return current user info from token

### Tenant Service (`src/services/tenant.service.js`)
- [ ] **register(companyName, adminEmail, adminPassword, phone)**:
  - [ ] Validate inputs
  - [ ] Check if email already exists (across all tenants)
  - [ ] Generate slug from companyName (or use random)
  - [ ] Hash adminPassword
  - [ ] Create Tenant record
  - [ ] Create User (ADMIN role) for tenant
  - [ ] Return: { tenantId, slug, admin: { email } }
  
- [ ] **getTenant(tenantId)**:
  - [ ] Find tenant by ID
  - [ ] Return tenant details
  
- [ ] **updateTenant(tenantId, data)**:
  - [ ] Update companyName, phone
  - [ ] Return updated tenant
  
- [ ] **getTenantStats(tenantId)**:
  - [ ] Count total customers for tenant
  - [ ] Count total messages sent (SMS + Email)
  - [ ] Return stats

### Tenant Controller (`src/controllers/tenants.controller.js`)
- [ ] **POST /tenants/register**:
  - [ ] Extract from body: companyName, adminEmail, adminPassword, phone
  - [ ] Validate
  - [ ] Call tenantService.register()
  - [ ] Return tenant info or error
  
- [ ] **GET /tenants/:id** (protected):
  - [ ] Check if requesting user's tenantId matches :id (isolation)
  - [ ] Call tenantService.getTenant(:id)
  - [ ] Return tenant
  
- [ ] **PUT /tenants/:id** (protected):
  - [ ] Check isolation
  - [ ] Extract from body: companyName, phone
  - [ ] Validate
  - [ ] Call tenantService.updateTenant(:id, data)
  - [ ] Return updated tenant
  
- [ ] **GET /tenants/:id/stats** (protected):
  - [ ] Check isolation
  - [ ] Call tenantService.getTenantStats(:id)
  - [ ] Return stats

---

## 📋 GIAI ĐOẠN 5: Customer CRUD (Tuần 2-3)

### Customer Service (`src/services/customer.service.js`)
- [ ] **createCustomer(tenantId, data)**:
  - [ ] Validate: fullName, phone, email
  - [ ] Check email unique within tenant
  - [ ] Check phone unique within tenant
  - [ ] Create Customer record
  - [ ] Return customer
  
- [ ] **getCustomers(tenantId, query, pagination)**:
  - [ ] Filter by tenantId
  - [ ] Search by fullName, phone, email (query parameter)
  - [ ] Pagination: page, limit
  - [ ] Sort by: fullName, createdAt (optional)
  - [ ] Return: { data: [], total, page, limit }
  
- [ ] **getCustomerById(tenantId, customerId)**:
  - [ ] Find customer by ID
  - [ ] Verify it belongs to tenantId
  - [ ] Return customer or error
  
- [ ] **updateCustomer(tenantId, customerId, data)**:
  - [ ] Find customer
  - [ ] Check isolation
  - [ ] Validate new data
  - [ ] Check email/phone uniqueness (excluding current customer)
  - [ ] Update record
  - [ ] Return updated customer
  
- [ ] **deleteCustomer(tenantId, customerId)**:
  - [ ] Find customer
  - [ ] Check isolation
  - [ ] Delete customer
  - [ ] Return 204 or success message
  
- [ ] **bulkCreateCustomers(tenantId, dataArray)**:
  - [ ] Validate each record
  - [ ] Check for duplicates within array
  - [ ] Check for existing duplicates in DB
  - [ ] Use Prisma.createMany() for batch insert
  - [ ] Return: { createdCount }

### Customer Validator (`src/validators/customer.validator.js`)
- [ ] **validateCustomerInput(data)**:
  - [ ] fullName: required, string, 2-100 chars
  - [ ] phone: required, valid phone format (regex or library)
  - [ ] email: required, valid email format
  - [ ] address: optional, string, max 500 chars
  - [ ] Return: { valid: true/false, errors: [] }

### Customer Controller (`src/controllers/customers.controller.js`)
- [ ] **GET /customers** (protected):
  - [ ] Extract from query: q (search), page, limit, sort
  - [ ] Call customerService.getCustomers()
  - [ ] Return customers or error
  
- [ ] **POST /customers** (protected):
  - [ ] Extract from body: fullName, address, phone, email
  - [ ] Validate using validator
  - [ ] Call customerService.createCustomer()
  - [ ] Return created customer (201) or error
  
- [ ] **GET /customers/:id** (protected):
  - [ ] Extract tenantId from JWT
  - [ ] Call customerService.getCustomerById(tenantId, :id)
  - [ ] Return customer or error
  
- [ ] **PUT /customers/:id** (protected):
  - [ ] Extract tenantId from JWT
  - [ ] Extract from body: fullName, address, phone, email
  - [ ] Validate
  - [ ] Call customerService.updateCustomer()
  - [ ] Return updated customer or error
  
- [ ] **DELETE /customers/:id** (protected):
  - [ ] Extract tenantId from JWT
  - [ ] Call customerService.deleteCustomer()
  - [ ] Return 204 or error
  
- [ ] **POST /customers/bulk** (protected):
  - [ ] Extract from body: array of customer objects
  - [ ] Validate each
  - [ ] Call customerService.bulkCreateCustomers()
  - [ ] Return createdCount or error

---

## 📋 GIAI ĐOẠN 6: Twilio SMS Integration (Tuần 3-4)

### Twilio Configuration (`src/config/providers.js`)
- [ ] Import Twilio SDK
- [ ] Initialize client:
  ```javascript
  const client = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  ```
- [ ] Export for use in services

### Twilio Service (`src/services/twilio.service.js`)
- [ ] **sendSMS(toNumber, content)**:
  - [ ] Validate phone number (basic format check)
  - [ ] Call Twilio SDK:
    ```javascript
    const message = await client.messages.create({
      body: content,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber
    });
    ```
  - [ ] Return: { messageId: message.sid, status: message.status }
  - [ ] Handle errors:
    - [ ] Invalid number → throw AppError with message
    - [ ] Low credits → throw AppError
    - [ ] Network error → throw AppError with retry suggestion
  
- [ ] **sendBatchSMS(numbers[], content)**:
  - [ ] Loop through numbers
  - [ ] For each, call sendSMS()
  - [ ] Track success/failure
  - [ ] Return: { success: [], failed: [] }
  
- [ ] **handleWebhook(payload)**:
  - [ ] Parse Twilio webhook payload
  - [ ] Extract messageId (SID), status, errorCode
  - [ ] Map status: "sent" → SENT, "delivered" → DELIVERED, "failed" → FAILED
  - [ ] Return parsed data for controller to update MessageLog

### Twilio Testing
- [ ] Test single SMS send:
  - [ ] Create test endpoint: `POST /test/send-sms`
  - [ ] Send to your phone number
  - [ ] Verify SMS received on phone
  - [ ] Check Twilio console for message logs
  
- [ ] Test batch SMS:
  - [ ] Send to 3-5 numbers
  - [ ] Verify all received
  
- [ ] Test error handling:
  - [ ] Send to invalid phone → catch error, return proper response
  - [ ] Simulate low credits (can't test real, but code path exists)

---

## 📋 GIAI ĐOẠN 7: SendGrid Email Integration (Tuần 4)

### SendGrid Configuration (`src/config/providers.js`)
- [ ] Import SendGrid SDK
- [ ] Initialize client:
  ```javascript
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  ```
- [ ] Export for use in services

### SendGrid Service (`src/services/sendgrid.service.js`)
- [ ] **sendEmail(toEmail, subject, content)**:
  - [ ] Validate email format
  - [ ] Create message object:
    ```javascript
    const msg = {
      to: toEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: subject,
      html: content
    };
    ```
  - [ ] Call SendGrid SDK: `await sgMail.send(msg)`
  - [ ] Extract messageId from response
  - [ ] Return: { messageId, status: "queued" }
  - [ ] Handle errors:
    - [ ] Invalid email → throw AppError
    - [ ] Invalid API key → throw AppError
    - [ ] Network error → throw AppError
  
- [ ] **sendBatchEmail(emails[], subject, content)**:
  - [ ] Loop through emails
  - [ ] For each, call sendEmail()
  - [ ] Track success/failure
  - [ ] Return: { success: [], failed: [] }
  
- [ ] **handleWebhook(payload)**:
  - [ ] Parse SendGrid webhook payload
  - [ ] Extract messageId, event type (delivered, opened, bounced, etc.)
  - [ ] Map event: "delivered" → DELIVERED, "bounce" → BOUNCED
  - [ ] Return parsed data

### SendGrid Testing
- [ ] Test single email send:
  - [ ] Create test endpoint: `POST /test/send-email`
  - [ ] Send to real email (Gmail, Outlook, etc.)
  - [ ] Verify email received in inbox
  
- [ ] Test batch email:
  - [ ] Send to 3 different emails
  - [ ] Verify all received
  
- [ ] Test error handling:
  - [ ] Send to invalid email format → catch error
  - [ ] Invalid API key (test in code review)

---

## 📋 GIAI ĐOẠN 8: Messaging Endpoints (Tuần 4-5)

### Message Service (`src/services/message.service.js`)
- [ ] **sendSMS(tenantId, customerId, content)**:
  - [ ] Fetch customer by ID (verify belongs to tenant)
  - [ ] Validate content (not empty, max length)
  - [ ] Create Message record in DB (status: PENDING)
  - [ ] Call twilioService.sendSMS(customer.phone, content)
  - [ ] On success/failure, update Message status
  - [ ] Create MessageLog entry
  - [ ] Return: { messageId: message.id, status: message.status }
  
- [ ] **sendBatchSMS(tenantId, customerIds[], content)**:
  - [ ] Fetch all customers (verify all belong to tenant)
  - [ ] Create Message records for each (PENDING)
  - [ ] Call twilioService.sendBatchSMS(phones[], content)
  - [ ] Update Message statuses based on results
  - [ ] Create MessageLog entries
  - [ ] Return: { batchId, queued: count, total: count }
  
- [ ] **sendEmail(tenantId, customerId, subject, content)**:
  - [ ] Similar to sendSMS but with email
  - [ ] Fetch customer.email
  - [ ] Call sendgridService.sendEmail()
  - [ ] Save Message + MessageLog
  
- [ ] **sendBatchEmail(tenantId, customerIds[], subject, content)**:
  - [ ] Similar to sendBatchSMS
  
- [ ] **getMessageLogs(tenantId, filter, pagination)**:
  - [ ] Filter by tenantId, type (SMS/EMAIL), status
  - [ ] Support date range filter
  - [ ] Pagination
  - [ ] Return: { data: [], total, page, limit }
  
- [ ] **getMessageLogById(tenantId, logId)**:
  - [ ] Find log
  - [ ] Verify it belongs to tenant (join with Message > Customer)
  - [ ] Return log with full details

### Message Validator (`src/validators/message.validator.js`)
- [ ] **validateSMS(customerId, content)**:
  - [ ] content: required, string, 1-160 chars (warn if > 160)
  - [ ] customerId: required, valid ID
  
- [ ] **validateEmail(customerId, subject, content)**:
  - [ ] subject: required, string, 1-100 chars
  - [ ] content: required, string, 1-5000 chars
  - [ ] customerId: required

### Message Controller (`src/controllers/messages.controller.js`)
- [ ] **POST /messages/sms** (protected):
  - [ ] Extract from body: customerId, content
  - [ ] Validate
  - [ ] Call messageService.sendSMS()
  - [ ] Return: { messageId, status } (201)
  
- [ ] **POST /messages/sms/batch** (protected, rate limited):
  - [ ] Extract from body: customerIds[], content
  - [ ] Validate (max 100 customers per request?)
  - [ ] Call messageService.sendBatchSMS()
  - [ ] Return: { batchId, queued, total } (201)
  
- [ ] **POST /messages/email** (protected):
  - [ ] Extract from body: customerId, subject, content
  - [ ] Validate
  - [ ] Call messageService.sendEmail()
  - [ ] Return: { messageId, status } (201)
  
- [ ] **POST /messages/email/batch** (protected, rate limited):
  - [ ] Extract from body: customerIds[], subject, content
  - [ ] Validate
  - [ ] Call messageService.sendBatchEmail()
  - [ ] Return: { batchId, queued, total } (201)
  
- [ ] **GET /messages/logs** (protected):
  - [ ] Extract from query: type, status, startDate, endDate, page, limit
  - [ ] Call messageService.getMessageLogs()
  - [ ] Return: { data, total, page, limit }
  
- [ ] **GET /messages/logs/:id** (protected):
  - [ ] Extract tenantId from JWT
  - [ ] Call messageService.getMessageLogById()
  - [ ] Return log or error
  
- [ ] **POST /messages/twilio/webhook** (public, NO auth):
  - [ ] Extract payload from body or query
  - [ ] Verify Twilio signature (security)
  - [ ] Call twilioService.handleWebhook()
  - [ ] Find MessageLog by providerMessageId (SID)
  - [ ] Update status based on webhook data
  - [ ] Return 200 OK (Twilio expects 200 immediately)
  
- [ ] **POST /messages/sendgrid/webhook** (public, NO auth):
  - [ ] Extract payload from body
  - [ ] Verify SendGrid signature (security)
  - [ ] For each event in payload:
    - [ ] Find MessageLog by providerMessageId
    - [ ] Update status/details
  - [ ] Return 200 OK

---

## 📋 GIAI ĐOẠN 9: Webhook Security & Processing (Tuần 4-5)

### Twilio Webhook Security
- [ ] Verify Twilio request signature:
  ```javascript
  const twilio = require('twilio');
  const isValidRequest = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    req.headers['x-twilio-signature'],
    fullUrl,
    req.body
  );
  ```
- [ ] If invalid, return 403 Forbidden
- [ ] Log webhook requests for debugging

### SendGrid Webhook Security
- [ ] Verify SendGrid signature (API key in webhook payload)
- [ ] Check HMAC signature is valid
- [ ] If invalid, return 403 Forbidden

### Webhook Handlers
- [ ] Extract status from webhook:
  - [ ] Twilio: "sent", "delivered", "undelivered", "failed"
  - [ ] SendGrid: "delivered", "open", "bounce", "spamreport"
- [ ] Map to Message status: SENT, DELIVERED, FAILED, etc.
- [ ] Update Message + MessageLog with:
  - [ ] status
  - [ ] timestamp
  - [ ] provider response (raw event)
- [ ] Log webhook processing

---

## 📋 GIAI ĐOẠN 10: Logging & Error Handling (Tuần 3-5)

### Logger Utils (`src/utils/logger.js`)
- [ ] Setup Winston or Pino logger
- [ ] Log levels: debug, info, warn, error
- [ ] Output:
  - [ ] Console (development)
  - [ ] File: `logs/app.log` (append)
  - [ ] File: `logs/error.log` (errors only)
- [ ] Format: timestamp, level, message, context
- [ ] Log rotation: daily or by size

### Error Handling (`src/utils/errors.js`)
- [ ] Create custom `AppError` class:
  ```javascript
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.code = code;
    }
  }
  ```
- [ ] Define error codes: INVALID_INPUT, UNAUTHORIZED, TENANT_NOT_FOUND, etc.
- [ ] Global error middleware catches all errors:
  - [ ] Log error with context
  - [ ] Return JSON error response
  - [ ] Don't expose implementation details in production

### Logging Standards
- [ ] Log at key points:
  - [ ] Request received (method, path, user)
  - [ ] Before DB queries
  - [ ] After action (created, updated, deleted)
  - [ ] Before calling external service (Twilio, SendGrid)
  - [ ] After external service call (success/failure)
  - [ ] Errors with stack trace
- [ ] Include context: userId, tenantId, customerId, timestamp
- [ ] Don't log sensitive data: passwords, tokens, API keys

---

## 📋 GIAI ĐOẠN 11: Database Seed & Migrations (Tuần 5)

### Database Migrations
- [ ] After schema finalized, create migration:
  - [ ] `npx prisma migrate dev --name init`
  - [ ] Review generated migration SQL
  - [ ] Test migration rollback: `npx prisma migrate resolve --rolled-back init` (or manual)
  - [ ] Ensure schema is correct in Prisma Studio (optional): `npx prisma studio`

### Seed Data (`prisma/seed.js`)
- [ ] Create sample data for testing:
  - [ ] Sample Tenant: "Acme Corp"
  - [ ] Sample User: admin@acme.com (password: password123)
  - [ ] Sample Customers: 5-10 customers for Acme
  - [ ] Sample Messages: A few test messages (from past)
- [ ] Script should:
  - [ ] Check if data exists (to avoid duplicates on re-run)
  - [ ] Hash password before saving
  - [ ] Create other records as needed
- [ ] Run seed: `npm run prisma:seed`
- [ ] Verify data in database

---

## 📋 GIAI ĐOẠN 12: Health Check & Monitoring (Tuần 5)

### Health Check Endpoint
- [ ] **GET /health** (public, no auth):
  - [ ] Check app is running
  - [ ] Check database connection
  - [ ] Check external services (optional):
    - [ ] Twilio API reachability
    - [ ] SendGrid API reachability
  - [ ] Return: `{ status: "ok", timestamp, db: "connected", services: {...} }`
  - [ ] Return 200 OK if healthy, 503 if not

### Metrics Endpoint (Optional)
- [ ] **GET /metrics** (public):
  - [ ] Return Prometheus format metrics
  - [ ] Or just JSON with stats
  - [ ] Include: request count, error rate, DB query time, etc.

### Error Tracking (Optional)
- [ ] Setup Sentry or similar for error tracking
- [ ] Capture unhandled exceptions
- [ ] Alert on critical errors

---

## 📋 GIAI ĐOẠN 13: Docker & Environment (Tuần 5)

### Dockerfile for Backend
- [ ] Create `Dockerfile`:
  ```dockerfile
  FROM node:18-alpine
  WORKDIR /app
  COPY package.json package-lock.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 5000
  HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node healthcheck.js
  CMD ["node", "src/server.js"]
  ```

### Build & Test Locally
- [ ] `docker build -t backend:v1 .`
- [ ] `docker run -p 5000:5000 --env-file .env backend:v1`
- [ ] Test health: `curl http://localhost:5000/api/v1/health`
- [ ] Test endpoints work

### Environment Variables
- [ ] All sensitive values in .env (NOT in code)
- [ ] Document in .env.example
- [ ] In production, loaded from AWS Secrets Manager or ECS Task Def

---

## 📋 GIAI ĐOẠN 14: Testing (Tuần 5-6)

### Unit Testing (Optional)
- [ ] Setup Jest + Supertest
- [ ] Write tests for:
  - [ ] Auth logic (login, token generation)
  - [ ] Services (customer CRUD, messaging)
  - [ ] Validators (input validation)
  - [ ] Error handling

### Integration Testing
- [ ] Test with real database (test DB):
  - [ ] Create connection to test DB
  - [ ] Seed test data
  - [ ] Run tests
  - [ ] Clean up after
- [ ] Test workflows:
  - [ ] Register tenant → Login → Create customer → Send SMS → View logs
  - [ ] Error scenarios (invalid input, duplicate email, etc.)

### Manual Testing with Postman/cURL
- [ ] Test all endpoints:
  - [ ] POST `/tenants/register` - create new tenant
  - [ ] POST `/auth/login` - login, get tokens
  - [ ] GET `/customers` - empty list initially
  - [ ] POST `/customers` - create customer
  - [ ] GET `/customers` - customer appears
  - [ ] POST `/messages/sms` - send SMS
  - [ ] GET `/messages/logs` - message appears with status
  - [ ] etc.
- [ ] Test error scenarios:
  - [ ] Missing fields → 400 Bad Request
  - [ ] Invalid email → 400 Bad Request
  - [ ] Not authenticated → 401 Unauthorized
  - [ ] Not authorized (wrong tenant) → 403 Forbidden
  - [ ] Resource not found → 404 Not Found
  - [ ] Rate limit hit → 429 Too Many Requests
  - [ ] Server error → 500 Internal Server Error

### CORS & Security Testing
- [ ] Frontend can call endpoints (CORS enabled)
- [ ] Only authorized users can access protected endpoints
- [ ] User A cannot access user B's data (multi-tenant isolation)
- [ ] Sensitive data not leaked in error messages
- [ ] API keys/tokens not exposed in logs/errors

---

## ✅ SUCCESS CRITERIA FOR BACKEND

- [ ] All 6 API endpoint groups fully implemented (Tenants, Auth, Customers, Messaging, Logs, Health)
- [ ] Multi-tenant isolation enforced (user A ≠ user B data)
- [ ] JWT authentication working (login, token refresh, protected routes)
- [ ] Database schema created, migrations working
- [ ] Twilio SMS integration:
  - [ ] Single SMS sends
  - [ ] Batch SMS sends
  - [ ] Webhook updates status
- [ ] SendGrid Email integration:
  - [ ] Single email sends
  - [ ] Batch email sends
  - [ ] Webhook updates status
- [ ] Input validation all endpoints
- [ ] Error handling with proper HTTP status codes
- [ ] Logging & monitoring setup
- [ ] Docker image builds without errors
- [ ] Docker container runs and responds at http://localhost:5000/api/v1/health
- [ ] All workflows tested (integration testing passed)
- [ ] Code clean, documented, ready for deployment

---

## 📝 NOTES FOR THIS PERSON

1. **Coordinate with Frontend**: Finalize API contracts in W1-2 (endpoints.md is draft, confirm changes early)
2. **Database First**: Design schema well in W1, avoid major changes later (migrations can be painful)
3. **Test SMS/Email Early**: Get Twilio & SendGrid webhooks working by W3-4, not W5
4. **Security**: JWT secret strong, API keys in .env (not code), validate/sanitize inputs, rate limit
5. **Error Messages**: User-friendly but don't expose sensitive details (e.g., "Email already exists" vs "Database error")
6. **Logging**: Log important events, use structured logging (timestamp, context, level)
7. **Database Performance**: Index tenantId, email, phone for faster queries
8. **Rate Limiting**: Essential for SMS/Email endpoints (prevent abuse/spam)
9. **Async Operations**: Consider job queue (Bull, Kue) for batch sends if >1000 at once (Phase 2)
10. **Documentation**: Comment complex logic, document API responses, keep README updated

---

## 📅 WEEK-BY-WEEK BREAKDOWN

| Week | Focus | Output | Sync Point |
|------|-------|--------|-----------|
| W1 | Setup, DB schema, Auth endpoints | Auth working, can login | DB schema final? |
| W2 | Tenant + Customer CRUD | Customers CRUD endpoints ready | API ready for Frontend? |
| W3 | Twilio + SendGrid integration | SMS/Email send working | External services ready? |
| W4 | Webhooks, Messaging API | Full messaging flows | Integration testing with Frontend? |
| W5 | Logging, error handling, Docker | Docker image builds, all tests pass | Ready to deploy? |
| W6 | Integration testing, deployment | API deployed to AWS, tested end-to-end | Final UAT |

