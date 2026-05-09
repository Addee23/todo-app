import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("personal123", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      passwordHash: adminPassword,
      role: "admin",
    },
  });

  await prisma.user.upsert({
    where: { username: "personal" },
    update: {},
    create: {
      username: "personal",
      passwordHash: staffPassword,
      role: "staff",
    },
  });

  console.log("Users created");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
