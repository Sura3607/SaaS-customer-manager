# 🎯 SaaS Manager - Complete UI Usage Guide

Welcome to the SaaS Customer Manager platform! This guide will help you navigate and use every feature of the application.

---

## 📑 Table of Contents

1. [Getting Started](#getting-started)
2. [Landing Page](#landing-page)
3. [Authentication](#authentication)
4. [Dashboard](#dashboard)
5. [Messaging & Communications](#messaging--communications)
6. [Contacts Management](#contacts-management)
7. [Campaigns](#campaigns)
8. [Settings](#settings)
9. [Sidebar Navigation](#sidebar-navigation)
10. [Dark Theme Features](#dark-theme-features)

---

## Getting Started

The SaaS Manager is a multi-tenant customer communication platform that lets you:

- ✉️ Send SMS and Email campaigns to your customers
- 📊 Track message delivery and engagement
- 👥 Manage customer contacts and information
- 📈 View analytics and communication metrics

**Note:** All pages use a dark theme (#0d101b background) with light text for better visibility.

---

## Landing Page

### 📍 Location

**URL:** `/` (Home)

### 🎨 What You See

The landing page welcomes new visitors and introduces the platform's key features.

#### **Navigation Section**

- **Logo:** "SaaS Manager" in top-left corner
- **Login Button:** (top-right) For existing users
  - *Click here* if you already have an account
- **Sign Up Button:** (top-right, blue) For new users
  - *Click here* to create a new account

#### **Hero Section**

- **Headline:** "Build seamless communication experiences"
- **Description:** Overview of the platform's multi-tenant CRM capabilities
- **CTA Buttons:**
  - **Get Started** (blue button) → Navigates to registration page
  - **View Documentation** (text link) → Opens documentation

#### **Trusted Partners Section**

Shows logos of companies using the platform:

- ACME
- BlastOff
- DevCorp
- SkyNet
- Energy

#### **Features Section**

Three main features showcased:

1. **Multi-tenant Isolation**
   - Icon: Database icon
   - Description: Secure data separation for clients
   - CTA: "Learn more"

2. **Twilio SMS Integration**
   - Icon: Message icon
   - Description: Global SMS delivery
   - CTA: "View API Docs"

3. **SendGrid Email API**
   - Icon: Mail icon
   - Description: High-deliverability email
   - CTA: "Start Sending"

#### **Developer Signup Section**

- **Headline:** "Ready to scale your communications?"
- **Email Subscription Box:** Enter email and click "Subscribe"
- **Info Cards:**
  - High Performance (lightning icon)
  - Enterprise Security (shield icon)

#### **Footer**

- Links: Privacy Policy | Terms of Service | Cookie Policy
- Copyright: © 2026 ConnectSaaS Inc. All rights reserved

### 🎬 Actions

| Button/Link | Where It Goes | Purpose |
| --- | --- | --- |
| Get Started | Registration page | Create new account |
| Already have an account? | Login page | Sign in with credentials |
| Learn more | Documentation | Read about multi-tenant |
| View API Docs | API documentation | SMS integration details |
| Start Sending | Email setup | Email campaign setup |

---

## Authentication

### 🔐 Login Page

**URL:** `/login`

#### Form Fields (Registration)

1. **Organization** (Workspace dropdown)
   - Required: No (optional)
   - Purpose: Select which tenant environment to access
   - Example: "Acme Corp"

2. **Email Address**
   - Required: Yes ✓
   - Format: Valid email (e.g., <john@company.com>)
   - Icon: Mail icon

3. **Password**
   - Required: Yes ✓
   - Format: Your secure password
   - Icon: Lock icon
   - Note: Password is masked with dots

#### Helpful Links

- **Forgot password?** → Password reset flow (top-right of password field)
- **Don't have an account?** → Registration page (bottom)

#### Buttons (Registration)

- **Sign In** (blue button) → Login to dashboard
- **Security Badge:** Shows "Secure login with JWT" authentication

#### Footer (Registration)

Links to: Terms | Privacy | Status | Help

### 📝 Registration Page (Tenant Registration)

**URL:** `/register`

#### Header

- **Organization Name:** "SaaS Manager"
- **Links:**
  - "Already have an account?" (gray text)
  - "Sign In" (blue button)

#### Form Fields

1. **Full Name**
   - Required: No
   - Example: "John Doe"

2. **Organization Name**
   - Required: Yes ✓
   - Example: "Acme Corp"
   - Purpose: Your company name

3. **Email Address**
   - Required: Yes ✓
   - Format: Valid email
   - Example: "<john@company.com>"

4. **Password**
   - Required: Yes ✓
   - Min Length: 8 characters
   - Hint: "MIN. 8 CHARACTERS" displayed above field

5. **Confirm Password**
   - Required: Yes ✓
   - Purpose: Verify password matches
   - Must match Password field

6. **Phone Number**
   - Required: No
   - Example: "123-456-7890"

#### Buttons

- **Create Account** (blue button with arrow) → Creates tenant and redirects to login

#### Agreement

- Must agree to Terms of Service and Privacy Policy before registering
- Links are clickable in blue

#### Footer

- Links to: Terms | Privacy | Status | Help
- Copyright notice

### ✅ Registration Validation

The system checks:

- Email format is valid
- Passwords are at least 8 characters
- Passwords match
- Organization name is provided
- Email is unique in system

---

## Dashboard

**URL:** `/dashboard` (accessed after login)

### 🎯 Main Features

#### **Header**

- **Tenant Selector:** Dropdown showing current organization
  - Change which organization you're viewing
- **Search Bar:** Search across messages and data
- **Bell Icon:** Notifications

#### **Statistics Section (Top Cards)**

Four metric cards showing:

1. **SMS Sent**
   - Number of SMS messages sent
   - Small icon showing message volume

2. **Email Sent**
   - Total emails delivered
   - Metric tracked per time period

3. **Total Customers**
   - Current customer count
   - Aggregated across all communications

4. **Delivery Rate**
   - Percentage of successful deliveries
   - Calculated as (successful / total) × 100

#### **Messaging Volume Chart**

- **Type:** Line chart
- **X-axis:** Time periods (days/weeks)
- **Y-axis:** Message count
- **Purpose:** Visualize communication trends
- **Interaction:** Hover to see exact values

#### **Message Status Circle**

- **Display:** Circular progress indicator (92%)
- **Color:** Blue gradient
- **Meaning:** 92% of messages delivered successfully
- **Impact:** Shows platform reliability

#### **Recent Activity Table**

Shows latest messages sent:

| Column | Details |
| -------- | ------ |
| **RECIPIENT** | Customer name/number (shows avatar) |
| **CHANNEL** | SMS or Email (icon shows type) |
| **STATUS** | ✓ Delivered, ⏳ Pending, ✗ Failed |
| **TIME** | When message was sent (relative time) |
| **ACTION** | View details or retry |

**Dark Table Styling:**

- Background: Dark gray (#1a1f2e)
- Hover: Lighter shade (#232b3d)
- Text: White for readability

#### **Navigation from Dashboard**

- **View All Messages** → Redirects to `/messaging-history`
- Use sidebar to access other sections

---

## Messaging & Communications

### 📨 Messaging Page

**URL:** `/messaging`

#### **Fixed Header** (stays visible when scrolling)

- **Tenant Selector:** Change organization
- **Search Bar:** Find specific messages
- **Bell Icon:** Notifications

#### **Fixed Toolbar** (Logs Page, below header)

Five action buttons:

1. **+ New Campaign** (blue button)
   - Click to open modal overlay
   - Compose SMS or Email
   - See [New Campaign Modal](#new-campaign-modal) below

2. **View History** (text button)
   - Navigates to `/messaging-history`
   - See all sent and pending messages
   - Access with more filtering options

3. **Edit** (pencil icon)
   - Edit existing message/campaign
   - Requires selection before enabling

4. **Delete** (trash icon)
   - Remove message/campaign
   - Confirmation popup appears

#### **Message Composition Area**

**Tabs at top:**

- **SMS Tab** (Twilio)
  - Send via SMS/text message
  - Uses Twilio integration
- **Email Tab** (SendGrid)
  - Send via email
  - Uses SendGrid integration

##### **SMS Compose Form**

| Field | Type | Required | Notes |
| -------- | ------ | -------- | ----------- |
| **Recipient(s)** | Text/Phone | Yes | Phone number(s) with country code |
| **Message** | Textarea | Yes | SMS text (160 char limit displayed) |
| **Schedule** | DateTime | No | Send now or schedule for later |
| **Template** | Dropdown | No | Select pre-built templates |

**Buttons:**

- **Send Now** (blue) → Send immediately
- **Schedule** → Save for later delivery

##### **Email Compose Form**

| Field | Type | Required | Notes |
| -------- | ------ | -------- | ----------- |
| **To** | Email | Yes | Recipient email address(es) |
| **Subject** | Text | Yes | Email subject line |
| **Body** | Textarea | Yes | Email content (supports HTML) |
| **From** | Dropdown | Yes | Sender address from account |
| **CC** | Email | No | Additional recipients (visible) |
| **BCC** | Email | No | Hidden recipients |
| **Template** | Dropdown | No | Use existing template |
| **Attachments** | File upload | No | Attach files to email |

**Buttons:**

- **Send Now** (blue) → Send immediately
- **Save Draft** → Save for later

#### **New Campaign Modal**

**Triggered by:** Clicking **+ New Campaign** button

**Modal Contents:**

- Title: "Create New Campaign"
- Two tab options:
  - **SMS** - Full SMS form (see SMS section above)
  - **EMAIL** - Full Email form (see Email section above)
- Form fills entire modal width
- Close: Click X or press Escape

---

### 📊 Messaging History Page

**URL:** `/messaging-history`

#### **Purpose**

View all messages sent through the system with full CRUD operations.

#### **Fixed Header** (stays visible)

- **Tenant Selector**
- **Search Bar:** Quick search by recipient or content
- **Bell Icon:** Notifications

#### **Fixed Toolbar** (below header)

Five CRUD buttons:

1. **+ New Campaign** (blue button)
   - Opens modal to compose new SMS/Email
   - Same as main Messaging page

2. **👁️ View** (eye icon with label)
   - Click to open Detail Drawer
   - Shows complete message information
   - Preview message content

3. **✏️ Edit** (pencil icon with label)
   - Edit message (if still draft)
   - Works for scheduled messages

4. **🗑️ Delete** (trash icon with label)
   - Permanently remove message
   - Confirmation required

5. **⬇️ Export** (download icon, optional)
   - Export message history as CSV/PDF

#### **Messages Table**

Columns display in order:

| Column | Shows | Example |
| -------- | ------ | -------- |
| **RECIPIENT** | Customer info + avatar | JD avatar + "John Doe" |
| **CHANNEL** | Message type | SMS icon or Email icon |
| **STATUS** | Delivery status | ✓ Delivered (green) |
| **TIME** | When sent | "2 hours ago" |
| **ACTION** | Quick buttons | View / Edit / Delete |

#### **Status Values**

- ✓ **Delivered** - Successfully sent and confirmed
- ⏳ **Pending** - Waiting to send (scheduled)
- ⚠️ **Failed** - Delivery failed, error details available
- 📤 **Sent** - In transit to carrier

#### **Detail Drawer**

**Opens when:** Click "View" or row to expand

**Shows:**

- Full message content
- Recipient information
- Delivery status with timestamp
- Recipient feedback (if applicable)
- Message metadata (ID, time sent, etc.)
- Option to resend or edit

**Close:** Click X or click outside drawer

#### **Search & Filter**

**Search Bar:**

- Search by recipient name/number
- Search by email subject
- Search by message content
- Real-time filter as you type

**Optional Filters (if implemented):**

- By Status (Delivered, Pending, Failed)
- By Channel (SMS, Email)
- By Date Range
- By Recipient Group

---

## Contacts Management

**URL:** `/customers`

### 📇 Features

- **View all customer contacts**
- **Add new customers**
- **Edit customer information**
- **Delete customer records**
- **Segment customers** (if implemented)
- **Import contacts** (if implemented)

### Table Layout

| Column | Purpose |
| -------- | ------ |
| **Name** | Customer full name |
| **Email** | Contact email address |
| **Phone** | Phone number for SMS |
| **Organization** | Customer's company (if applicable) |
| **Status** | Active / Inactive |
| **Last Contact** | When last messaged |

### Actions

- **Add Contact:** + New Contact button
- **Edit:** Click row or edit icon
- **Delete:** Select and delete with confirmation
- **Search:** Find contacts by name/email/phone

---

## Campaigns

**URL:** `/logs`

### 🚀 Campaign Overview

Manage and monitor all marketing/communication campaigns.

### Typical Features

- **Create Campaign:** New campaign button with form
- **View Campaign Details:** Click campaign card or row
- **Track Performance:** Stats on opens, clicks, deliveries
- **Schedule Campaign:** Set date/time for sending
- **View Recipients:** See which customers in campaign
- **Cancel Campaign:** Stop scheduled campaign

### Campaign Status

- 📋 **Draft** - Not yet sent
- 📅 **Scheduled** - Queued for future send
- 📤 **Sending** - Currently in process
- ✓ **Sent** - Completed successfully
- ⚠️ **Partial** - Some errors in delivery

---

## Settings

**URL:** `/settings`

### ⚙️ Configuration Options

Typical settings include:

#### **Account Settings**

- Organization name
- Organization logo
- Contact information
- Timezone
- Language preference

#### **Communication Settings**

- Default SMS sender (if using Twilio)
- Email from address (SendGrid)
- Reply-to address
- Unsubscribe preferences

#### **API Keys & Integration**

- Twilio API credentials
- SendGrid API token
- Webhook endpoints
- API documentation

#### **User Management**

- Team members
- User roles and permissions
- Invoice/billing (if applicable)

#### **Security**

- Password policy
- Two-factor authentication
- API key rotation
- Activity logs

---

## Sidebar Navigation

### 🗂️ Left Sidebar Menu

Accessible on all protected pages (after login).

#### **Logo Section** (Top)

- **Icon + Text:** "SaaS Manager"
- **Position:** Top-left corner
- **Color:** White text on dark background
- **Collapse:** Can collapse sidebar to icons only

#### **Menu Items** (In order)

1. **🎯 Dashboards**
   - Main analytics and metrics
   - Url: `/dashboard`
   - Shows: Delivery stats, charts, recent activity

2. **📥 Inbox**
   - Send SMS and Email messages
   - URL: `/messaging`
   - Features: New campaign, message history access

3. **👥 Contacts**
   - Manage customer list
   - URL: `/customers`
   - Features: Add, edit, delete, import contacts

4. **🚀 Campaigns**
   - Campaign management
   - URL: `/logs`
   - Features: Create, schedule, track campaigns

5. **⚙️ Settings**
   - Account and integration settings
   - URL: `/settings`
   - Features: API keys, user management, security

#### **User Profile Section** (Bottom)

- **Avatar:** Colored circle with user initial
  - Example: "JD" for John Doe
- **Username:** First part of email
  - Example: "john" from <john@company.com>
- **Plan Type:** Subscription level (e.g., "PREMIUM PLAN")
- **Interaction:** Click to logout or access profile

#### **Visual Indicators**

- **Active Menu Item:** Highlighted in blue
  - Shows which page you're currently on
  - Left border accent on active item
- **Hover State:** Item highlights on mouse-over
- **Icons:** Visual indicators for each section

#### **Sidebar Toggle**

- **Collapse Button:** Double arrow (<<) to minimize
  - Shows only icons when collapsed
  - Tooltips appear on hover
- **Hover Expansion:** Automatic expansion on hover when collapsed

---

## Dark Theme Features

### 🌙 Color Scheme

The entire application uses a cohesive dark theme:

| Element | Color | Usage |
| --------- | ------- | ------- |
| **Main Background** | #0d101b | Page backgrounds |
| **Card Background** | #1a1f2e | Sidebar, cards, modals |
| **Secondary Bg** | #232b3d | Hover states, nested elements |
| **Border Color** | #2a3142 | Dividers, box borders |
| **Primary Text** | #ffffff | Headlines, labels |
| **Secondary Text** | #8a92a6 | Descriptions, helper text |
| **Primary Blue** | #1f73f9 | Buttons, links, active states |
| **Success Green** | (Ant Design) | Status indicators |

### 📝 Text Visibility

- **White Headers:** High contrast on dark backgrounds
- **Gray Secondary Text:** Readable without strain
- **Color Coded Status:** Visual distinction without text
- **Form Labels:** Bright white for clarity

### 🎨 Interactive Elements

#### **Forms & Inputs**

- **Input Background:** Dark gray (#1a1f2e)
- **Input Border:** Subtle (#2a3142)
- **Input Text:** White
- **Placeholder Text:** Medium gray
- **Focus State:** Blue border with light glow
- **Filled:** Blue highlight to show completion

#### **Tables**

- **Header Row:** Dark background, white text, bold
- **Data Rows:** Alternating dark shades for readability
- **Hover:** Slightly lighter shade to show selection
- **Borders:** Subtle dividers between rows
- **Text:** White on dark for maximum contrast

#### **Buttons**

- **Primary (Blue):** #1f73f9, white text
  - Used for main actions (Send, Create, etc.)
- **Secondary (Text):** Gray text, no background
  - Used for less important actions
- **Danger (Red):** For delete operations
  - With confirmation dialog

#### **Tooltips & Popovers**

- **Background:** Dark gray with slight transparency
- **Text:** White
- **Border:** Subtle blue or gray
- **Position:** Auto-positioned to avoid overflow

#### **Modals & Dialogs**

- **Background:** Dark background with overlay
- **Content Area:** Card-style with dark background
- **Header:** Bold white text, small cap labels
- **Close Button:** X icon in top-right
- **Buttons:** Primary/secondary at bottom

### ✨ Visual Polish

- **Smooth Transitions:** Animations on state changes
- **Consistent Spacing:** Padding and margins follow pattern
- **Icon Colors:** Adapt to context (blue for primary, gray for secondary)
- **Shadows:** Subtle box shadows for depth
- **Border Radius:** Rounded corners (4-12px) throughout

---

## 🎓 Quick Navigation Map

```plaintext
┌─────────────────────────────────────────────────┐
│  Landing Page (/) - Everyone can access        │
│  ├─ Get Started → Register page                │
│  ├─ Login → Login page                         │
│  └─ Learn More → Documentation                 │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  Login (/login)            │
        │  Service Account here      │
        └────────┬───────────────────┘
                 │
                 ▼
    ┌──────────────────────────────────┐
    │  Main Application (requires auth)│
    │                                  │
    │  ┌─ Dashboard (/dashboard)       │
    │  │   ├─ View all messages        │
    │  │   └─ See analytics            │
    │  │                               │
    │  ├─ Inbox (/messaging)           │
    │  │   ├─ + New Campaign (modal)   │
    │  │   ├─ View History             │
    │  │   ├─ SMS Form                 │
    │  │   └─ Email Form               │
    │  │                               │
    │  ├─ Messaging History            │
    │  │   (/messaging-history)        │
    │  │   ├─ CRUD Toolbar             │
    │  │   ├─ Message Table            │
    │  │   ├─ Search & Filter          │
    │  │   └─ Detail Drawer            │
    │  │                               │
    │  ├─ Contacts (/customers)        │
    │  │   ├─ View all contacts        │
    │  │   ├─ Add/Edit/Delete          │
    │  │   └─ Search                   │
    │  │                               │
    │  ├─ Campaigns (/logs)            │
    │  │   ├─ Create campaign          │
    │  │   ├─ Schedule send            │
    │  │   └─ Track performance        │
    │  │                               │
    │  └─ Settings (/settings)         │
    │      ├─ Account settings         │
    │      ├─ API keys                 │
    │      └─ User management          │
    │                                  │
    └──────────────────────────────────┘
```

---

## 💡 Tips & Best Practices

### ✅ Do's

- ✓ Use descriptive campaign names for easy identification
- ✓ Schedule messages during business hours for better engagement
- ✓ Test SMS/Email on sample contacts before bulk send
- ✓ Keep contact information updated
- ✓ Monitor delivery rates in dashboard
- ✓ Save email templates for repeated campaigns
- ✓ Use search functionality to find specific messages

### ❌ Don'ts

- ✗ Don't send messages without proper recipient list
- ✗ Don't exceed SMS character limit (160 chars) without awareness
- ✗ Don't share API keys in public repositories
- ✗ Don't delete campaigns without checking history first
- ✗ Don't overlook failed messages - check status regularly

---

## 🔐 Security

- All data transmitted via HTTPS/TLS encryption
- Passwords securely hashed with bcrypt
- JWT tokens for session management
- API keys stored securely (never logged)
- Multi-tenant data isolation
- Regular security backups

---

## 📞 Support & Help

### Getting Help

1. **In-App Help:** Look for "Help" links in footer
2. **Documentation:** Click "View Documentation" on landing page
3. **API Docs:** Available in Settings page
4. **Email Support:** <support@connectsaas.com> (for Enterprise plan)

### Common Issues

**Forgot Password?**

- Click "Forgot password?" on login page
- Receive reset link via email
- Follow reset instructions

**Can't Find Contact?**

- Use search bar to find by name/email
- Check if contact was imported correctly
- Verify organization/tenant selection

**Message Failed to Send?**

- Check recipient format (valid number/email)
- Verify API keys are configured
- Check account balance/limits
- Review status in Messaging History

---

## 📊 Data Formats

### SMS/Phone Numbers

- Format: International format recommended
- Example: +1 (555) 123-4567
- Twilio validates automatically

### Email Addresses

- Format: Standard email format
- Example: <john.doe@company.com>
- Must be valid and accessible

### CSV Import (Contacts)

```csv
Name, Email, Phone
John Doe, john@company.com, +1-555-1234
Jane Smith, jane@company.com, +1-555-5678
```

---

## 🎉 Conclusion

You now have a complete understanding of the SaaS Manager platform. Start by:

1. **Create an account** on the registration page
2. **Explore the Dashboard** to understand metrics
3. **Send your first message** via Inbox
4. **Manage contacts** for better segmentation
5. **Review history** to track performance

Happy communicating! 🚀

---

**Version:** 1.0  
**Last Updated:** 2026  
**Platform:** SaaS Customer Manager v3.0+
