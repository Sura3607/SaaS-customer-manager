# ✅ CHECKLIST 3: DEVOPS/INFRASTRUCTURE (Docker + AWS Deployment)

**👤 Người đảm trách:** DevOps Engineer  
**🎯 Mục tiêu:** Setup Docker local development, AWS infrastructure, triển khai ứng dụng lên AWS  
**📚 Công nghệ:** Docker, Docker Compose, AWS (VPC, RDS, EC2/ECS, S3, CloudFront, IAM, CloudWatch)  
**⏱️ Thời gian dự kiến:** 6 tuần

---

## 📋 GIAI ĐOẠN 1: Docker Local Development Setup (Tuần 1-2)

### Backend Dockerfile Review & Setup

- [ ] Review Backend Dockerfile (created by Backend dev):
  - [ ] Multi-stage build present?
  - [ ] Production-only dependencies (npm ci --only=production)?
  - [ ] Proper EXPOSE port (5000)?
  - [ ] Health check configured?
  - [ ] Working directory set?
- [ ] Test build:
  - [ ] `cd backend && docker build -t backend:v1 .`
  - [ ] Verify no errors
  - [ ] Check image size (~300MB acceptable?)
- [ ] Test run:
  - [ ] `docker run -p 5000:5000 --env-file .env backend:v1`
  - [ ] `curl http://localhost:5000/api/v1/health` → should return OK
  - [ ] Stop container

### Frontend Dockerfile Review & Setup

- [ ] Review Frontend Dockerfile (created by Frontend dev):
  - [ ] Multi-stage build: Node for build, Nginx for serve?
  - [ ] Build stage: npm install, npm run build?
  - [ ] Serve stage: Alpine Nginx?
  - [ ] Proper EXPOSE port (80)?
  - [ ] Health check?
- [ ] Test build:
  - [ ] `cd frontend && docker build -t frontend:v1 .`
  - [ ] Verify no errors
  - [ ] Check image size (~150MB acceptable for Nginx?)
- [ ] Test run:
  - [ ] `docker run -p 3000:80 frontend:v1`
  - [ ] Open <http://localhost:3000> in browser
  - [ ] Should see frontend UI
  - [ ] Check console for any errors
  - [ ] Stop container

### nginx.conf for Frontend

- [ ] Review `frontend/nginx.conf` (created by Frontend dev):
  - [ ] Gzip compression enabled?
  - [ ] Static asset caching configured?
  - [ ] 404 → index.html for React Router?
  - [ ] Proper error handling?
- [ ] Test:
  - [ ] Start container
  - [ ] Check network tab in DevTools (gzip applied?)
  - [ ] Navigation to React routes works without 404

### docker-compose.yml for Local Development

- [ ] Create `docker-compose.yml` in root:

  ```yaml
  version: '3.8'
  
  services:
    mysql:
      image: mysql:8.0
      environment:
        MYSQL_ROOT_PASSWORD: rootpassword123
        MYSQL_DATABASE: saas_db
        MYSQL_USER: saas_user
        MYSQL_PASSWORD: saas_password123
      ports:
        - "3306:3306"
      volumes:
        - mysql_data:/var/lib/mysql
      networks:
        - saas-network
        
    backend:
      build: ./backend
      ports:
        - "5000:5000"
      environment:
        NODE_ENV: development
        DATABASE_URL: mysql://saas_user:saas_password123@mysql:3306/saas_db
        JWT_SECRET: dev-secret-key-change-in-production
        TWILIO_ACCOUNT_SID: ${TWILIO_ACCOUNT_SID}
        TWILIO_AUTH_TOKEN: ${TWILIO_AUTH_TOKEN}
        TWILIO_PHONE_NUMBER: ${TWILIO_PHONE_NUMBER}
        SENDGRID_API_KEY: ${SENDGRID_API_KEY}
        SENDGRID_FROM_EMAIL: ${SENDGRID_FROM_EMAIL}
      depends_on:
        - mysql
      networks:
        - saas-network
      volumes:
        - ./backend/src:/app/src  # Hot reload
        
    frontend:
      build: ./frontend
      ports:
        - "3000:80"
      environment:
        VITE_API_BASE_URL: http://backend:5000/api/v1
      depends_on:
        - backend
      networks:
        - saas-network
        
    phpmyadmin:  # Optional, for DB admin
      image: phpmyadmin
      ports:
        - "8080:80"
      environment:
        PMA_HOST: mysql
        PMA_USER: root
        PMA_PASSWORD: rootpassword123
      depends_on:
        - mysql
      networks:
        - saas-network
  
  volumes:
    mysql_data:
  
  networks:
    saas-network:
  ```

