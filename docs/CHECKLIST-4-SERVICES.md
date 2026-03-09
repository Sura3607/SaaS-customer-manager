# ✅ CHECKLIST 4: EXTERNAL SERVICES INTEGRATION (Twilio + SendGrid)

**👤 Người đảm trách:** External Services Integration Engineer  
**🎯 Mục tiêu:** Cấu hình Twilio + SendGrid, implement integration code, test workflows hoàn chỉnh  
**📚 Công nghệ:** Twilio SDK, SendGrid SDK, Webhooks, Testing tools (cURL, Postman)  
**⏱️ Thời gian dự kiến:** 6 tuần

---

## 📋 GIAI ĐOẠN 1: Twilio Account Setup (Tuần 1)

### Create Twilio Account
- [ ] Go to https://www.twilio.com/console
- [ ] Sign up with email address
- [ ] Email verification required
- [ ] Setup phone number (can use for testing)
- [ ] Accept Twilio terms & conditions

### Twilio Project & Credentials
- [ ] Go to Console Home
- [ ] Create new Project (or use default):
  - [ ] Project name: `SaaS-Customer-Manager`
  - [ ] Use case: Send SMS messages
- [ ] Get credentials (note these securely):
  - [ ] **Account SID:** `ACxxxxxxxxxxxxxxxxxxxxx` (visible on dashboard)
  - [ ] **Auth Token:** `xxxxxxxxxxxxxxxxxxxxxxxxxxxx` (click "View" to reveal)
  - [ ] Save both to password manager
- [ ] Enable Programmable SMS:
  - [ ] Products > Messaging > SMS
  - [ ] Setup complete

### Purchase Twilio Phone Number
- [ ] Go to Phone Numbers > Manage > Buy a Number
  - [ ] Country: US (or your region)
  - [ ] Capabilities: SMS
  - [ ] Click "Search"
  - [ ] Select a number you like: e.g., +1 (555) 123-4567
  - [ ] Buy: $1.15/month (or similar)
- [ ] Record phone number: `+1 (555) 123-4567`
- [ ] Verify: Go back to Phone Numbers > Active Numbers, see your new number

### Setup Twilio Webhook for Status Callbacks
- [ ] Go to Messaging > Settings > Webhook URLs
- [ ] Add Status Callback URL:
  - [ ] URL: `https://api.example.com/api/v1/messages/twilio/webhook`
  - [ ] Method: HTTP POST
  - [ ] Status callback events: All (sent, failed, delivered, etc.)
- [ ] Save settings
- [ ] Note: Can't test locally until deployed, or use ngrok (see Giai đoạn 6)

### Test Twilio Setup
- [ ] Go to Messaging > Try it out > Send an SMS
- [ ] Send message to your phone number
- [ ] Verify SMS received on phone
- [ ] Check message logs in Twilio console

### Create Twilio API Key (Alternative to Auth Token)
- [ ] Go to Account > API Keys > Create authentication token
- [ ] Or generate new API Key (symmetric key)
- [ ] Store securely (use this instead of Auth Token if preferred)

---

## 📋 GIAI ĐOẠN 2: SendGrid Account Setup (Tuần 1)

### Create SendGrid Account
- [ ] Go to https://sendgrid.com/
- [ ] Click "Sign up" (or login if existing account)
- [ ] Email, password, company info
- [ ] Verify email address (link in email)
- [ ] Complete welcome wizard

### SendGrid Project & Credentials
- [ ] Go to Settings > API Keys
- [ ] Create new API Key:
  - [ ] Name: `SaaS-Customer-Manager-Backend`
  - [ ] Permissions: **Full Access** (or custom)
  - [ ] Click "Create & Verify"
