# CHECKLIST 2: BACKEND DEVELOPER (Node.js/Express + Prisma)

**Người đảm trách:** Backend Developer
**Mục tiêu:** Xây dựng RESTful API hoàn chỉnh, multi-tenant, kết nối database + external services
**Công nghệ:** Node.js, Express, Prisma ORM, JWT, MySQL, Docker
**Thời gian dự kiến:** 6 tuần

---

## GIAI ĐOẠN 1: Chuẩn bị & Thiết lập (Tuần 1)

### Project Setup

- [x] Khởi tạo Node.js project: `npm init -y`
- [x] Tạo `.gitignore` (node_modules, .env, logs, dist, coverage)
- [x] Cài Dependencies:
- [x] `npm install express`
- [x] `npm install @prisma/client prisma`
- [x] `npm install jsonwebtoken`
- [x] `npm install bcryptjs` (password hashing)
- [x] `npm install dotenv` (environment variables)
- [x] `npm install cors` (CORS headers)
- [x] `npm install twilio` (SMS)
- [x] `npm install @sendgrid/mail` (Email)
- [x] `npm install express-rate-limit` (Rate limiting)
- [x] `npm install joi` hoặc `yup` (Validation)
- [x] `npm install uuid` (ID generation)
- [x] Cài Dev Dependencies:
- [x] `npm install -D nodemon` (auto-reload)
- [x] `npm install -D eslint prettier` (linting)
- [x] Cấu hình package.json scripts:

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

- [x] Tạo thư mục cấu trúc:

 ```plaintext
 backend/
 ├─ src/
 │ ├─ app.js # Express app
 │ ├─ server.js # Server entry point
 │ ├─ config/
 │ │ ├─ env.js # Environment variables
 │ │ ├─ db.js # Prisma Client Singleton
 │ │ └─ providers.js # Twilio & SendGrid config
 │ ├─ routes/
 │ │ ├─ tenants.routes.js
 │ │ ├─ auth.routes.js
 │ │ ├─ customers.routes.js
 │ │ ├─ messages.routes.js
 │ │ ├─ logs.routes.js
 │ │ └─ health.routes.js
 │ ├─ controllers/
 │ │ ├─ tenants.controller.js
 │ │ ├─ auth.controller.js
 │ │ ├─ customers.controller.js
 │ │ ├─ messages.controller.js
 │ │ └─ logs.controller.js
 │ ├─ services/
 │ │ ├─ twilio.service.js
 │ │ ├─ sendgrid.service.js
 │ │ ├─ tenant.service.js
 │ │ ├─ customer.service.js
 │ │ └─ message.service.js
 │ ├─ middlewares/
 │ │ ├─ auth.middleware.js
 │ │ ├─ tenant.middleware.js
 │ │ └─ ratelimit.middleware.js
 │ ├─ validators/
 │ │ ├─ customer.validator.js
 │ │ └─ message.validator.js
 │ ├─ utils/
 │ │ ├─ logger.js
 │ │ ├─ errors.js
 │ │ └─ formatters.js
 │ └─ jobs/
 │ └─ (batch jobs if needed)
 ├─ prisma/
 │ ├─ schema.prisma
 │ ├─ migrations/
 │ └─ seed.js
 ├─ Dockerfile
 ├─ package.json
 ├─ .env.example
 └─ .gitignore
 ```

### Environment Variables

