const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
      },
    });

    console.log('Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email}: ID = ${user.id}, Name = ${user.fullName}, Role = ${user.role}`);
    });

    // Get all projects
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        title: true,
        userId: true,
      },
    });

    console.log('\nProjects in database:');
    projects.forEach(project => {
      console.log(`- ${project.title}: ID = ${project.id}, User ID = ${project.userId}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();