- [ ] Copy API Key (shown once):
  - [ ] **API Key:** `SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
  - [ ] Save to password manager (won't be shown again)
- [ ] Verify in SendGrid Subuser portal if using subusers

### Verify Sender Email Address (Sender Identity)
- [ ] Go to Settings > Sender Authentication
- [ ] Option 1: **Single Sender Verification** (for testing):
  - [ ] Click "Verify a Single Sender"
  - [ ] Email: `noreply@saas.example.com` (or your email)
  - [ ] Company: SaaS Customer Manager
  - [ ] Address: (any address)
  - [ ] Click "Create"
  - [ ] Verify via link in email sent to that address
- [ ] Option 2: **Domain Authentication** (for production):
  - [ ] Add DNS CNAME records from registrar
  - [ ] More complex, ensures brand credibility
  - [ ] Skip for now, do in production phase
- [ ] Confirmed sender: `noreply@saas.example.com`

### Setup SendGrid Webhook for Event Tracking
- [ ] Go to Settings > Event Webhooks
- [ ] URL: `https://api.example.com/api/v1/messages/sendgrid/webhook`
- [ ] Method: HTTP POST
- [ ] Select events to track:
  - [ ] `Delivered` (email delivered)
  - [ ] `Open` (recipient opened email)
  - [ ] `Click` (recipient clicked link)
  - [ ] `Bounce` (undeliverable)
  - [ ] `Spam Report` (marked as spam)
  - [ ] `Unsubscribe` (recipient unsubscribed)
- [ ] Make public: Uncheck Authentication (webhook is public)
- [ ] Save
- [ ] Note: Test locally with ngrok (see Giai đoạn 6)

### Test SendGrid Setup
- [ ] Go to Mail Send > Send a Test Email
- [ ] From: `noreply@saas.example.com`
- [ ] To: Your real email (Gmail, Outlook, etc.)
- [ ] Subject: "Test Email from SendGrid"
- [ ] Send
- [ ] Verify email received in inbox (check spam folder)

### SendGrid Email Templates (Optional)
- [ ] Go to Dynamic Templates
- [ ] Create template for customer notification emails
- [ ] Use variables: {{customerName}}, {{messageContent}}
- [ ] Save template ID: `d-xxxxxxxxxxxxx`
- [ ] Use in code (Phase 2)

---

## 📋 GIAI ĐOẠN 3: Environment Variables & Configuration (Tuần 1)

### Document Required Environment Variables
- [ ] Create `.env.example` in backend (shared with Backend dev):
  ```
  # Twilio SMS
  TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxx
  TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
  TWILIO_PHONE_NUMBER=+1 (555) 123-4567
  
  # SendGrid Email
  SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  SENDGRID_FROM_EMAIL=noreply@saas.example.com
  ```

### Store in AWS Secrets Manager (for Production)
- [ ] Create secret: `saas/twilio-account-sid` = `ACxxxxxxxxxxxxxxxxxxxxx`
- [ ] Create secret: `saas/twilio-auth-token` = `xxxxxxxxxxxxxxxxxxxxxxxxxxxx`
- [ ] Create secret: `saas/twilio-phone-number` = `+1 (555) 123-4567`
- [ ] Create secret: `saas/sendgrid-api-key` = `SG.xxxxxxxxxxxxxxxxxxxxxxxx`
- [ ] Create secret: `saas/sendgrid-from-email` = `noreply@saas.example.com`
- [ ] Reference in ECS Task Definition environment variables

### Local Development
- [ ] Create `.env` in backend (from `.env.example`)
- [ ] Fill with actual Twilio & SendGrid credentials
- [ ] DON'T commit to Git (add to `.gitignore`)

---

## 📋 GIAI ĐOẠN 4: Twilio SDK Integration Testing (Tuần 2-3)

### Review Backend Twilio Service Code
- [ ] Work with Backend dev to review `src/services/twilio.service.js`
- [ ] Verify:
  - [ ] Twilio client initialized correctly
  - [ ] `sendSMS(toNumber, content)` method exists
  - [ ] `sendBatchSMS(numbers[], content)` method exists
  - [ ] `handleWebhook(payload)` method exists
  - [ ] Error handling for invalid numbers, low credits

### Test Single SMS Send
- [ ] Create test endpoint (temporary):
  - [ ] POST `/test/send-sms`
  - [ ] Body: `{ "phoneNumber": "+1...", "message": "Test SMS" }`
- [ ] Call from Postman or cURL:
  ```bash
  curl -X POST http://localhost:5000/test/send-sms \
    -H "Content-Type: application/json" \
    -d '{"phoneNumber":"+1555123456","message":"Test from Twilio integration"}'
  ```
- [ ] Expected response: `{ "messageId": "SMxxxxx", "status": "queued" }`
- [ ] Check your phone for SMS received
- [ ] Verify message time, content correct
- [ ] Check Twilio console > Messages:
  - [ ] Message listed
  - [ ] Status: "Delivered"
  - [ ] Direction: Outbound
  - [ ] Recipient: show your number

