const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Bersihkan data lama jika ada
  await prisma.product.deleteMany({});

  const initialProducts = [
    { id: 1, name: 'Buku', price: 15000 },
    { id: 2, name: 'Pulpen', price: 5000 },
  ];

  for (const item of initialProducts) {
    await prisma.product.create({
      data: item,
    });
  }

  console.log('Database berhasil di-seed dengan 2 data: Buku dan Pulpen.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
