/**
 * @file seed.js
 * @description Database seed script — Phase 11.
 * Creates sample tenant, admin user, customers, messages, and logs.
 * Safe to re-run: checks for existing data before inserting.
 *
 * Usage: npm run prisma:seed
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

/* ───── Seed data ───── */

const TENANT = {
  companyName: 'Acme Corp',
  slug: 'acme-corp',
  phone: '+84900000001',
};

const ADMIN_USER = {
  email: 'admin@acme.com',
  password: 'password123',
  fullName: 'Admin Acme',
  role: 'ADMIN',
};

const STAFF_USER = {
  email: 'staff@acme.com',
  password: 'password123',
  fullName: 'Staff Acme',
  role: 'STAFF',
};

const CUSTOMERS = [
  { fullName: 'Nguyen Van A', phone: '+84911000001', email: 'nguyenvana@example.com', address: '123 Le Loi, HCMC' },
  { fullName: 'Tran Thi B', phone: '+84911000002', email: 'tranthib@example.com', address: '456 Nguyen Hue, HCMC' },
  { fullName: 'Le Van C', phone: '+84911000003', email: 'levanc@example.com', address: '789 Tran Hung Dao, Hanoi' },
  { fullName: 'Pham Thi D', phone: '+84911000004', email: 'phamthid@example.com', address: '101 Hai Ba Trung, Hanoi' },
  { fullName: 'Hoang Van E', phone: '+84911000005', email: 'hoangvane@example.com', address: '202 Vo Van Tan, Da Nang' },
  { fullName: 'Vo Thi F', phone: '+84911000006', email: 'vothif@example.com', address: '303 Bach Dang, Da Nang' },
  { fullName: 'Dang Van G', phone: '+84911000007', email: 'dangvang@example.com', address: '404 Phan Dinh Phung, Hue' },
  { fullName: 'Bui Thi H', phone: '+84911000008', email: 'buithih@example.com', address: null },
  { fullName: 'Do Van I', phone: '+84911000009', email: 'dovani@example.com', address: '606 Nguyen Trai, Can Tho' },
  { fullName: 'Ngo Thi K', phone: '+84911000010', email: 'ngothik@example.com', address: '707 Le Duan, Vung Tau' },
];

const SAMPLE_MESSAGES = [
  { type: 'SMS', content: 'Chào bạn! Chúng tôi có chương trình khuyến mãi đặc biệt dành cho bạn.', status: 'DELIVERED', customerIdx: 0 },
  { type: 'SMS', content: 'Nhắc nhở: Hóa đơn tháng 1 của bạn sẽ đến hạn vào ngày 28/02.', status: 'SENT', customerIdx: 1 },
  { type: 'EMAIL', content: '<h1>Chào mừng!</h1><p>Cảm ơn bạn đã đăng ký dịch vụ của chúng tôi.</p>', subject: 'Chào mừng bạn đến với Acme Corp', status: 'DELIVERED', customerIdx: 2 },
  { type: 'EMAIL', content: '<p>Hóa đơn tháng 1/2026 đã sẵn sàng. Vui lòng kiểm tra.</p>', subject: 'Hóa đơn tháng 1/2026', status: 'FAILED', customerIdx: 3 },
  { type: 'SMS', content: 'Mã xác nhận của bạn là: 482910. Có hiệu lực trong 5 phút.', status: 'DELIVERED', customerIdx: 4 },
];

/* ───── Main seed function ───── */