### Test Batch SMS Send
- [ ] Create test endpoint:
  - [ ] POST `/test/send-sms-batch`
  - [ ] Body: `{ "phoneNumbers": [...], "message": "..." }`
- [ ] Send to 3-5 phone numbers:
  ```bash
  curl -X POST http://localhost:5000/test/send-sms-batch \
    -H "Content-Type: application/json" \
    -d '{"phoneNumbers":["+1555111111","+1555222222","+1555333333"],"message":"Batch test"}'
  ```
- [ ] Verify all SMS received
- [ ] Check Twilio console > Messages:
  - [ ] All 3 messages listed
  - [ ] All "Delivered"

### Test Error Handling
- [ ] Send SMS to invalid number:
  ```bash
  curl -X POST http://localhost:5000/test/send-sms \
    -H "Content-Type: application/json" \
    -d '{"phoneNumber":"invalid","message":"test"}'
  ```
- [ ] Expected: `{ "error": "Invalid phone number", "statusCode": 400 }`
- [ ] Backend logs should show error
- [ ] Twilio console shouldn't show message attempt

### Test Webhook (Local with ngrok)
- [ ] Setup ngrok (expose local server to internet):
  ```bash
  ngrok http 5000
  ```
- [ ] Get ngrok URL: `https://abc1234.ngrok.io`
- [ ] Update Twilio webhook setting:
  - [ ] Go to Messaging > Settings > Webhook URLs
  - [ ] Status Callback URL: `https://abc1234.ngrok.io/api/v1/messages/twilio/webhook`
  - [ ] Save
- [ ] Send SMS via API (or Twilio console)
- [ ] Watch ngrok console for incoming webhook request
- [ ] Verify webhook payload contains:
  - [ ] `MessageSid` (message ID)
  - [ ] `MessageStatus` (sent, delivered, failed, etc.)
  - [ ] `To`, `From` (recipients and sender)
- [ ] Backend should update MessageLog in database
- [ ] Check logs in backend console:
  ```
  📝 Webhook received from Twilio
  MessageSid: SMxxxxx
  Status: delivered
  Updated MessageLog: success
  ```

### Test Rate Limiting
- [ ] Send 20 SMS in rapid succession:
  ```bash
  for i in {1..20}; do
    curl -X POST http://localhost:5000/api/v1/messages/sms \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"customerId":"...", "content":"Message '$i'"}'
  done
  ```
- [ ] Should hit rate limit (429 Too Many Requests) after ~10 requests
- [ ] Response: `{ "error": "Too many requests, try again later" }`
- [ ] Backend should log rate limit hit

---

## 📋 GIAI ĐOẠN 5: SendGrid SDK Integration Testing (Tuần 2-3)

### Review Backend SendGrid Service Code
- [ ] Work with Backend dev to review `src/services/sendgrid.service.js`
- [ ] Verify:
  - [ ] SendGrid client initialized correctly
  - [ ] `sendEmail(toEmail, subject, content)` method exists
  - [ ] `sendBatchEmail(emails[], subject, content)` method exists
  - [ ] `handleWebhook(payload)` method exists
  - [ ] Error handling for invalid emails, API errors

### Test Single Email Send
- [ ] Create test endpoint:
  - [ ] POST `/test/send-email`
  - [ ] Body: `{ "toEmail": "...", "subject": "...", "content": "..." }`
- [ ] Call from Postman:
  ```json
  POST http://localhost:5000/test/send-email
  {
    "toEmail": "yourname@gmail.com",
    "subject": "Test Email from SendGrid",
    "content": "<h1>Hello</h1><p>This is a test email</p>"
  }
  ```
- [ ] Expected response: `{ "messageId": "SGxxxxx", "status": "queued" }`
- [ ] Check email inbox:
  - [ ] Email received
  - [ ] From: `noreply@saas.example.com`
  - [ ] Subject: "Test Email from SendGrid"
  - [ ] Content displayed correctly (HTML rendered)
  - [ ] Not in spam folder (or verify in Spam folder)
- [ ] Check SendGrid console > Mail Activity:
  - [ ] Email listed with status "Delivered"
  - [ ] Recipient shown
  - [ ] Subject shown

### Test Batch Email Send
- [ ] Create test endpoint:
  - [ ] POST `/test/send-email-batch`
  - [ ] Body: `{ "emails": [...], "subject": "...", "content": "..." }`