### Test Local Environment

- [ ] Copy `.env.example` to `.env` and fill with test values:
  - [ ] Twilio credentials
  - [ ] SendGrid credentials
- [ ] Start all services:
  - [ ] `docker-compose up -d`
  - [ ] Check all containers running: `docker-compose ps`
  - [ ] Check no errors: `docker-compose logs`
- [ ] Test connectivity:
  - [ ] Frontend: <http://localhost:3000> → UI loads
  - [x] Backend: <http://localhost:5000/api/v1/health> → OK response
  - [ ] MySQL: Connect via phpmyadmin <http://localhost:8080>
- [ ] Test workflow:
  - [ ] Register tenant on Frontend → calls Backend
  - [ ] Backend creates DB records → visible in phpmyadmin
  - [ ] Can read back data from API
- [ ] Stop & start:
  - [ ] `docker-compose down` (stop all)
  - [ ] `docker-compose up` (start again)
  - [ ] Verify data persisted in MySQL volume
- [ ] Clean up:
  - [ ] `docker-compose down -v` (remove volumes)
  - [ ] Verify MySQL data deleted

---

## 📋 GIAI ĐOẠN 2: AWS Account & IAM Setup (Tuần 1-2)

### AWS Account Setup

- [x] Login to AWS Console (or create account)
- [x] Verify region: `us-east-1` (or choose closest region)
- [ ] Enable billing alerts:
  - [ ] Billing > Billing Preferences
  - [ ] Receive Free Tier Usage Alerts: Yes
  - [ ] Receive Billing Alerts: Yes
  - [ ] CloudWatch Alarm threshold: $100 (or lower)

### IAM User for CI/CD/Deployment

- [x] Create IAM user: `github-actions-user` (or `deployment-user`)
- [x] Attach policies:
  - [x] `AmazonEC2ContainerRegistryPowerUser` (for ECR)
  - [x] `AmazonECS_FullAccess` (for ECS)
  - [x] `AmazonRDSFullAccess` (for RDS)
  - [x] `AmazonS3FullAccess` (for S3)
  - [x] `CloudFrontFullAccess` (for CloudFront)
  - [x] `CloudWatchLogsFullAccess` (for CloudWatch)
- [x] Generate access keys:
  - [x] Access Key ID: `AKIA...`
  - [x] Secret Access Key: (save securely)
  - [x] Store in password manager or GitHub Secrets later

### IAM Role for EC2/ECS

- [x] Create IAM role: `ecs-task-execution-role`
- [x] Trust entity: ECS Tasks
- [x] Permissions:
  - [x] `AmazonECSTaskExecutionRolePolicy` (default)
  - [x] `SecretsManagerReadWrite` (for Secrets Manager)
  - [x] `CloudWatchLogsFullAccess`
  - [x] `AmazonEC2ContainerRegistryReadOnly`

### Store Secrets Securely

- [ ] Use AWS Secrets Manager (not environment variables in Git):
  - [ ] Create secret: `saas/database`
    - [ ] Value: `mysql://saas_user:pass@host:3306/saas_db`
  - [ ] Create secret: `saas/jwt-secret`
  - [ ] Create secret: `saas/twilio-account-sid`, etc.

---

## 📋 GIAI ĐOẠN 3: Network Setup - VPC & Security Groups (Tuần 2)

### VPC Setup (Use Default VPC or Create Custom)

- [ ] Choose: Use default VPC (easier for testing) or create custom VPC
- [ ] If custom VPC:
  - [ ] CIDR: `10.0.0.0/16`
  - [ ] Create Public Subnet: `10.0.1.0/24` (us-east-1a)
  - [ ] Create Private Subnet: `10.0.2.0/24` (us-east-1a) - for RDS, optional for ECS
  - [ ] Create Internet Gateway → attach to VPC
  - [ ] Create Nat Gateway (if using private subnets)
  - [ ] Route tables configured correctly

### Security Groups

- [x] **RDS Security Group** (`rds-sg`):
  - [x] Inbound: MySQL (3306) from Backend SG only
  - [ ] Outbound: None (default allow all is OK)
  - [x] No public access
  
- [x] **Backend/ECS Security Group** (`backend-sg`):
  - [x] Inbound:
    - [x] HTTP (80) from ALB SG
    - [x] HTTPS (443) from ALB SG
    - [ ] SSH (22) from your IP (for debugging)
  - [ ] Outbound: All traffic (to contact Twilio, SendGrid, RDS)
  
