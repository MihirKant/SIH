import { PrismaClient } from '@prisma/client';
import { INITIAL_UNIVERSITIES, INITIAL_CHALLENGES, INITIAL_PROJECTS, INITIAL_GRANTS } from '../src/lib/mockData';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding SIH database...');

  // Seed Universities
  for (const u of INITIAL_UNIVERSITIES) {
    await prisma.university.upsert({
      where: { code: u.code },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        code: u.code,
        district: u.district,
        state: u.state,
        type: u.type,
        departments: JSON.stringify(u.departments),
        facultyCount: u.facultyCount,
        studentCount: u.studentCount,
        activeProjects: u.activeProjects,
      },
    });
  }

  // Seed Challenges
  for (const c of INITIAL_CHALLENGES) {
    await prisma.challenge.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        subCategory: c.subCategory,
        district: c.district,
        locationName: c.locationName,
        latitude: c.latitude,
        longitude: c.longitude,
        images: JSON.stringify(c.images),
        status: c.status,
        urgencyScore: c.urgencyScore,
        impactScore: c.impactScore,
        upvotesCount: c.upvotesCount,
        assignedUniversityId: c.assignedUniversityId,
      },
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