- [ ] Send to 3-5 different emails:
  ```json
  POST http://localhost:5000/test/send-email-batch
  {
    "emails": ["user1@gmail.com", "user2@outlook.com", "user3@yahoo.com"],
    "subject": "Batch Test",
    "content": "<p>This is a batch test</p>"
  }
  ```
- [ ] Verify all 3 emails received in their respective inboxes
- [ ] Check SendGrid console > Mail Activity:
  - [ ] All 3 emails listed
  - [ ] All "Delivered"

### Test Email with HTML Content
- [ ] Send email with rich HTML:
  ```json
  {
    "toEmail": "yourname@gmail.com",
    "subject": "Customer Update",
    "content": "<h2>Order Confirmation</h2><p>Your order #123 has been confirmed...</p><a href='https://example.com'>View Order</a>"
  }
  ```
- [ ] Verify HTML renders properly in email client
- [ ] Links are clickable

### Test Error Handling
- [ ] Send email to invalid email format:
  ```bash
  curl -X POST http://localhost:5000/test/send-email \
    -H "Content-Type: application/json" \
    -d '{"toEmail":"invalid-email","subject":"test","content":"test"}'
  ```
- [ ] Expected: `{ "error": "Invalid email address", "statusCode": 400 }`
- [ ] Backend logs should show validation error

### Test Webhook for Delivery Events
- [ ] Setup ngrok for SendGrid webhook:
  - [ ] ngrok URL: `https://abc1234.ngrok.io`
  - [ ] Update SendGrid webhook (Settings > Event Webhooks):
    - [ ] URL: `https://abc1234.ngrok.io/api/v1/messages/sendgrid/webhook`
  - [ ] Save
- [ ] Send email via API
- [ ] Monitor ngrok console for webhook requests:
  - [ ] First webhook: `"event":"processed"` (email accepted)
  - [ ] Second webhook: `"event":"delivered"` (email delivered to recipient)
  - [ ] (Optional) Third webhook: `"event":"open"` (recipient opened email)
- [ ] Backend should process webhooks:
  - [ ] Extract event type
  - [ ] Find corresponding MessageLog
  - [ ] Update status (Delivered, Opened, etc.)
- [ ] Verify in backend logs:
  ```
  📝 SendGrid webhook received
  Event: delivered
  MessageId: SGxxxxx
  Recipient: user@gmail.com
  Updated MessageLog: success
  ```

### Test Event Tracking
- [ ] Send email to yourself
- [ ] Open email in client → webhook should fire "open" event
- [ ] Backend logs: Status updated to "Opened"
- [ ] (Optional) Click link in email → webhook fires "click" event

---

## 📋 GIAI ĐOẠN 6: Integration Testing - Full Workflows (Tuần 3-4)

### Workflow 1: Create Customer → Send SMS → View Status
- [ ] **Step 1: Register Tenant** (Frontend):
  - [ ] Frontend: Register new tenant
  - [ ] Backend: Create tenant in DB
  
- [ ] **Step 2: Login** (Frontend):
  - [ ] Frontend: Login as admin
  - [ ] Backend: Authenticate, return JWT token
  
- [ ] **Step 3: Create Customer** (Frontend):
  - [ ] Frontend: Create customer with phone number
  - [ ] Backend: Save to DB
  
- [ ] **Step 4: Send SMS** (Frontend → Backend):
  - [ ] Frontend: Open Messaging, select customer, send SMS
  - [ ] Backend: Call Twilio SDK
  - [ ] Twilio: Send SMS to customer phone
  - [ ] Phone: Receive SMS ✓
  
- [ ] **Step 5: Verify Message Log** (Frontend):
  - [ ] Frontend: View Logs page
  - [ ] Backend: Return messages
  - [ ] Status should be "Pending" initially
  
- [ ] **Step 6: Webhook Update** (Twilio → Backend):
  - [ ] Twilio: Send status callback webhook
  - [ ] Backend: Receive and process webhook
  - [ ] Update MessageLog status to "Delivered"
  
- [ ] **Step 7: Verify Status Updated** (Frontend):
  - [ ] Frontend: Refresh Logs page
  - [ ] Status now shows "Delivered" ✓

