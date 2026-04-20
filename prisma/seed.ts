import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await hash("Admin1234!", 12);
  const doctorPassword = await hash("Doctor1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@medireferto.it" },
    update: {},
    create: {
      email: "admin@medireferto.it",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const doctorUser = await prisma.user.upsert({
    where: { email: "dott.rossi@medireferto.it" },
    update: {},
    create: {
      email: "dott.rossi@medireferto.it",
      password: doctorPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          firstName: "Mario",
          lastName: "Rossi",
          specialization: "Medicina Generale",
          licenseNumber: "RM12345",
          clinicName: "Studio Medico Rossi",
          clinicAddress: "Via Roma 1, 00100 Roma",
          phone: "+39 06 1234567",
        },
      },
    },
  });

  console.log("Seed completed:");
  console.log(`  Admin: ${admin.email}`);
  console.log(`  Doctor: ${doctorUser.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
