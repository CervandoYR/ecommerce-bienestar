import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const settings = await prisma.storeSettings.findFirst();
  if (settings) {
    await prisma.storeSettings.update({
      where: { id: settings.id },
      data: { heroImageUrl: "/samay-munay-hero.png" }
    })
    console.log("Updated heroImageUrl successfully!")
  } else {
    console.log("No settings found to update.")
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())