### Workflow 2: Batch Email to Multiple Customers
- [ ] Create 3 customers with different emails
- [ ] Frontend: Select all 3 in table
- [ ] Frontend: Open Messaging > Email tab
- [ ] Frontend: Type subject & content
- [ ] Frontend: Send
- [ ] Backend: Batch send via SendGrid
- [ ] All 3 emails: Received in inboxes ✓
- [ ] Frontend: Logs show all 3 emails as "Sent" ✓
- [ ] Open one email: Webhook fires, status updates to "Delivered" ✓

### Workflow 3: Error Handling - Invalid Phone
- [ ] Frontend: Create customer with invalid phone (e.g., "abc123")
- [ ] Frontend: Try to send SMS
- [ ] Backend: Validate phone format
- [ ] Return error: `{ "error": "Invalid phone number" }`
- [ ] Frontend: Display error notification to user ✓
- [ ] Message NOT in database
- [ ] Message NOT attempted on Twilio

### Workflow 4: Error Handling - Rate Limit
- [ ] Frontend: Send 15 SMS in quick succession
- [ ] 1-10: Success ✓
- [ ] 11-15: Rate limit hit → 429 error ✓
- [ ] Frontend: Display "Too many requests, try again in 1 minute" ✓
- [ ] Twilio: Only 10 messages sent (rate limit prevented abuse)

---

## 📋 GIAI ĐOẠN 7: Load Testing (Tuần 4)

### Prepare Test Data
- [ ] Create 100 test customers in database (bulk insert)
- [ ] Generate 100 phone numbers (use Twilio trial numbers or similar)
- [ ] Generate 50 test email addresses

### Load Test SMS Sending
- [ ] Create test script:
  ```bash
  #!/bin/bash
  TOKEN=<jwt_token>
  for i in {1..100}; do
    CUSTOMER_ID="cust_$i"
    curl -s -X POST http://localhost:5000/api/v1/messages/sms/batch \
      -H "Authorization: Bearer $TOKEN" \
      -H "Content-Type: application/json" \
      -d '{"customerIds":["'"$CUSTOMER_ID"'"],"content":"Test message '$i'"}' &
  done
  wait
  ```
- [ ] Run test
- [ ] Monitor backend:
  - [ ] Response time: < 500ms per request
  - [ ] CPU usage: < 80%
  - [ ] Memory usage: < 70%
  - [ ] Error count: 0 (or expected rate limit errors)
  - [ ] Logs: All messages processed
- [ ] Check Twilio:
  - [ ] All 100 messages queued
  - [ ] Status updates received in CloudWatch logs

### Load Test Email Sending
- [ ] Similar test for batch email
- [ ] 50 concurrent email sends
- [ ] Verify all received in respective inboxes
- [ ] Check SendGrid dashboard:
  - [ ] 50 emails queued/delivered
  - [ ] No bounce/reject

### Load Test Webhook Processing
- [ ] Send 100 SMS
- [ ] Simulate 100 webhook callbacks arriving in rapid succession
- [ ] Backend should:
  - [ ] Process all webhooks
  - [ ] Update all MessageLogs
  - [ ] No webhook lost (retry if needed)
  - [ ] Database transactions successful

---

## 📋 GIAI ĐOẠN 8: Webhook Security & Verification (Tuần 4)

### Twilio Webhook Security
- [ ] Backend should verify Twilio signature:
  - [ ] Use `twilio.validateRequest()` SDK method
  - [ ] Or manually HMAC-SHA1 verification
  - [ ] Reject webhook if signature invalid
- [ ] Test: Send fake webhook to backend
  - [ ] Should get 403 Forbidden
  - [ ] Not processed in database
- [ ] Backend logs should show:
  ```
  🔒 Webhook signature verification failed
  Blocked webhook from invalid source
  ```

### SendGrid Webhook Security
- [ ] Backend should verify SendGrid signature:
  - [ ] Extract timestamp from header
  - [ ] Extract signature from header
  - [ ] Re-compute HMAC using API key
  - [ ] Compare signatures
  - [ ] Reject if invalid
- [ ] Test: Send fake webhook
  - [ ] Should get 403 Forbidden
  - [ ] Logs show verification failed

### Webhook Timeout & Retry Logic
- [ ] Simulate slow webhook processing:
  - [ ] Backend takes 30+ seconds to respond
  - [ ] Twilio/SendGrid should timeout & retry
  - [ ] Backend should be idempotent (process same webhook twice without duplicating)
- [ ] Implement idempotency:
  - [ ] Use unique webhook ID from provider
  - [ ] Store processed webhook IDs in DB
  - [ ] Skip if already processed