- [x] Tạo `.env.example`:

 ```env
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

- [x] Tạo `.env` file cho development (KHÔNG commit)
- [x] Cấu hình env variables (`src/config/env.js`):
- [x] Read từ .env
- [x] Provide default values nếu cần
- [x] Validate required variables

---

## GIAI ĐOẠN 2: Database Schema & Prisma (Tuần 1)

### Prisma Schema Design (`prisma/schema.prisma`)

- [x] Setup datasource:

 ```prisma
 datasource db {
 provider = "mysql"
 url = env("DATABASE_URL")
 }
 ```

- [x] Setup generator:

 ```prisma
 generator client {
 provider = "prisma-client-js"
 }
 ```

### Models & Schema

- [x] **Tenant** model:
- [x] id (String, @id, @default(cuid()))
- [x] companyName (String, required)
- [x] slug (String, @unique, required) - for subdomain/routing
- [x] phone (String)
- [x] createdAt (DateTime, @default(now()))
- [x] updatedAt (DateTime, @updatedAt)
- [x] Relations: users[], customers[], messages[], messageLogs[]

- [x] **User** model:
- [x] id (String, @id, @default(cuid()))
- [x] email (String, @unique, required)
- [x] password (String, required) - hashed
- [x] fullName (String)
- [x] role (Enum: ADMIN, STAFF) - @default(STAFF)
- [x] tenantId (String, FK to Tenant)
- [x] createdAt (DateTime, @default(now()))
- [x] updatedAt (DateTime, @updatedAt)
- [x] Relations: tenant, refreshTokens[]

- [x] **Customer** model:
- [x] id (String, @id, @default(cuid()))
- [x] tenantId (String, FK to Tenant)
- [x] fullName (String, required)
- [x] address (String)
- [x] phone (String, required)
- [x] email (String, required)
- [x] createdAt (DateTime, @default(now()))
- [x] updatedAt (DateTime, @updatedAt)
- [x] @@unique([tenantId, email]) - email unique per tenant
- [x] @@unique([tenantId, phone]) - phone unique per tenant
- [x] Relations: messages[], messageLogs[]

- [x] **Message** model:
- [x] id (String, @id, @default(cuid()))
- [x] tenantId (String, FK to Tenant)
- [x] customerId (String, FK to Customer)
- [x] type (Enum: SMS, EMAIL)
- [x] content (String, required)
- [x] subject (String) - for email only
- [x] status (Enum: PENDING, SENT, DELIVERED, FAILED) - @default(PENDING)
- [x] recipientPhone (String) - denormalized, for logging
- [x] recipientEmail (String) - denormalized, for logging
- [x] createdAt (DateTime, @default(now()))
- [x] sentAt (DateTime)
- [x] Relations: messageLogs[]

- [x] **MessageLog** model:
- [x] id (String, @id, @default(cuid()))
- [x] messageId (String, FK to Message)
- [x] status (Enum: PENDING, SENT, DELIVERED, FAILED, BOUNCED)
- [x] providerMessageId (String) - from Twilio/SendGrid
- [x] providerResponse (Json) - store provider response as JSON
- [x] errorReason (String) - why it failed
- [x] timestamp (DateTime, @default(now()))
- [x] updatedAt (DateTime, @updatedAt)

- [x] **AuditLog** model (optional, for compliance):
- [x] id (String, @id, @default(cuid()))
- [x] tenantId (String, FK to Tenant)
- [x] userId (String, FK to User)
- [x] action (String) - "CREATE_CUSTOMER", "SEND_SMS", etc
- [x] resourceType (String) - "Customer", "Message"
- [x] resourceId (String)
- [x] changes (Json) - what changed
- [x] timestamp (DateTime, @default(now()))

### Setup Database Connection

- [x] Cấu hình MySQL connection (AWS RDS hoặc local)
- [x] Test connection: `npx prisma db push` (tạo schema mà không cần migration)
- [x] Hoặc `npx prisma migrate dev --name init` (tạo migration)
- [x] Verify tables created in database

### Prisma Client Singleton (`src/config/db.js`)

- [x] Implement Singleton pattern để tránh multiple client instances:

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

## GIAI ĐOẠN 3: Express App & Middleware (Tuần 1-2)

### Express App Setup (`src/app.js`)

- [x] Import Express, CORS, middlewares
- [x] Create Express app
- [x] Setup middlewares:

 ```javascript
 app.use(cors());
 app.use(express.json());
 app.use(express.urlencoded({ extended: true }));
 ```

- [x] Setup routes:
- [x] `app.use('/api/v1/health', require('./routes/health.routes'));`
- [x] `app.use('/api/v1/tenants', require('./routes/tenants.routes'));`
- [x] `app.use('/api/v1/auth', require('./routes/auth.routes'));`
- [x] `app.use('/api/v1/customers', require('./routes/customers.routes'));`
- [x] `app.use('/api/v1/messages', require('./routes/messages.routes'));`
- [x] `app.use('/api/v1/logs', require('./routes/logs.routes'));`
- [x] Setup error handling middleware (catch-all at end)
- [x] Export app

### Server Entry Point (`src/server.js`)

- [x] Import app
- [x] Start server: `app.listen(PORT, ...)`
- [x] Log: "Server running on port 5000"
- [x] Graceful shutdown: Handle SIGTERM, close DB connection

### Auth Middleware (`src/middlewares/auth.middleware.js`)

- [x] Extract JWT token from Authorization header: `Bearer <token>`
- [x] Verify token using JWT_SECRET
- [x] Extract userId, tenantId from token
- [x] Set `req.user = { userId, tenantId }`
- [x] Next() or throw 401 Unauthorized
- [x] Handle expired token: throw 401 (let refresh endpoint handle refresh)

### Tenant Middleware (`src/middlewares/tenant.middleware.js`)

- [x] Verify `req.user.tenantId` exists (user must be authenticated)
- [x] Add `req.tenantId = req.user.tenantId` to all requests
- [x] All DB queries should filter by tenantId automatically
- [x] Prevent tenant A from accessing data of tenant B

### Rate Limit Middleware (`src/middlewares/ratelimit.middleware.js`)

- [x] Use `express-rate-limit`:
- [x] General limit: 100 requests per 15 minutes per IP
- [x] Messaging endpoints: 10 requests per minute per user (to prevent spam)
- [x] Return 429 Too Many Requests with Retry-After header

### Error Handler Middleware

- [x] Catch all errors
- [x] Log error (with context)
- [x] Return error response:
- [x] 400 Bad Request (validation error)
- [x] 401 Unauthorized (auth failure)
- [x] 403 Forbidden (not allowed)
- [x] 404 Not Found
- [x] 429 Too Many Requests (rate limit)
- [x] 500 Internal Server Error (unexpected error)
- [x] Response format: `{ error: "message", code: "ERROR_CODE", details: {...} }`

---

## GIAI ĐOẠN 4: Authentication & Tenant Management (Tuần 2)

### Auth Service (`src/services/auth.service.js`)

- [x] **login(email, password, tenantSlug)**:
- [x] Find user by email + tenantSlug (join with Tenant)
- [x] Verify password using bcrypt.compare()
- [x] Generate accessToken (15 min):
- [x] Payload: { userId, tenantId, email }
- [x] Secret: JWT_SECRET
- [x] Expiry: 15m
- [x] Generate refreshToken (7 days):
- [x] Payload: { userId, tenantId }
- [x] Secret: JWT_SECRET + user password (rotation on password change)
- [x] Expiry: 7d
- [x] Store refreshToken in DB (optional, for revocation)
- [x] Return: { accessToken, refreshToken, user: { id, email, role, tenantId }, tenant: { id, slug } }

- [x] **refreshToken(refreshToken)**:
- [x] Verify refreshToken
- [x] Get userId, tenantId from token
- [x] Generate new accessToken
- [x] Return: { accessToken }

- [x] **logout(userId)**:
- [x] Remove refreshToken from DB (if stored)
- [x] Return success

### Auth Controller (`src/controllers/auth.controller.js`)

- [x] **POST /auth/login**:
- [x] Extract email, password, tenantSlug from body
- [x] Validate inputs
- [x] Call authService.login()
- [x] Return tokens + user info or error

- [x] **POST /auth/logout** (protected):
- [x] Extract userId from JWT
- [x] Call authService.logout()
- [x] Return 204 No Content

- [x] **POST /auth/refresh**:
- [x] Extract refreshToken from body
- [x] Call authService.refreshToken()
- [x] Return new accessToken

- [x] **GET /auth/me** (protected):
- [x] Return current user info from token

### Tenant Service (`src/services/tenant.service.js`)

- [x] **register(companyName, adminEmail, adminPassword, phone)**:
- [x] Validate inputs
- [x] Check if email already exists (across all tenants)
- [x] Generate slug from companyName (or use random)
- [x] Hash adminPassword
- [x] Create Tenant record
- [x] Create User (ADMIN role) for tenant
- [x] Return: { tenantId, slug, admin: { email } }

- [x] **getTenant(tenantId)**:
- [x] Find tenant by ID
- [x] Return tenant details

- [x] **updateTenant(tenantId, data)**:
- [x] Update companyName, phone
- [x] Return updated tenant

- [x] **getTenantStats(tenantId)**:
- [x] Count total customers for tenant
- [x] Count total messages sent (SMS + Email)
- [x] Return stats

### Tenant Controller (`src/controllers/tenants.controller.js`)

- [x] **POST /tenants/register**:
- [x] Extract from body: companyName, adminEmail, adminPassword, phone
- [x] Validate
- [x] Call tenantService.register()
- [x] Return tenant info or error

- [x] **GET /tenants/:id** (protected):
- [x] Check if requesting user's tenantId matches :id (isolation)
- [x] Call tenantService.getTenant(:id)
- [x] Return tenant

- [x] **PUT /tenants/:id** (protected):
- [x] Check isolation
- [x] Extract from body: companyName, phone
- [x] Validate
- [x] Call tenantService.updateTenant(:id, data)
- [x] Return updated tenant

- [x] **GET /tenants/:id/stats** (protected):
- [x] Check isolation
- [x] Call tenantService.getTenantStats(:id)
- [x] Return stats

---

## GIAI ĐOẠN 5: Customer CRUD (Tuần 2-3)

### Customer Service (`src/services/customer.service.js`)

- [x] **createCustomer(tenantId, data)**:
- [x] Validate: fullName, phone, email
- [x] Check email unique within tenant
- [x] Check phone unique within tenant
- [x] Create Customer record
- [x] Return customer

- [x] **getCustomers(tenantId, query, pagination)**:
- [x] Filter by tenantId
- [x] Search by fullName, phone, email (query parameter)
- [x] Pagination: page, limit
- [x] Sort by: fullName, createdAt (optional)
- [x] Return: { data: [], total, page, limit }

- [x] **getCustomerById(tenantId, customerId)**:
- [x] Find customer by ID
- [x] Verify it belongs to tenantId
- [x] Return customer or error

- [x] **updateCustomer(tenantId, customerId, data)**:
- [x] Find customer
- [x] Check isolation
- [x] Validate new data
- [x] Check email/phone uniqueness (excluding current customer)
- [x] Update record
- [x] Return updated customer

- [x] **deleteCustomer(tenantId, customerId)**:
- [x] Find customer
- [x] Check isolation
- [x] Delete customer
- [x] Return 204 or success message

- [x] **bulkCreateCustomers(tenantId, dataArray)**:
- [x] Validate each record
- [x] Check for duplicates within array
- [x] Check for existing duplicates in DB
- [x] Use Prisma.createMany() for batch insert
- [x] Return: { createdCount }

### Customer Validator (`src/validators/customer.validator.js`)

- [x] **validateCustomerInput(data)**:
- [x] fullName: required, string, 2-100 chars
- [x] phone: required, valid phone format (regex or library)
- [x] email: required, valid email format
- [x] address: optional, string, max 500 chars
- [x] Return: { valid: true/false, errors: [] }

### Customer Controller (`src/controllers/customers.controller.js`)

- [x] **GET /customers** (protected):
- [x] Extract from query: q (search), page, limit, sort
- [x] Call customerService.getCustomers()
- [x] Return customers or error

- [x] **POST /customers** (protected):
- [x] Extract from body: fullName, address, phone, email
- [x] Validate using validator
- [x] Call customerService.createCustomer()
- [x] Return created customer (201) or error

- [x] **GET /customers/:id** (protected):
- [x] Extract tenantId from JWT
- [x] Call customerService.getCustomerById(tenantId, :id)
- [x] Return customer or error

- [x] **PUT /customers/:id** (protected):
- [x] Extract tenantId from JWT
- [x] Extract from body: fullName, address, phone, email
- [x] Validate
- [x] Call customerService.updateCustomer()
- [x] Return updated customer or error

- [x] **DELETE /customers/:id** (protected):
- [x] Extract tenantId from JWT
- [x] Call customerService.deleteCustomer()
- [x] Return 204 or error

- [x] **POST /customers/bulk** (protected):
- [x] Extract from body: array of customer objects
- [x] Validate each
- [x] Call customerService.bulkCreateCustomers()
- [x] Return createdCount or error

---

## GIAI ĐOẠN 6: Twilio SMS Integration (Tuần 3-4)

### Twilio Configuration (`src/config/providers.js`)

- [x] Import Twilio SDK
- [x] Initialize client:

 ```javascript
 const client = require('twilio')(
 process.env.TWILIO_ACCOUNT_SID,
 process.env.TWILIO_AUTH_TOKEN
 );
 ```

- [x] Export for use in services

### Twilio Service (`src/services/twilio.service.js`)

- [x] **sendSMS(toNumber, content)**:
- [x] Validate phone number (basic format check)
- [x] Call Twilio SDK:

 ```javascript
 const message = await client.messages.create({
 body: content,
 from: process.env.TWILIO_PHONE_NUMBER,
 to: toNumber
 });
 ```

- [x] Return: { messageId: message.sid, status: message.status }
- [x] Handle errors:
- [x] Invalid number → throw AppError with message
- [x] Low credits → throw AppError
- [x] Network error → throw AppError with retry suggestion

- [x] **sendBatchSMS(numbers[], content)**:
- [x] Loop through numbers
- [x] For each, call sendSMS()
- [x] Track success/failure
- [x] Return: { success: [], failed: [] }

- [x] **handleWebhook(payload)**:
- [x] Parse Twilio webhook payload
- [x] Extract messageId (SID), status, errorCode
- [x] Map status: "sent" → SENT, "delivered" → DELIVERED, "failed" → FAILED
- [x] Return parsed data for controller to update MessageLog

### Twilio Testing

- [x] Test single SMS send:
- [x] Create test endpoint: `POST /test/send-sms`
- [x] Send to your phone number
- [x] Verify SMS received on phone
- [x] Check Twilio console for message logs

- [x] Test batch SMS:
- [x] Send to 3-5 numbers
- [x] Verify all received

- [x] Test error handling:
- [x] Send to invalid phone → catch error, return proper response
- [x] Simulate low credits (can't test real, but code path exists)

---

## GIAI ĐOẠN 7: SendGrid Email Integration (Tuần 4)

### SendGrid Configuration (`src/config/providers.js`)

- [x] Import SendGrid SDK
- [x] Initialize client:

 ```javascript
 const sgMail = require('@sendgrid/mail');
 sgMail.setApiKey(process.env.SENDGRID_API_KEY);
 ```

- [x] Export for use in services

### SendGrid Service (`src/services/sendgrid.service.js`)

- [x] **sendEmail(toEmail, subject, content)**:
- [x] Validate email format
- [x] Create message object:

 ```javascript
 const msg = {
 to: toEmail,
 from: process.env.SENDGRID_FROM_EMAIL,
 subject: subject,
 html: content
 };
 ```

- [x] Call SendGrid SDK: `await sgMail.send(msg)`
- [x] Extract messageId from response
- [x] Return: { messageId, status: "queued" }
- [x] Handle errors:
- [x] Invalid email → throw AppError
- [x] Invalid API key → throw AppError
- [x] Network error → throw AppError

- [x] **sendBatchEmail(emails[], subject, content)**:
- [x] Loop through emails
- [x] For each, call sendEmail()
- [x] Track success/failure
- [x] Return: { success: [], failed: [] }

- [x] **handleWebhook(payload)**:
- [x] Parse SendGrid webhook payload
- [x] Extract messageId, event type (delivered, opened, bounced, etc.)
- [x] Map event: "delivered" → DELIVERED, "bounce" → BOUNCED
- [x] Return parsed data

### SendGrid Testing

- [x] Test single email send:
- [x] Create test endpoint: `POST /test/send-email`
- [x] Send to real email (Gmail, Outlook, etc.)
- [x] Verify email received in inbox

- [x] Test batch email:
- [x] Send to 3 different emails
- [x] Verify all received

- [x] Test error handling:
- [x] Send to invalid email format → catch error
- [x] Invalid API key (test in code review)

---

## GIAI ĐOẠN 8: Messaging Endpoints (Tuần 4-5)

### Message Service (`src/services/message.service.js`)

- [x] **sendSMS(tenantId, customerId, content)**:
- [x] Fetch customer by ID (verify belongs to tenant)
- [x] Validate content (not empty, max length)
- [x] Create Message record in DB (status: PENDING)
- [x] Call twilioService.sendSMS(customer.phone, content)
- [x] On success/failure, update Message status
- [x] Create MessageLog entry
- [x] Return: { messageId: message.id, status: message.status }

- [x] **sendBatchSMS(tenantId, customerIds[], content)**:
- [x] Fetch all customers (verify all belong to tenant)
- [x] Create Message records for each (PENDING)
- [x] Call twilioService.sendBatchSMS(phones[], content)
- [x] Update Message statuses based on results
- [x] Create MessageLog entries
- [x] Return: { batchId, queued: count, total: count }

- [x] **sendEmail(tenantId, customerId, subject, content)**:
- [x] Similar to sendSMS but with email
- [x] Fetch customer.email
- [x] Call sendgridService.sendEmail()
- [x] Save Message + MessageLog

- [x] **sendBatchEmail(tenantId, customerIds[], subject, content)**:
- [x] Similar to sendBatchSMS

- [x] **getMessageLogs(tenantId, filter, pagination)**:
- [x] Filter by tenantId, type (SMS/EMAIL), status
- [x] Support date range filter
- [x] Pagination
- [x] Return: { data: [], total, page, limit }

- [x] **getMessageLogById(tenantId, logId)**:
- [x] Find log
- [x] Verify it belongs to tenant (join with Message > Customer)
- [x] Return log with full details

### Message Validator (`src/validators/message.validator.js`)

- [x] **validateSMS(customerId, content)**:
- [x] content: required, string, 1-160 chars (warn if > 160)
- [x] customerId: required, valid ID

- [x] **validateEmail(customerId, subject, content)**:
- [x] subject: required, string, 1-100 chars
- [x] content: required, string, 1-5000 chars
- [x] customerId: required

### Message Controller (`src/controllers/messages.controller.js`)

- [x] **POST /messages/sms** (protected):
- [x] Extract from body: customerId, content
- [x] Validate
- [x] Call messageService.sendSMS()
- [x] Return: { messageId, status } (201)

- [x] **POST /messages/sms/batch** (protected, rate limited):
- [x] Extract from body: customerIds[], content
- [x] Validate (max 100 customers per request?)
- [x] Call messageService.sendBatchSMS()
- [x] Return: { batchId, queued, total } (201)

- [x] **POST /messages/email** (protected):
- [x] Extract from body: customerId, subject, content
- [x] Validate
- [x] Call messageService.sendEmail()
- [x] Return: { messageId, status } (201)

- [x] **POST /messages/email/batch** (protected, rate limited):
- [x] Extract from body: customerIds[], subject, content
- [x] Validate
- [x] Call messageService.sendBatchEmail()
- [x] Return: { batchId, queued, total } (201)

- [x] **GET /messages/logs** (protected):
- [x] Extract from query: type, status, startDate, endDate, page, limit
- [x] Call messageService.getMessageLogs()
- [x] Return: { data, total, page, limit }

- [x] **GET /messages/logs/:id** (protected):
- [x] Extract tenantId from JWT
- [x] Call messageService.getMessageLogById()
- [x] Return log or error

- [x] **POST /messages/twilio/webhook** (public, NO auth):
- [x] Extract payload from body or query
- [x] Verify Twilio signature (security)
- [x] Call twilioService.handleWebhook()
- [x] Find MessageLog by providerMessageId (SID)
- [x] Update status based on webhook data
- [x] Return 200 OK (Twilio expects 200 immediately)

- [x] **POST /messages/sendgrid/webhook** (public, NO auth):
- [x] Extract payload from body
- [x] Verify SendGrid signature (security)
- [x] For each event in payload:
- [x] Find MessageLog by providerMessageId
- [x] Update status/details
- [x] Return 200 OK

---

## GIAI ĐOẠN 9: Webhook Security & Processing (Tuần 4-5)

### Twilio Webhook Security

- [x] Verify Twilio request signature:

 ```javascript
 const twilio = require('twilio');
 const isValidRequest = twilio.validateRequest(
 process.env.TWILIO_AUTH_TOKEN,
 req.headers['x-twilio-signature'],
 fullUrl,
 req.body
 );
 ```

- [x] If invalid, return 403 Forbidden
- [x] Log webhook requests for debugging

### SendGrid Webhook Security

- [x] Verify SendGrid signature (API key in webhook payload)
- [x] Check HMAC signature is valid
- [x] If invalid, return 403 Forbidden

### Webhook Handlers

- [x] Extract status from webhook:
- [x] Twilio: "sent", "delivered", "undelivered", "failed"
- [x] SendGrid: "delivered", "open", "bounce", "spamreport"
- [x] Map to Message status: SENT, DELIVERED, FAILED, etc.
- [x] Update Message + MessageLog with:
- [x] status
- [x] timestamp
- [x] provider response (raw event)
- [x] Log webhook processing

---

## GIAI ĐOẠN 10: Logging & Error Handling (Tuần 3-5)

### Logger Utils (`src/utils/logger.js`)

- [x] Setup Winston or Pino logger
- [x] Log levels: debug, info, warn, error
- [x] Output:
- [x] Console (development)
- [x] File: `logs/app.log` (append)
- [x] File: `logs/error.log` (errors only)
- [x] Format: timestamp, level, message, context
- [x] Log rotation: daily or by size

### Error Handling (`src/utils/errors.js`)

- [x] Create custom `AppError` class:

 ```javascript
 class AppError extends Error {
 constructor(message, statusCode) {
 super(message);
 this.statusCode = statusCode;
 this.code = code;
 }
 }
 ```

- [x] Define error codes: INVALID_INPUT, UNAUTHORIZED, TENANT_NOT_FOUND, etc.
- [x] Global error middleware catches all errors:
- [x] Log error with context
- [x] Return JSON error response
- [x] Don't expose implementation details in production

### Logging Standards

- [x] Log at key points:
- [x] Request received (method, path, user)
- [x] Before DB queries
- [x] After action (created, updated, deleted)
- [x] Before calling external service (Twilio, SendGrid)
- [x] After external service call (success/failure)
- [x] Errors with stack trace
- [x] Include context: userId, tenantId, customerId, timestamp
- [x] Don't log sensitive data: passwords, tokens, API keys

---

## GIAI ĐOẠN 11: Database Seed & Migrations (Tuần 5)

### Database Migrations

- [x] After schema finalized, create migration:
- [x] `npx prisma migrate dev --name init`
- [x] Review generated migration SQL
- [x] Test migration rollback: `npx prisma migrate resolve --rolled-back init` (or manual)
- [x] Ensure schema is correct in Prisma Studio (optional): `npx prisma studio`

### Seed Data (`prisma/seed.js`)

- [x] Create sample data for testing:
- [x] Sample Tenant: "Acme Corp"
- [x] Sample User: <admin@acme.com> (password: password123)
- [x] Sample Customers: 5-10 customers for Acme
- [x] Sample Messages: A few test messages (from past)
- [x] Script should:
- [x] Check if data exists (to avoid duplicates on re-run)
- [x] Hash password before saving
- [x] Create other records as needed
- [x] Run seed: `npm run prisma:seed`
- [x] Verify data in database

---

## GIAI ĐOẠN 12: Health Check & Monitoring (Tuần 5)

### Health Check Endpoint

- [x] **GET /health** (public, no auth):
- [x] Check app is running
- [x] Check database connection
- [x] Check external services (optional):
- [x] Twilio API reachability
- [x] SendGrid API reachability
- [x] Return: `{ status: "ok", timestamp, db: "connected", services: {...} }`
- [x] Return 200 OK if healthy, 503 if not
- [x] **GET /health/liveness** — lightweight probe (always 200 if process alive)
- [x] **GET /health/readiness** — DB-dependent readiness probe (200/503)
- [x] Docker healthcheck.js script (used by HEALTHCHECK in Dockerfile)

### Metrics Endpoint (Optional)

- [x] **GET /health/metrics** (public):
- [x] JSON format metrics
- [x] Include: request count, error rate (4xx/5xx), DB query latency
- [x] Include: memory (rss, heap), CPU, uptime, node version
- [x] In-memory counters wired into request-logging middleware (recordRequest)

### Error Tracking (Optional)

- [x] Global unhandled exception / rejection handlers (registerGlobalErrorHandlers — Phase 10)
- [ ] Setup Sentry or similar for error tracking (deferred — cloud deployment)
- [ ] Alert on critical errors (deferred — cloud deployment)

---

## GIAI ĐOẠN 13: Docker & Environment (Tuần 5)

### Dockerfile for Backend

- [x] Create `Dockerfile` (multi-stage build):
- [x] Stage 1 (builder): node:20-alpine, `npm ci`, `npx prisma generate`
- [x] Stage 2 (production): node:20-alpine, non-root user (appuser), `npm ci --omit=dev`
- [x] Copy Prisma Client from builder stage
- [x] Pre-create `/app/logs` with correct ownership
- [x] HEALTHCHECK via `healthcheck.js` → GET /health/liveness
- [x] EXPOSE 5000, CMD ["node", "src/server.js"]
- [x] Create `.dockerignore` (node_modules, .env, logs, .git, coverage, IDE, Docker files)

### Build & Test Locally

- [x] `docker build -t backend:v1 .` — built successfully (768 MB, cached in ~2s)
- [x] `docker run -p 5001:5000 -e ... backend:v1` — container started, connected to host MySQL
- [x] Test health: GET /api/v1/health → `{ status: "ok", database: "connected" }`
- [x] Test auth: POST /auth/login → tokens returned
- [x] Test CRUD: GET /customers → 10 customers returned
- [x] Docker HEALTHCHECK status: `healthy`

### Production Environment Variables

- [x] All sensitive values in .env (NOT in code)
- [x] Document in .env.example (fixed formatting — SENDGRID keys on separate lines)
- [ ] In production, loaded from AWS Secrets Manager or ECS Task Def (deferred — cloud deployment)

---

## GIAI ĐOẠN 14: Testing (Tuần 5-6)

### Unit Testing

- [x] Setup Jest + Supertest (`jest.config.js`, `__tests__/setup.js`)
- [x] Write tests for:
- [x] Auth logic — 11 tests (login valid/invalid, refresh, me, logout) → `auth.test.js`
- [x] Services — 16 tests (customer CRUD, bulk, search, pagination) → `customers.test.js`
- [x] Validators — 11 tests (auth, customer, message validation) → `validators.test.js`
- [x] Error handling (4xx/5xx codes tested across all suites)
- [x] Health endpoints — 4 tests → `health.test.js`

### Integration Testing

- [x] Test with real database (live MySQL):
- [x] Each suite auto-registers fresh tenant via `registerAndLogin()`
- [x] Seed test data inline per test
- [x] Run tests: `npm test` / `npm run test:verbose`
- [x] Clean up via `cleanupTenant()` in afterAll hooks
- [x] Test workflows:
- [x] Register → Login → Stats → Create customer → List → Stats → Logs → Update → Delete → Confirm → `integration.test.js` (15 tests)
- [x] Error scenarios (invalid input, duplicate email, 404, 401, 403)

### Automated Test Coverage (replaces manual Postman)

- [x] Test all endpoints:
- [x] POST `/tenants/register` — create new tenant
- [x] POST `/auth/login` — login, get tokens
- [x] GET `/customers` — list (empty, populated, search, pagination)
- [x] POST `/customers` — create customer (valid, duplicate, missing fields, invalid email)
- [x] GET `/customers/:id` — get by ID (found, not found)
- [x] PUT `/customers/:id` — update (found, not found)
- [x] POST `/customers/bulk` — bulk create (valid, empty array)
- [x] DELETE `/customers/:id` — delete (success 204, already deleted 404)
- [x] GET `/messages/logs` — message logs (empty)
- [x] GET `/health`, `/health/liveness`, `/health/readiness`, `/health/metrics`
- [x] Test error scenarios:
- [x] Missing fields → 400 Bad Request
- [x] Invalid email → 400 Bad Request
- [x] Not authenticated → 401 Unauthorized
- [x] Not authorized (wrong tenant) → 403 Forbidden
- [x] Resource not found → 404 Not Found

### CORS & Security Testing

- [x] Frontend can call endpoints (CORS enabled via app.js)
- [x] Only authorized users can access protected endpoints (JWT auth tested)
- [x] User A cannot access user B's data (multi-tenant isolation — 3 dedicated tests)
- [x] Sensitive data not leaked in error messages (password redacted in logs)
- [x] API keys/tokens not exposed in logs/errors (Winston redaction middleware)

### Test Results: **57 tests, 5 suites — ALL PASSING**

---

## SUCCESS CRITERIA FOR BACKEND — ALL MET

- [x] All 6 API endpoint groups fully implemented (Tenants, Auth, Customers, Messaging, Logs, Health)
- [x] Multi-tenant isolation enforced (user A ≠ user B data) — 3 dedicated tests
- [x] JWT authentication working (login, token refresh, protected routes) — 11 auth tests
- [x] Database schema created, migrations working — Prisma 6 models, 1 migration
- [x] Twilio SMS integration:
- [x] Single SMS sends
- [x] Batch SMS sends
- [x] Webhook updates status
- [x] SendGrid Email integration:
- [x] Single email sends
- [x] Batch email sends
- [x] Webhook updates status
- [x] Input validation all endpoints — Joi validators + 11 validation tests
- [x] Error handling with proper HTTP status codes — tested 400/401/403/404/409
- [x] Logging & monitoring setup — Winston + daily rotate + health metrics
- [x] Docker image builds without errors — `backend:v1` (768 MB)
- [x] Docker container runs and responds at <http://localhost:5001/api/v1/health>
- [x] All workflows tested (57 integration/unit tests — ALL PASSING)
- [x] Code clean, documented, ready for deployment

---

## NOTES FOR THIS PERSON

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

## WEEK-BY-WEEK BREAKDOWN

| Week | Focus | Output | Sync Point |
| ------ | ------- | -------- | ----------- |
| W1 | Setup, DB schema, Auth endpoints | Auth working, can login | DB schema final? |
| W2 | Tenant + Customer CRUD | Customers CRUD endpoints ready | API ready for Frontend? |
| W3 | Twilio + SendGrid integration | SMS/Email send working | External services ready? |
| W4 | Webhooks, Messaging API | Full messaging flows | Integration testing with Frontend? |
| W5 | Logging, error handling, Docker | Docker image builds, all tests pass | Ready to deploy? |
| W6 | Integration testing, deployment | API deployed to AWS, tested end-to-end | Final UAT |

---

## BACKEND INTEGRATION — KẾT NỐI HỆ THỐNG HOÀN CHỈNH

> **Khi nào thực hiện?** Sau khi tất cả thành viên nhóm hoàn thành phần việc riêng (Frontend, Backend, DevOps, External Services).
> **Ai chịu trách nhiệm chính?** Backend Developer phối hợp cùng cả nhóm.

---

### 🅰 Kết nối với Frontend (Person 1)

**Backend cần làm:**

- [ ] Cập nhật CORS origin trong `src/app.js` cho phép Frontend URL:

 ```js
 app.use(cors({
 origin: [
 'http://localhost:5173', // Vite dev server
 'http://localhost:3000', // Alt dev port
 process.env.FRONTEND_URL // Production URL (CloudFront)
 ].filter(Boolean),
 credentials: true,
 methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
 allowedHeaders: ['Content-Type', 'Authorization']
 }));
 ```

- [ ] Thêm `FRONTEND_URL` vào `.env` và `.env.example`

**Kiểm tra chung:**

- [ ] Frontend gọi `POST /auth/login` → nhận tokens → lưu vào localStorage/cookie
- [ ] Frontend gọi CRUD `/customers` → hiển thị danh sách, tạo/sửa/xóa thành công
- [ ] Frontend gọi gửi SMS/Email → hiển thị kết quả + logs
- [ ] Error messages từ Backend hiển thị đúng trên UI (400, 401, 403, 404, 409)
- [ ] Pagination + Search hoạt động đúng giữa Frontend ↔ Backend
- [ ] Token refresh tự động khi access token hết hạn

---

### 🅱 Kết nối với External Services (Person 4 — Twilio & SendGrid)

**Backend cần làm:**

- [ ] Nhận Twilio credentials thật từ Person 4 → cập nhật `.env`:

 ```env
 TWILIO_ACCOUNT_SID=AC_real_sid
 TWILIO_AUTH_TOKEN=real_auth_token
 TWILIO_PHONE_NUMBER=+1xxxxxxxxxx
 ```

- [ ] Nhận SendGrid credentials thật từ Person 4 → cập nhật `.env`:

 ```env
 SENDGRID_API_KEY=SG.real_api_key
 SENDGRID_FROM_EMAIL=verified_email@yourdomain.com
 SENDGRID_WEBHOOK_VERIFICATION_KEY=real_key
 ```

**Kiểm tra chung:**

- [ ] Gửi SMS thật → nhận được trên điện thoại
- [ ] Gửi Email thật → nhận được trong inbox
- [ ] Twilio webhook status callback → `MessageLog.status` cập nhật (queued → sent → delivered)
- [ ] SendGrid event webhook → `MessageLog.status` cập nhật (processed → delivered)
- [ ] Signature verification hoạt động đúng với credentials thật
- [ ] Batch SMS/Email gửi thành công (2-3 recipients)

---

### 🅲 Kết nối với DevOps / Cloud (Person 3 — AWS)

**Backend cần làm:**

- [ ] Nhận RDS endpoint từ Person 3 → cập nhật `DATABASE_URL`:

 ```env
 DATABASE_URL=mysql://admin:password@your-rds-endpoint.rds.amazonaws.com:3306/saas_db
 ```

- [ ] Chạy `npx prisma migrate deploy` trên RDS (production migration)
- [ ] Chạy `npm run prisma:seed` để seed demo data
- [ ] Set `NODE_ENV=production` trong ECS Task Definition

**Person 3 (DevOps) cần làm:**

- [ ] Build Docker image: `docker build -t backend:v1 ./backend`
- [ ] Push image lên AWS ECR
- [ ] Deploy ECS Task với env vars từ AWS Secrets Manager
- [ ] Cấu hình ALB (Application Load Balancer) → route traffic đến ECS
- [ ] Setup SSL certificate (ACM) cho HTTPS

**Kiểm tra chung:**

- [ ] Health check trên AWS: `GET https://api.yourdomain.com/api/v1/health` → status "ok"
- [ ] Login + CRUD hoạt động trên production
- [ ] Cấu hình webhook URLs trên Twilio/SendGrid dashboard:
- [ ] Twilio Status Callback: `https://api.yourdomain.com/api/v1/messages/twilio/webhook`
- [ ] SendGrid Event Webhook: `https://api.yourdomain.com/api/v1/messages/sendgrid/webhook`