async function main() {
  console.log('🌱 Starting database seed...\n');

  // 1. Upsert Tenant
  let tenant = await prisma.tenant.findUnique({ where: { slug: TENANT.slug } });

  if (tenant) {
    console.log(`  ✓ Tenant "${TENANT.companyName}" already exists (id: ${tenant.id})`);
  } else {
    tenant = await prisma.tenant.create({ data: TENANT });
    console.log(`  + Created tenant "${tenant.companyName}" (id: ${tenant.id})`);
  }

  // 2. Upsert Admin User
  const hashedAdminPw = await bcrypt.hash(ADMIN_USER.password, 12);
  let adminUser = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: ADMIN_USER.email } },
  });

  if (adminUser) {
    console.log(`  ✓ Admin user "${ADMIN_USER.email}" already exists`);
  } else {
    adminUser = await prisma.user.create({
      data: {
        email: ADMIN_USER.email,
        password: hashedAdminPw,
        fullName: ADMIN_USER.fullName,
        role: ADMIN_USER.role,
        tenantId: tenant.id,
      },
    });
    console.log(`  + Created admin user "${adminUser.email}" (id: ${adminUser.id})`);
  }

  // 3. Upsert Staff User
  const hashedStaffPw = await bcrypt.hash(STAFF_USER.password, 12);
  let staffUser = await prisma.user.findUnique({
    where: { tenantId_email: { tenantId: tenant.id, email: STAFF_USER.email } },
  });

  if (staffUser) {
    console.log(`  ✓ Staff user "${STAFF_USER.email}" already exists`);
  } else {
    staffUser = await prisma.user.create({
      data: {
        email: STAFF_USER.email,
        password: hashedStaffPw,
        fullName: STAFF_USER.fullName,
        role: STAFF_USER.role,
        tenantId: tenant.id,
      },
    });
    console.log(`  + Created staff user "${staffUser.email}" (id: ${staffUser.id})`);
  }

  // 4. Upsert Customers
  const createdCustomers = [];
  for (const cust of CUSTOMERS) {
    let existing = await prisma.customer.findUnique({
      where: { tenantId_email: { tenantId: tenant.id, email: cust.email } },
    });

    if (existing) {
      console.log(`  ✓ Customer "${cust.fullName}" already exists`);
      createdCustomers.push(existing);
    } else {
      const created = await prisma.customer.create({
        data: { ...cust, tenantId: tenant.id },
      });
      console.log(`  + Created customer "${created.fullName}" (id: ${created.id})`);
      createdCustomers.push(created);
    }
  }

  // 5. Create sample Messages + MessageLogs (only if no messages exist for this tenant)
  const existingMsgCount = await prisma.message.count({ where: { tenantId: tenant.id } });

  if (existingMsgCount > 0) {
    console.log(`  ✓ ${existingMsgCount} messages already exist for this tenant — skipping`);
  } else {
    for (const msg of SAMPLE_MESSAGES) {
      const customer = createdCustomers[msg.customerIdx];
      if (!customer) continue;

      const message = await prisma.message.create({
        data: {
          tenantId: tenant.id,
          customerId: customer.id,
          type: msg.type,
          content: msg.content,
          subject: msg.subject || null,
          status: msg.status,
          recipientPhone: msg.type === 'SMS' ? customer.phone : null,
          recipientEmail: msg.type === 'EMAIL' ? customer.email : null,
          sentAt: msg.status !== 'PENDING' ? new Date(Date.now() - Math.random() * 86400000) : null,
        },
      });

      // Create corresponding MessageLog
      await prisma.messageLog.create({
        data: {
          messageId: message.id,
          tenantId: tenant.id,
          customerId: customer.id,
          status: msg.status === 'DELIVERED' ? 'DELIVERED' : msg.status === 'SENT' ? 'SENT' : 'FAILED',
          providerMessageId: `seed_${msg.type.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          providerResponse: { source: 'seed', type: msg.type },
          errorReason: msg.status === 'FAILED' ? 'Seed data — simulated failure' : null,
        },
      });

      console.log(`  + Created ${msg.type} message to "${customer.fullName}" (status: ${msg.status})`);
    }
  }

  // 6. Summary
  const counts = {
    tenants: await prisma.tenant.count(),
    users: await prisma.user.count({ where: { tenantId: tenant.id } }),
    customers: await prisma.customer.count({ where: { tenantId: tenant.id } }),
    messages: await prisma.message.count({ where: { tenantId: tenant.id } }),
    messageLogs: await prisma.messageLog.count({ where: { tenantId: tenant.id } }),
  };

  console.log('\n📊 Database summary:');
  console.log(`   Tenants:      ${counts.tenants}`);
  console.log(`   Users:        ${counts.users}`);
  console.log(`   Customers:    ${counts.customers}`);
  console.log(`   Messages:     ${counts.messages}`);
  console.log(`   MessageLogs:  ${counts.messageLogs}`);
  console.log('\n✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