---

## 📋 GIAI ĐOẠN 9: Monitoring & Alerting (Tuần 5)

### Create Twilio Monitoring Dashboard
- [ ] Twilio console > Monitoring > Insights:
  - [ ] SMS volume: Daily/weekly/monthly
  - [ ] Success rate: % of messages delivered
  - [ ] Error rate: % of messages failed
  - [ ] Cost: Running total spent
- [ ] Setup alerts:
  - [ ] Alert if success rate < 95%
  - [ ] Alert if cost > $50/month (or your threshold)

### Create SendGrid Monitoring Dashboard
- [ ] SendGrid > Stats:
  - [ ] Email volume: Daily/weekly/monthly
  - [ ] Delivery rate: % delivered
  - [ ] Bounce rate: % undeliverable
  - [ ] Spam report rate: % marked as spam
- [ ] Setup alerts:
  - [ ] Alert if bounce rate > 5%
  - [ ] Alert if delivery rate < 95%

### Application-Level Monitoring (CloudWatch)
- [ ] Create CloudWatch dashboard:
  - [ ] Total SMS sent (counter)
  - [ ] Total emails sent (counter)
  - [ ] SMS success rate (%)
  - [ ] Email success rate (%)
  - [ ] Twilio API errors (count)
  - [ ] SendGrid API errors (count)
- [ ] Create CloudWatch alarms:
  - [ ] SMS error rate > 5% → SNS notification
  - [ ] Email error rate > 5% → SNS notification
  - [ ] Webhook processing latency > 5 seconds → alert

### Log Analysis
- [ ] Setup CloudWatch Insights query:
  ```
  fields @timestamp, providerId, messageId, status
  | filter provider = "twilio"
  | stats count() by status
  ```
- [ ] Run weekly to check:
  - [ ] Distribution of message statuses
  - [ ] Any stuck messages (still pending)
  - [ ] Error trends

---

## 📋 GIAI ĐOẠN 10: Documentation & Support (Tuần 5)

### Admin Setup Guide
- [ ] How to create Twilio account:
  1. Go to twilio.com
  2. Sign up
  3. Buy phone number
  4. Get Account SID & Auth Token
  5. Add to environment variables
- [ ] How to create SendGrid account:
  1. Go to sendgrid.com
  2. Sign up
  3. Verify sender email
  4. Create API key
  5. Add to environment variables
- [ ] Include screenshots for each step
- [ ] Include troubleshooting: "If SMS not received, check..."

### API Integration Guide
- [ ] How to send SMS via API:
  ```bash
  curl -X POST https://api.example.com/api/v1/messages/sms \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"customerId":"cust_123","content":"Hello!"}'
  ```
- [ ] How to send email via API:
  ```bash
  curl -X POST https://api.example.com/api/v1/messages/email \
    -H "Authorization: Bearer <JWT_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{"customerId":"cust_123","subject":"Hello","content":"<p>Hello!</p>"}'
  ```
- [ ] Error codes & meanings:
  - [ ] 400: Invalid input (bad phone/email)
  - [ ] 401: Unauthorized (no token)
  - [ ] 429: Rate limit (too many requests)
  - [ ] 500: Server error
- [ ] Webhook payload examples

### Troubleshooting Guide
- [ ] **SMS not received:**
  - [ ] Check phone number format (include country code)
  - [ ] Check Twilio phone number active
  - [ ] Check rate limit not hit
  - [ ] Check Twilio dashboard for error message
  - [ ] Check backend logs: any errors?
  - [ ] Contact Twilio support if urgent
  
- [ ] **Email not received:**
  - [ ] Check email format
  - [ ] Check in spam folder
  - [ ] Check SendGrid sender email verified
  - [ ] Check SendGrid dashboard for bounce reason
  - [ ] Check backend logs
  - [ ] Contact SendGrid support if urgent
  
- [ ] **Webhook not updating status:**
  - [ ] Check webhook URL configured in Twilio/SendGrid
  - [ ] Check backend receives webhook (check logs)
  - [ ] Check webhook signature verification passes
  - [ ] Check MessageLog ID matches
  - [ ] Check database update succeeds
  
- [ ] **Rate limit hit:**
  - [ ] Spread requests over time
  - [ ] Implement job queue for batch sends
  - [ ] Consider upgrading Twilio/SendGrid plan