---

### 🅳 Deferred Tasks (chỉ làm khi deploy production)

- [ ] Setup Sentry hoặc tương tự cho error tracking (cài `@sentry/node`)
- [ ] Alert on critical errors (CloudWatch Alarms / SNS)
- [ ] Load secrets từ AWS Secrets Manager (thay vì `.env` file)

---

### INTEGRATION TEST — FULL SYSTEM E2E

> Chạy full flow trên môi trường production/staging để xác nhận hệ thống hoạt động hoàn chỉnh.

- [ ] **Flow 1:** Register tenant → Login → Tạo customer → Gửi SMS → Xem logs → Status updated via webhook
- [ ] **Flow 2:** Register tenant → Login → Tạo customer → Gửi Email → Xem logs → Status updated via webhook
- [ ] **Flow 3:** Bulk create customers → Batch SMS → Batch Email → Xem logs
- [ ] **Flow 4:** Multi-tenant isolation — Tenant A không thấy data Tenant B
- [ ] **Flow 5:** Frontend gọi toàn bộ flow trên qua UI (không dùng Postman/cURL)
- [ ] **Flow 6:** Docker container crash → auto-restart (ECS) → health check recover

---

> **LƯU Ý QUAN TRỌNG:**
>
> - Backend code **gần như KHÔNG cần thay đổi** — chỉ cập nhật `.env` + CORS origin
> - Mọi credentials đều nằm trong `.env`, **không hardcode** trong source code
> - Khi deploy production, **PHẢI** đổi `JWT_SECRET` thành giá trị mạnh (≥ 32 ký tự random)
> - Kiểm tra rate limiting phù hợp production traffic (hiện tại: 100 req/15min general, 10 req/1min messaging)