- [x] **ALB Security Group** (`alb-sg`):
  - [x] Inbound:
    - [x] HTTP (80) from 0.0.0.0/0 (internet)
    - [x] HTTPS (443) from 0.0.0.0/0 (internet)
  - [ ] Outbound: All traffic (to backend)
  
- [ ] **Frontend Security Group** (if separate, optional):
  - [ ] Similar to ALB SG for public access

---

## 📋 GIAI ĐOẠN 4: Database Setup - RDS MySQL (Tuần 2)

### Create RDS MySQL Instance

- [x] Go to RDS > Create database
- [x] Engine: MySQL 8.0 (latest 8.0.x)
- [x] Template: Free tier (or production for real use)
- [x] Instance class: `db.t3.micro` (free tier) or `db.t3.small`
- [x] Storage:
  - [x] Allocated storage: 20 GB
  - [x] Storage type: General Purpose SSD (gp2)
  - [x] Enable auto scaling: No (for testing)
- [ ] High Availability:
  - [ ] Multi-AZ: No (for cost, enable for production)
  - [ ] Read replicas: No
- [ ] Backup & maintenance:
  - [ ] Backup retention: 7 days
  - [ ] Backup window: 03:00-04:00 UTC
  - [ ] Auto minor version upgrade: Yes
  - [ ] Maintenance window: sun-04:00-05:00 UTC
- [ ] Deletion protection: Enable (prevent accidental delete)
- [x] DB instance identifier: `saas-mysql-instance`
- [x] Master username: `admin`
- [x] Master password: (generate strong password, save securely)
- [x] Database name: `saas_db`
- [x] VPC: Default or your custom VPC
- [x] Security group: RDS SG (created earlier)
- [x] Publicly accessible: No (only from VPC)
- [ ] Enable encryption: Yes (default)
- [x] Create database

### RDS Connection Details

- [ ] Wait for instance to be "Available" (~10-15 min)
- [ ] Copy endpoint: `saas-mysql-instance.c9akciq32.us-east-1.rds.amazonaws.com`
- [ ] Save connection string template:

  ```env
  DATABASE_URL=mysql://admin:password@saas-mysql-instance.c9akciq32.us-east-1.rds.amazonaws.com:3306/saas_db
  ```

### Initialize Database with Prisma

- [ ] Connect from local (temporarily):
  - [ ] Get your public IP: `curl ifconfig.me`
  - [ ] Add temporary inbound rule to RDS SG: MySQL (3306) from your IP
  - [ ] Test connection: `mysql -h <rds-endpoint> -u admin -p`
- [ ] Run migrations:
  - [ ] Set DATABASE_URL env var
  - [ ] `npx prisma migrate deploy` (or `prisma db push`)
  - [ ] Verify tables created: `show tables;`
- [ ] Optionally seed data:
  - [ ] `npm run prisma:seed`
- [ ] Remove your IP from RDS SG (security)

### Database Backups

- [ ] Enable automated backups (done on creation)
- [ ] Configure backup retention: 7 days
- [ ] Manual backup: Take snapshot before major changes

---

## 📋 GIAI ĐOẠN 5: Container Registry - ECR (Tuần 2-3)

### Create ECR Repositories

- [x] Go to ECR > Create repository
- [x] Create repo 1: `saas-backend`
  - [ ] Tag immutability: Disable
  - [ ] Scan on push: Enable (optional, for security)
  - [ ] Image lifecycle policy: No (optional)
- [ ] Create repo 2: `saas-frontend`
  - [ ] Same settings as above
- [ ] Note registry URL: `123456789012.dkr.ecr.us-east-1.amazonaws.com`

### Configure Local Docker for ECR

- [ ] Login to ECR:

  ```bash
  aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com
  ```

- [ ] Verify login successful

### Tag & Push Backend Image

- [ ] Build image locally:

  ```bash
  cd backend
  docker build -t backend:v1 .
  ```

- [ ] Tag for ECR:

  ```bash
  docker tag backend:v1 123456789012.dkr.ecr.us-east-1.amazonaws.com/saas-backend:v1
  ```

- [ ] Push to ECR:

  ```bash
  docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/saas-backend:v1
  ```

- [ ] Verify in ECR console

### Tag & Push Frontend Image

- [ ] Similar process for frontend
- [ ] Verify in ECR console

---

## 📋 GIAI ĐOẠN 6: Backend Deployment - ECS Fargate (Tuần 3)

### Create ECS Cluster

- [ ] Go to ECS > Create cluster
- [ ] Cluster name: `saas-cluster`
- [ ] Infrastructure: **Fargate** (serverless, no EC2 management)
- [ ] Networking:
  - [ ] VPC: Default or custom
  - [ ] Subnets: Select public subnets (or private + NAT)