### Operational Runbook
- [ ] How to respond to SMS/Email failures:
  1. Check CloudWatch alerts
  2. Check provider dashboards (Twilio/SendGrid)
  3. Check backend logs for errors
  4. Contact provider support if urgent
  5. Implement temporary workaround (alternate provider)
  6. Post-mortem & prevention measures
  
- [ ] How to upgrade SMS/Email volume:
  - [ ] Twilio: Monitor messaging costs, upgrade plan if needed
  - [ ] SendGrid: Monitor email volume, upgrade if needed
  - [ ] Consider implementing job queue for async sending

---

## 📋 GIAI ĐOẠN 11: Production Readiness Checklist (Tuần 5-6)

### Cost Analysis
- [ ] Estimate monthly costs:
  - [ ] **Twilio SMS:** $0.0075 per SMS × target volume
    - [ ] Example: 1000 SMS/day × 30 days = 30,000 SMS/month = $225
  - [ ] **SendGrid Email:** Free tier (100/day) or paid plan
    - [ ] Example: Free tier adequate for < 3000 emails/month
  - [ ] Estimate total: $0 - $300/month depending on volume
  
- [ ] Setup Twilio budget alert:
  - [ ] Go to Account > Settings > Twilio Pricing > Set Alert
  - [ ] Alert at $50/month (or your threshold)
  
- [ ] Setup SendGrid budget tracking:
  - [ ] Go to Settings > Usage > Billing
  - [ ] Monitor monthly spend
  
- [ ] Plan for growth:
  - [ ] If 10x volume (10,000 SMS/day): $2,250/month
  - [ ] Consider dedicated short codes (higher cost, better deliverability)
  - [ ] Consider backup providers (Vonage, AWS SNS) for failover

### Failover & Backup Plan
- [ ] **SMS Backup:**
  - [ ] Primary: Twilio
  - [ ] Backup: AWS SNS or Vonage
  - [ ] If Twilio rate limit hit: retry with backup
  - [ ] Backend code should implement fallback logic
  
- [ ] **Email Backup:**
  - [ ] Primary: SendGrid
  - [ ] Backup: Mailgun or AWS SES
  - [ ] If SendGrid queue full: use backup
  
- [ ] **Document failover procedure:**
  - [ ] How to switch providers
  - [ ] How to run dual-provider for redundancy
  - [ ] Testing failover quarterly

### Compliance & Legal
- [ ] **GDPR:**
  - [ ] Right to be forgotten: Customer deleted → stop SMS/Email
  - [ ] Backend: Implement cascade delete (when customer deleted, delete all messages)
  - [ ] Data retention: Keep logs only as long as necessary
  
- [ ] **TCPA (US Telemarketing):**
  - [ ] Do-not-call list compliance
  - [ ] Opt-in/opt-out management
  - [ ] Document user consent
  
- [ ] **CAN-SPAM (US Email):**
  - [ ] Unsubscribe link in all emails
  - [ ] Valid sender address
  - [ ] Clear subject line
  - [ ] Include physical address in email
  
- [ ] **Update Privacy Policy:**
  - [ ] Use of SMS for customer notification
  - [ ] Use of email for customer notification
  - [ ] Data retention period
  - [ ] Third-party service usage (Twilio, SendGrid)

### Testing Checklist (Final)
- [ ] ✓ SMS sent successfully, delivered
- [ ] ✓ Email sent successfully, delivered
- [ ] ✓ Batch SMS works (100+ messages)
- [ ] ✓ Batch email works (50+ messages)
- [ ] ✓ Twilio webhook updates status
- [ ] ✓ SendGrid webhook updates status
- [ ] ✓ Error handling for invalid phone/email
- [ ] ✓ Rate limiting prevents abuse
- [ ] ✓ Webhook signature verification works
- [ ] ✓ No API keys exposed in logs/code
- [ ] ✓ Monitoring alerts configured
- [ ] ✓ Fallback to backup provider if needed
- [ ] ✓ GDPR compliance implemented
- [ ] ✓ Documentation complete & accurate

---

## ✅ SUCCESS CRITERIA FOR EXTERNAL SERVICES

- [ ] **Twilio Integration:**
  - [ ] Account created & phone number active
  - [ ] Single SMS sends work (verified on phone)
  - [ ] Batch SMS sends work (100+ messages)
  - [ ] Webhook receives status updates
  - [ ] Error handling for invalid phone
  - [ ] Rate limiting implemented

