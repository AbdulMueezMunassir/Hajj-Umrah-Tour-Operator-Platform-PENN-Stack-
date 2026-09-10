import bcrypt from 'bcrypt';
import prisma from '../config/database';

export const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@mhktravels.com';

    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        firstName: 'MHK',
        lastName: 'Admin',
        phone: '+94 11 234 5678',
        role: 'ADMIN',
      },
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: admin123`);
    console.log('   ⚠️  Change this password in production!');
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
  }
};