- [ ] Create cluster

### Create Task Definition

- [ ] Go to Task Definitions > Create new
- [ ] Task family: `saas-backend-task`
- [ ] Infrastructure requirements:
  - [ ] Launch type: Fargate
  - [ ] Operating system: Linux
  - [ ] CPU: 256 (.25 vCPU)
  - [ ] Memory: 512 MB
  - [ ] Network mode: awsvpc (required for Fargate)
- [ ] Container definition:
  - [ ] Name: `backend`
  - [ ] Image URI: `123456789012.dkr.ecr.us-east-1.amazonaws.com/saas-backend:v1`
  - [ ] Port mappings:
    - [ ] Container port: 5000
    - [ ] Protocol: TCP
  - [ ] Environment variables:
    - [ ] `NODE_ENV` = `production`
    - [ ] `DATABASE_URL` = retrieve from Secrets Manager (or set in ECS Service override)
    - [ ] `JWT_SECRET` = retrieve from Secrets Manager
    - [ ] Other env vars as needed
  - [ ] Log configuration:
    - [ ] Log driver: awslogs
    - [ ] Log group: `/ecs/saas-backend` (create new)
    - [ ] Log stream prefix: `ecs`
    - [ ] Region: us-east-1
  - [ ] Health check (optional):
    - [ ] Command: `CMD-SHELL,curl -f http://localhost:5000/api/v1/health || exit 1`
    - [ ] Interval: 30s
    - [ ] Timeout: 10s
    - [ ] Retries: 3
    - [ ] Start period: 40s
- [ ] Task role & execution role:
  - [ ] Execution role: `ecs-task-execution-role` (created earlier)
  - [ ] Task role: `ecs-task-role` (optional, for app permissions)
- [ ] Create task definition

### Create Application Load Balancer (ALB)

- [x] Go to EC2 > Load Balancers > Create
- [x] Load balancer type: Application Load Balancer
- [x] Name: `saas-alb`
- [x] Scheme: Internet-facing
- [ ] IP address type: IPv4
- [ ] VPC: Same as cluster
- [x] Subnets: Select public subnets (2+ for HA)
- [x] Security groups: ALB SG (created earlier)
- [ ] Listener (HTTP):
  - [x] Protocol: HTTP
  - [x] Port: 80
  - [x] Default action: Forward to target group (create new)
    - [x] Name: `saas-backend-tg`
    - [x] Protocol: HTTP
    - [x] Port: 5000
    - [ ] VPC: Same
    - [ ] Health check:
      - [x] Protocol: HTTP
      - [x] Path: `/`
      - [x] Port: 5000
      - [ ] Interval: 30 seconds
      - [ ] Timeout: 10 seconds
      - [ ] Healthy threshold: 2
      - [ ] Unhealthy threshold: 3
- [x] Create ALB
- [ ] Record ALB DNS: `saas-alb-123456.us-east-1.elb.amazonaws.com`

### Create ECS Service

- [ ] Go to ECS > Cluster > Create service
- [ ] Compute options: Fargate
- [ ] Task definition: saas-backend-task:1
- [ ] Service name: `saas-backend-service`
- [ ] Desired count: 2 (for HA)
- [ ] Deployment strategy: Rolling update
  - [ ] Min running tasks: 1
  - [ ] Max running tasks: 4
  - [ ] Deployment circuit breaker: Enable
- [ ] Networking:
  - [ ] VPC: Same as cluster
  - [ ] Subnets: Private (if available) or public
  - [ ] Security group: Backend SG
  - [ ] Auto-assign public IP: Enabled (for Fargate, if using public subnets)
- [ ] Load balancing:
  - [ ] Load balancer type: Application Load Balancer
  - [ ] ALB: saas-alb
  - [ ] Container: backend:5000
  - [ ] Target group: saas-backend-tg
- [ ] Create service

### Test Backend Deployment

- [ ] Wait for tasks to be "Running" (~2 min)
- [ ] Test health endpoint:

  ```bash
  curl http://saas-alb-123456.us-east-1.elb.amazonaws.com/api/v1/health
  ```

- [ ] Should return `{ status: "ok" }`
- [ ] Test database connection:

  ```bash
  curl http://saas-alb-123456.us-east-1.elb.amazonaws.com/api/v1/tenants/register -X POST \
    -H "Content-Type: application/json" \
    -d '{"companyName":"Test","adminEmail":"test@test.com","adminPassword":"pass123","phone":"123"}'
  ```

- [ ] Should create tenant in RDS

---

## 📋 GIAI ĐOẠN 7: Frontend Deployment - S3 + CloudFront (Tuần 3-4)