- [ ] **SendGrid Integration:**
  - [ ] Account created & sender email verified
  - [ ] Single email sends work (verified in inbox)
  - [ ] Batch email sends work (50+ emails)
  - [ ] Webhook receives delivery events
  - [ ] HTML emails render correctly
  - [ ] Error handling for invalid email

- [ ] **Security:**
  - [ ] Webhook signatures verified (not spoofed)
  - [ ] API keys stored in environment variables (not in code)
  - [ ] No sensitive data logged
  - [ ] Idempotent webhook processing (no duplicates)

- [ ] **Monitoring:**
  - [ ] CloudWatch metrics tracking SMS/Email volume
  - [ ] CloudWatch alarms for failures
  - [ ] Twilio & SendGrid dashboards monitored
  - [ ] Email alerts configured

- [ ] **Documentation:**
  - [ ] Admin setup guide (how to create accounts)
  - [ ] API integration guide (how to use endpoints)
  - [ ] Troubleshooting guide (common issues)
  - [ ] Operational runbook (incident response)

- [ ] **Production Readiness:**
  - [ ] Cost analysis completed
  - [ ] Failover plan documented
  - [ ] GDPR/compliance checked
  - [ ] All tests passed
  - [ ] Ready for deployment

---

## 📝 NOTES FOR THIS PERSON

1. **Security:** API keys are sensitive; store in Secrets Manager, never commit to Git
2. **Testing:** Test with real phone/email (not fake) to ensure actual delivery
3. **Cost:** Monitor spending daily, set alerts to prevent surprise bills
4. **Support:** Keep Twilio & SendGrid support tickets open for help if needed
5. **Compliance:** Document all legal requirements (GDPR, TCPA, CAN-SPAM)
6. **Monitoring:** Setup alarms BEFORE problems happen, not after
7. **Failover:** Have backup providers ready for redundancy
8. **Documentation:** Good docs = faster incident response when things break
9. **Integration:** Close coordination with Backend dev for webhook implementations
10. **Testing:** Test at real scale (not just 1-2 messages)

---

## 📅 WEEK-BY-WEEK BREAKDOWN

| Week | Focus | Output | Sync Point |
|------|-------|--------|-----------|
| W1 | Twilio & SendGrid setup, credentials | Accounts active, credentials saved | Got all credentials? |
| W2 | SMS integration testing | SMS send/receive working, webhooks configured | Backend SMS service ready? |
| W3 | Email integration testing | Email send/receive working, webhooks configured | Backend Email service ready? |
| W4 | Full workflow testing, load testing | Both SMS & email working end-to-end | Integration points stable? |
| W5 | Monitoring, security, documentation | Dashboards & alarms configured, docs complete | Ready for production? |
| W6 | Final UAT, compliance check, support setup | All tests passed, support procedures ready | Ready for deployment? |

---

## 🔗 INTEGRATION WITH OTHER CHECKLISTS

### With Backend Developer
- [ ] Backend implements Twilio & SendGrid services
- [ ] Backend creates webhooks for status updates
- [ ] Backend exposes `/messages/sms` and `/messages/email` endpoints
- [ ] Backend validates phone/email formats
- [ ] Backend implements rate limiting for messaging
- [ ] Sync: Weekly (W2-4) to verify integration points

### With Frontend Developer
- [ ] Frontend displays message sending UI
- [ ] Frontend shows error messages when SMS/Email fails
- [ ] Frontend displays message logs with status
- [ ] Frontend allows batch selection of customers for messaging
- [ ] Sync: Monthly check that UI reflects API responses

### With DevOps Engineer
- [ ] DevOps adds AWS Secrets Manager for API keys
- [ ] DevOps configures ECS environment variables
- [ ] DevOps sets up CloudWatch metrics for SMS/Email volume
- [ ] DevOps configures alarms for SMS/Email failures
- [ ] Sync: This person provides secret names, DevOps configures them in AWS

---

## 📚 ADDITIONAL RESOURCES

- **Twilio Documentation:** https://www.twilio.com/docs/sms
- **SendGrid Documentation:** https://docs.sendgrid.com/
- **Twilio Node.js SDK:** https://github.com/twilio/twilio-node
- **SendGrid Node.js SDK:** https://github.com/sendgrid/sendgrid-nodejs
- **Webhook Security Best Practices:** OWASP Webhooks Security

