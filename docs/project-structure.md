# Cấu trúc dự án đề xuất

```plaintext
SaaS-customer-manager/
├─ backend/
│  ├─ src/
│  │  ├─ app.js
│  │  ├─ server.js
│  │  ├─ config/
│  │  │  ├─ env.js
│  │  │  ├─ db.js                    # Prisma Client Singleton
│  │  │  └─ providers.js             # Twilio & SendGrid config
│  │  ├─ routes/
│  │  │  ├─ tenants.routes.js
│  │  │  ├─ auth.routes.js
│  │  │  ├─ customers.routes.js
│  │  │  ├─ messages.routes.js
│  │  │  ├─ logs.routes.js
│  │  │  └─ health.routes.js
│  │  ├─ controllers/
│  │  │  ├─ tenants.controller.js
│  │  │  ├─ auth.controller.js
│  │  │  ├─ customers.controller.js
│  │  │  ├─ messages.controller.js
│  │  │  └─ logs.controller.js
│  │  ├─ services/
│  │  │  ├─ twilio.service.js
│  │  │  ├─ sendgrid.service.js
│  │  │  ├─ tenant.service.js
│  │  │  ├─ customer.service.js
│  │  │  └─ message.service.js
│  │  ├─ repositories/
│  │  │  └─ (data access layer nếu cần tách)
│  │  ├─ models/
│  │  │  └─ (nếu dùng thêm business models)
│  │  ├─ middlewares/
│  │  │  ├─ auth.middleware.js       # JWT verify
│  │  │  ├─ tenant.middleware.js     # Tenant isolation
│  │  │  └─ ratelimit.middleware.js
│  │  ├─ validators/
│  │  │  ├─ customer.validator.js
│  │  │  └─ message.validator.js
│  │  ├─ utils/
│  │  │  ├─ logger.js
│  │  │  └─ errors.js
│  │  └─ jobs/
│  │     └─ batch-sender.job.js      # Queue job cho batch send
│  ├─ prisma/
│  │  ├─ schema.prisma
│  │  ├─ migrations/
│  │  └─ seed.js
│  ├─ Dockerfile
│  ├─ package.json
│  ├─ .env.example
│  └─ .gitignore
├─ frontend/
│  ├─ src/
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  ├─ pages/
│  │  │  ├─ TenantRegister.jsx
│  │  │  ├─ Login.jsx
│  │  │  ├─ Dashboard.jsx
│  │  │  ├─ Customers.jsx
│  │  │  ├─ CustomerDetail.jsx
│  │  │  ├─ Messaging.jsx
│  │  │  └─ Logs.jsx
│  │  ├─ components/
│  │  │  ├─ layout/
│  │  │  │  ├─ MainLayout.jsx
│  │  │  │  └─ Header.jsx
│  │  │  ├─ customer/
│  │  │  │  ├─ CustomerTable.jsx
│  │  │  │  └─ CustomerForm.jsx
│  │  │  └─ messaging/
│  │  │     ├─ SMSForm.jsx
│  │  │     └─ EmailForm.jsx
│  │  ├─ hooks/
│  │  │  ├─ useAuth.js
│  │  │  └─ useCustomers.js
│  │  ├─ services/
│  │  │  └─ api.js                   # Axios instance
│  │  ├─ context/
│  │  │  └─ AuthContext.jsx
│  │  ├─ styles/
│  │  │  └─ global.css
│  │  └─ utils/
│  │     ├─ validators.js
│  │     └─ formatters.js
│  ├─ public/
│  ├─ Dockerfile
│  ├─ nginx.conf                     # Nginx config cho Docker
│  ├─ package.json
│  ├─ vite.config.js
│  └─ .gitignore
├─ infra/
│  ├─ aws/
│  │  ├─ architecture-diagram.png
│  │  └─ notes.md
│  ├─ docker/
│  │  └─ docker-compose.yml          # Local dev
│  └─ scripts/
│     ├─ deploy-backend.sh
│     └─ deploy-frontend.sh
├─ docs/
│  ├─ report.md
│  ├─ deployment.md
│  └─ security.md
├─ plan.md
├─ endpoints.md
├─ project-structure.md
└─ README.md
```

## Ghi chú kỹ thuật

- **Backend:** Node.js (Express)
- **ORM:** Prisma với **Singleton pattern** (tránh tràn RAM khi khởi tạo nhiều PrismaClient):

  ```js
  // config/db.js
  const { PrismaClient } = require('@prisma/client');
  
  let prisma;
  
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
  
  module.exports = prisma;
  ```

- **DB:** MySQL trên AWS RDS (multi-tenant: mỗi row có `tenantId`)
- **Frontend:** React + Vite + React Router + **Ant Design (AntD)**
- **Messaging:**
  - **SMS:** Twilio SDK (`twilio` npm package)
  - **Email:** SendGrid SDK (`@sendgrid/mail` npm package)
- **Deploy:**
  - **Backend:** Docker image → AWS ECS Fargate (hoặc EC2 + Docker Compose)
  - **Frontend:**
    - **Cách 1 (đơn giản nhất):** Build static → S3 + CloudFront
    - **Cách 2:** Docker image (nginx serve) → ECS Fargate (nếu muốn đồng nhất deployment)
  - **Database:** AWS RDS MySQL
  - **Logs:** CloudWatch
  - **Load Balancer:** ALB cho backend
  - **SSL/TLS:** AWS Certificate Manager (ACM)

## Đề xuất deployment frontend (đơn giản)

**Khuyến nghị:** S3 + CloudFront

- Build React app thành static files (`npm run build`)
- Upload lên S3 bucket (enable static website hosting)
- CloudFront distribution trỏ tới S3 (cache, HTTPS)
- Route 53 (nếu cần custom domain)

**Ưu điểm:** Đơn giản, rẻ, auto-scale, không cần quản lý container frontend.