### Create S3 Bucket

- [ ] Go to S3 > Create bucket
- [ ] Bucket name: `saas-frontend-abc123def456` (must be globally unique)
- [ ] Region: us-east-1
- [ ] Block public access:
  - [ ] Block all public access: Yes (we'll use CloudFront)
- [ ] Enable versioning: Yes (for rollback capability)
- [ ] Enable encryption:
  - [ ] Server-side encryption: Enable
  - [ ] Encryption type: AES-256 (or KMS)
- [ ] Create bucket

### Upload Frontend Build

- [ ] Build frontend locally:

  ```bash
  cd frontend
  npm run build  # generates dist/ folder
  ```

- [ ] Sync to S3:

  ```bash
  aws s3 sync dist s3://saas-frontend-abc123def456/ --delete
  ```

- [ ] Or use AWS Console: Upload dist files
- [ ] Verify files in S3 console

### S3 Bucket Policy (for CloudFront)

- [ ] Go to bucket > Permissions > Bucket policy
- [ ] Add policy to allow CloudFront OAI only:

  ```json
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity EYYY..."
        },
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::saas-frontend-abc123def456/*"
      }
    ]
  }
  ```

### Create CloudFront Distribution

- [ ] Go to CloudFront > Create distribution
- [ ] Origin:
  - [ ] Origin domain: saas-frontend-abc123def456.s3.us-east-1.amazonaws.com
  - [ ] Origin access: Legacy access identities (or restrict bucket access via OAI)
  - [ ] Create OAI: Yes (new)
  - [ ] Bucket policy: Update bucket policy (let CloudFront do it)
- [ ] Default cache behavior:
  - [ ] Allowed HTTP methods: GET, HEAD
  - [ ] Cached HTTP methods: GET, HEAD
  - [ ] Cache policy: CachingOptimized (or custom)
  - [ ] Compress objects automatically: Yes (gzip)
  - [ ] TTL settings:
    - [ ] Default: 86400 (1 day) for static assets
    - [ ] Max: 31536000 (1 year)
- [ ] Settings:
  - [ ] Default root object: `index.html`
  - [ ] Custom error responses:
    - [ ] 404 Not Found → 200 index.html (for React Router)
    - [ ] 403 Forbidden → 200 index.html
- [ ] SSL/TLS:
  - [ ] HTTPS required: Yes (require HTTPS)
  - [ ] SSL protocol: TLSv1.2_2021 (or default)
- [ ] Create distribution
- [ ] Wait for status to be "Deployed" (~15-30 min)

### Test CloudFront Distribution

- [ ] Get distribution domain: `d123abc.cloudfront.net`
- [ ] Open <http://d123abc.cloudfront.net> in browser
- [ ] Should see frontend UI
- [ ] Test navigation (React Router)
- [ ] Check DevTools > Network > gzip compression enabled
- [ ] Check cache headers

### Custom Domain (Optional)

- [ ] Register domain (Route 53 or external registrar)
- [ ] Add CNAME record: `app.example.com` → `d123abc.cloudfront.net`
- [ ] Request SSL certificate in ACM
- [ ] Attach to CloudFront
- [ ] Update CloudFront origin to use custom domain

---

## 📋 GIAI ĐOẠN 8: SSL/TLS Certificates (Tuần 3-4)

### Request SSL Certificate from ACM

- [ ] Go to AWS Certificate Manager > Request certificate
- [ ] Domain name: `api.example.com` (for backend ALB)
- [ ] Add alternative domain: `example.com`, `app.example.com`, etc.
- [ ] Validation method: DNS (preferred) or Email
- [ ] If DNS: Add CNAME to your domain registrar
- [ ] Certificate will be issued and verified
- [ ] Attach to ALB listener (HTTPS port 443)

### Update ALB Listener for HTTPS

- [ ] Go to EC2 > Load Balancers > saas-alb
- [ ] Add listener:
  - [ ] Protocol: HTTPS
  - [ ] Port: 443
  - [ ] SSL certificate: (select from ACM)
  - [ ] Default action: Forward to target group `saas-backend-tg`
- [ ] Update HTTP listener (port 80):
  - [ ] Action: Redirect to HTTPS
- [ ] Test: `https://api.example.com/api/v1/health`

---

## 📋 GIAI ĐOẠN 9: Monitoring & Logging - CloudWatch (Tuần 4)

### CloudWatch Log Groups

- [ ] Already created by ECS: `/ecs/saas-backend`
- [ ] Create additional groups if needed:
  - [ ] `/rds/saas-mysql` (if RDS logs enabled)
  - [ ] `/aws/s3/access-logs` (optional, for S3 access logs)
  - [ ] `/aws/lambda/...` (if using Lambda)

### View Logs

- [ ] Go to CloudWatch > Log groups > `/ecs/saas-backend`
- [ ] View log streams (one per task)
- [ ] Search logs: Filter by keyword (ERROR, WARN)
- [ ] Insights: Run queries on logs

### CloudWatch Dashboards

- [ ] Go to CloudWatch > Dashboards > Create
- [ ] Add widgets:
  - [ ] **ECS metrics:**
    - [ ] CPU utilization
    - [ ] Memory utilization
    - [ ] Task count (desired vs running)
  - [ ] **ALB metrics:**
    - [ ] Target group health
    - [ ] HTTP request count
    - [ ] Response time (latency)
    - [ ] HTTP 5xx errors
    - [ ] HTTP 4xx errors
  - [ ] **RDS metrics:**
    - [ ] CPU utilization
    - [ ] Database connections
    - [ ] Read/Write latency
    - [ ] Free storage space
  - [ ] **Application metrics (from logs insights):**
    - [ ] Error rate
    - [ ] Request count by endpoint
    - [ ] Response time distribution

### CloudWatch Alarms

- [ ] Create alarms for:
  - [ ] **ECS CPU > 80%** → SNS notification
  - [ ] **ECS Memory > 80%** → SNS notification
  - [ ] **RDS CPU > 70%** → SNS notification
  - [ ] **RDS storage < 5%** → SNS notification
  - [ ] **ALB HTTP 5xx > 5 per minute** → SNS notification
  - [ ] **ALB target health < desired count** → SNS notification
  - [ ] **API response time > 5 seconds** → SNS notification (if available in ALB metrics)

### SNS Topic for Notifications

- [ ] Create SNS topic: `saas-alerts`
- [ ] Create subscription:
  - [ ] Type: Email
  - [ ] Endpoint: <devops@example.com> (or team emails)
- [ ] Subscribe to alarms
- [ ] Verify email subscription

---

## 📋 GIAI ĐOẠN 10: CI/CD Pipeline (Tuần 4-5)

### GitHub Actions for Automated Deployment (if using GitHub)

- [ ] Create `.github/workflows/deploy.yml`:

  ```yaml
  name: Deploy to AWS

  on:
    push:
      branches: [main]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v2
        
        - name: Configure AWS credentials
          uses: aws-actions/configure-aws-credentials@v1
          with:
            aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
            aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
            aws-region: us-east-1
        
        - name: Login to ECR
          id: login-ecr
          uses: aws-actions/amazon-ecr-login@v1
        
        - name: Build & push backend
          env:
            ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
            IMAGE_TAG: ${{ github.sha }}
          run: |
            cd backend
            docker build -t $ECR_REGISTRY/saas-backend:$IMAGE_TAG .
            docker push $ECR_REGISTRY/saas-backend:$IMAGE_TAG
        
        - name: Update ECS service
          run: |
            aws ecs update-service \
              --cluster saas-cluster \
              --service saas-backend-service \
              --force-new-deployment
        
        - name: Build & push frontend
          env:
            ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
            IMAGE_TAG: ${{ github.sha }}
          run: |
            cd frontend
            docker build -t $ECR_REGISTRY/saas-frontend:$IMAGE_TAG .
            docker push $ECR_REGISTRY/saas-frontend:$IMAGE_TAG
        
        - name: Invalidate CloudFront cache
          run: |
            aws cloudfront create-invalidation \
              --distribution-id E123ABC \
              --paths "/*"
  ```

### Setup GitHub Secrets

- [ ] Go to GitHub repo > Settings > Secrets
- [ ] Add secrets:
  - [ ] `AWS_ACCESS_KEY_ID` - from IAM user
  - [ ] `AWS_SECRET_ACCESS_KEY` - from IAM user

### Manual Deployment (Alternative)

- [ ] If not using CI/CD, deploy manually:

  ```bash
  # Backend
  aws ecr get-login-password | docker login --username AWS --password-stdin <ECR_URL>
  docker build -t saas-backend:v1 backend/
  docker tag saas-backend:v1 <ECR_URL>/saas-backend:v1
  docker push <ECR_URL>/saas-backend:v1
  aws ecs update-service --cluster saas-cluster --service saas-backend-service --force-new-deployment
  
  # Frontend
  cd frontend
  npm run build
  aws s3 sync dist s3://saas-frontend-abc/ --delete
  aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
  ```

---

## 📋 GIAI ĐOẠN 11: Database Backup & Disaster Recovery (Tuần 4-5)

### RDS Automated Backups

- [ ] Already configured on RDS creation:
  - [ ] Retention: 7 days
  - [ ] Backup window: 03:00-04:00 UTC
  - [ ] Multi-AZ: (optional for HA)

### Manual Snapshots

- [ ] Go to RDS > Snapshots > Manual
- [ ] Create snapshot before major changes
- [ ] Name: `saas-db-backup-<date>`
- [ ] Copy snapshot to different region (optional, for DR)

### RDS Backup Testing

- [ ] Periodically restore from backup to test DB:
  - [ ] Restore snapshot
  - [ ] Connect & verify data
  - [ ] Delete test DB

### S3 Versioning & Lifecycle

- [ ] S3 versioning: Already enabled
- [ ] Lifecycle policy (optional):
  - [ ] Transition old versions to Glacier (30 days)
  - [ ] Delete versions after 90 days
- [ ] Test restore from old versions

### Disaster Recovery Runbook

- [ ] Document steps:
  1. If RDS fails: Restore from latest snapshot (< 1 hour RTO)
  2. If backend fails: Tasks auto-restart, ALB health checks ensure availability
  3. If frontend fails: Invalidate CloudFront cache, re-upload to S3
  4. If entire region fails: Backup in another region (Phase 2)
- [ ] Recovery Point Objective (RPO): 1 day (RDS backups)
- [ ] Recovery Time Objective (RTO): 1 hour (restore snapshot)

---

## 📋 GIAI ĐOẠN 12: Cost Optimization (Tuần 5)

### Analyze Current Costs

- [ ] Go to AWS Billing > Cost Explorer
- [ ] Review costs by service:
  - [ ] RDS: typically $20-30/month (t3.micro)
  - [ ] ECS Fargate: ~$10-20/month (256 CPU, 512 MB, 2 tasks)
  - [ ] ALB: ~$15/month
  - [ ] CloudFront: varies by data transfer (~$0.085/GB)
  - [ ] S3: minimal for small file storage
  - [ ] Total estimate: $50-100/month for dev/test

### Cost Optimization Tips

- [ ] Use t3.micro for database (free tier eligible)
- [ ] Scale down tasks during off-hours (optional, requires Lambda/automation)
- [ ] Use reserved instances if long-term (saves ~30%)
- [ ] Enable S3 glacier transitions for old data
- [ ] Monitor data transfer (main cost driver for CloudFront)
- [ ] Set up budget alerts: AWS Billing > Budgets

### Cost Tracking

- [ ] Tag all resources with:
  - [ ] `Project: SaaS-Customer-Manager`
  - [ ] `Environment: dev/test/prod`
  - [ ] `CostCenter: engineering`
- [ ] Use cost anomaly detection: AWS Cost Anomaly Detection

---

## 📋 GIAI ĐOẠN 13: Infrastructure as Code (IaC) - Optional (Tuần 5)

### CloudFormation or Terraform

- [ ] Option 1: CloudFormation (native AWS)
  - [ ] Create stack templates for VPC, RDS, ECS, ALB, etc.
  - [ ] Store in `infra/cloudformation/` directory
  - [ ] Version control templates
  
- [ ] Option 2: Terraform (multi-cloud support)
  - [ ] Create `.tf` files for all resources
  - [ ] Store in `infra/terraform/` directory
  - [ ] `terraform plan` before applying
  - [ ] Backend: S3 + DynamoDB for state locking

### IaC Benefits

- [ ] Reproducible infrastructure (dev ≈ prod)
- [ ] Easy disaster recovery (recreate from code)
- [ ] Version history
- [ ] Easier team onboarding

---

## 📋 GIAI ĐOẠN 14: Documentation & Runbooks (Tuần 5)

### Architecture Diagram

- [ ] Create diagram showing:
  - [ ] VPC layout with subnets, routing
  - [ ] RDS (private subnet)
  - [ ] ECS tasks in load balancer
  - [ ] ALB routing traffic
  - [ ] S3 + CloudFront for frontend
  - [ ] Security groups & IAM roles
  - [ ] Data flow (Frontend → ALB → Backend → RDS)
  - [ ] External services (Twilio, SendGrid)
- [ ] Use draw.io, Lucidchart, or AWS architecture tool
- [ ] Save as PNG/PDF in `docs/architecture.md`

### Infrastructure Runbook

- [ ] How to deploy manually:
  - [ ] Build Docker images
  - [ ] Push to ECR
  - [ ] Update ECS service
- [ ] How to scale:
  - [ ] Update ECS desired count
  - [ ] Update RDS instance class
  - [ ] Update TaskDefinition CPU/memory
- [ ] How to monitor:
  - [ ] CloudWatch dashboards
  - [ ] CloudWatch alarms
  - [ ] CloudWatch logs
- [ ] How to troubleshoot:
  - [ ] Check ECS task logs
  - [ ] Check ALB health
  - [ ] Check RDS connectivity
- [ ] How to roll back:
  - [ ] Re-deploy previous Docker image version
  - [ ] Restore DB from snapshot
  - [ ] Restore frontend files from S3 version

### Deployment Guide (for team)

- [ ] Step-by-step how to deploy:
  1. Setup AWS CLI credentials
  2. Build images: `docker build ...`
  3. Push to ECR: `docker push ...`
  4. Update ECS: `aws ecs update-service ...`
  5. Monitor: Check CloudWatch logs
  6. Verify: Test endpoints work
- [ ] Environment variables needed
- [ ] Where to find secrets (AWS Secrets Manager)
- [ ] Troubleshooting common issues

---

## ✅ SUCCESS CRITERIA FOR DEVOPS

- [ ] Docker Compose local environment fully working
  - [ ] Frontend at <http://localhost:3000>
  - [x] Backend at <http://localhost:5000>
  - [ ] MySQL at localhost:3306
  - [ ] Can perform end-to-end workflows
  
- [ ] AWS Infrastructure deployed:
  - [x] VPC with proper subnets & security groups
  - [x] RDS MySQL instance running & accessible
  - [x] ECR repositories for Backend & Frontend
  - [ ] ECS cluster & service running 2 tasks
  - [x] ALB routing traffic correctly
  - [ ] Frontend serving from S3 + CloudFront
  
- [ ] All services working:
  - [ ] Backend ALB health check passes: /api/v1/health → 200 OK
  - [ ] Frontend loads at CloudFront domain
  - [ ] Can register tenant, login, create customers, send SMS/Email
  - [ ] Database persists data across container restarts
  
- [ ] Monitoring & Logging:
  - [ ] CloudWatch logs viewable for all services
  - [ ] Dashboards created for key metrics
  - [ ] Alarms configured for failures
  - [ ] Email notifications working
  
- [ ] Security:
  - [x] No public DB access (only from VPC)
  - [ ] ALB requires HTTPS (or redirect HTTP to HTTPS)
  - [ ] Secrets stored in AWS Secrets Manager (not in code)
  - [x] IAM roles follow least-privilege principle
  
- [ ] Cost tracking:
  - [ ] All resources tagged
  - [ ] Budget alerts configured
  - [ ] Monthly cost < $150 (testing environment)
  
- [ ] CI/CD (if implemented):
  - [ ] GitHub Actions workflow deploys on push to main
  - [ ] New images pushed to ECR automatically
  - [ ] ECS service updates automatically
  - [ ] Frontend cache invalidated after deploy
  
- [ ] Documentation complete:
  - [ ] Architecture diagram
  - [ ] Deployment runbook
  - [ ] Monitoring guide
  - [ ] Backup & recovery procedures

---

## 📝 NOTES FOR THIS PERSON

1. **Security First**: Don't expose API keys, use Secrets Manager, restrict security groups
2. **Cost Control**: Monitor spending, use free tier when possible, auto-scale during off-hours
3. **Testing**: Test deployment multiple times before handing to team
4. **Backups**: Test restore procedures periodically (not just backup)
5. **Documentation**: Good docs = faster incident response
6. **Monitoring**: Set up alarms BEFORE problems happen
7. **Scaling**: Plan for growth (10x scale, 100x scale)
8. **Disaster Recovery**: Have a tested plan, not just hopes
9. **Automation**: Automate repetitive tasks (deployment, backups)
10. **Communication**: Keep team updated on infrastructure changes

---

## 📅 WEEK-BY-WEEK BREAKDOWN

| Week | Focus | Output | Sync Point |
| ------ | ------- | -------- | ----------- |
| W1 | Docker local compose, AWS account setup | Local env working with docker-compose up | Backend/Frontend Dockerfiles ready? |
| W2 | AWS infrastructure (VPC, RDS, ECR) | RDS accessible, images pushed to ECR | Infrastructure costs estimated? |
| W3 | ECS backend, ALB, CloudFront frontend | Backend running at ALB DNS, frontend at CloudFront | All services accessible? |
| W4 | Monitoring, logging, alarms | CloudWatch dashboards, email alerts working | Are metrics showing correctly? |
| W5 | CI/CD, cost optimization, documentation | Automated deployment working, docs complete | Ready for UAT? |
| W6 | Testing, troubleshooting, final setup | All systems tested, disaster recovery verified | Ready for production demo? |
