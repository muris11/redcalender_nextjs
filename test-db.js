require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Test koneksi dengan query sederhana
    const userCount = await prisma.user.count();
    console.log(`Koneksi berhasil! Jumlah user: ${userCount}`);

    // Test query lainnya jika perlu
    // const users = await prisma.user.findMany();
    // console.log('Users:', users);
  } catch (error) {
    console.error("Error koneksi database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
