import { prisma } from '../src/lib/prisma';
import { slugify } from '../src/lib/utils';

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  
  console.log('🧹 Cleaned existing data');

  // 2. Create Categories
  const categories = [
    { name: 'Aromaterapia', description: 'Aceites esenciales, difusores y más' },
    { name: 'Velas & Inciensos', description: 'Aromas que transforman tu espacio' },
    { name: 'Cuidado Corporal', description: 'Productos naturales para tu piel' },
    { name: 'Meditación & Yoga', description: 'Todo para tu práctica diaria' },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: slugify(cat.name),
        description: cat.description,
      },
    });
    createdCategories.push(category);
  }
  console.log('🏷️ Created categories');

  // 3. Create Products
  const products = [
    {
      name: 'Difusor Ultrasónico Bambú',
      description: 'Difusor de aromaterapia ultrasónico con acabado en bambú real. Incluye luces LED suaves de 7 colores y apagado automático.',
      price: 89.90,
      compareAtPrice: 129.90,
      stock: 50,
      categorySlug: 'aromaterapia',
      images: [
        'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80',
        'https://images.unsplash.com/photo-1594834749740-74b4f56f1a8c?w=800&q=80'
      ],
      isActive: true,
    },
    {
      name: 'Set de Aceites Esenciales x6',
      description: 'Kit de 6 aceites esenciales puros y orgánicos (10ml c/u): Lavanda, Eucalipto, Menta, Árbol de Té, Limón y Naranja Dulce.',
      price: 69.90,
      compareAtPrice: null,
      stock: 100,
      categorySlug: 'aromaterapia',
      images: [
        'https://images.unsplash.com/photo-1608528577891-eb055944f2e7?w=800&q=80' // Reusing placeholder images for now
      ],
      isActive: true,
    },
    {
      name: 'Vela de Soja Lavanda y Vainilla',
      description: 'Vela artesanal vertida a mano con cera de soja 100% natural. Aroma relajante ideal para el dormitorio o momentos de lectura.',
      price: 39.90,
      compareAtPrice: 54.90,
      stock: 75,
      categorySlug: 'velas-inciensos',
      images: [
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&q=80',
        'https://images.unsplash.com/photo-1572004245791-5fbb7dd943de?w=800&q=80'
      ],
      isActive: true,
    },
    {
      name: 'Kit de Inciensos Artesanales Palo Santo',
      description: 'Caja con 20 varitas gruesas de incienso natural a base de Palo Santo peruano. Limpia energías y relaja el ambiente.',
      price: 24.90,
      compareAtPrice: null,
      stock: 120,
      categorySlug: 'velas-inciensos',
      images: [
        'https://images.unsplash.com/photo-1585501869389-9828d11626f8?w=800&q=80'
      ],
      isActive: true,
    },
    {
      name: 'Aceite de Jojoba Orgánico prensado en frío',
      description: 'Aceite vehicular puro de jojoba dorada, ideal para el cuidado de la piel y el cabello o para mezclar con aceites esenciales.',
      price: 45.90,
      compareAtPrice: 59.90,
      stock: 60,
      categorySlug: 'cuidado-corporal',
      images: [
        'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=800&q=80'
      ],
      isActive: true,
    },
    {
      name: 'Sales de Baño Relajantes Epson & Lavanda',
      description: 'Mezcla rica en magnesio para aliviar dolores musculares y promover el sueño profundo. Con auténticos capullos de lavanda.',
      price: 35.00,
      compareAtPrice: null,
      stock: 45,
      categorySlug: 'cuidado-corporal',
      images: [
        'https://images.unsplash.com/photo-1610488989524-7603126dd1df?w=800&q=80'
      ],
      isActive: true,
    },
    {
      name: 'Kit de Meditación Zen - Zafu + Zabuton',
      description: 'Conjunto de cojines para meditación rellenos de cáscara de trigo sarraceno y algodón. Funda de lona resistente y lavable.',
      price: 149.90,
      compareAtPrice: 180.00,
      stock: 20,
      categorySlug: 'meditacion-yoga',
      images: [
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80'
      ],
      isActive: true,
    },
    {
      name: 'Almohada Terapéutica Ocular de Lavanda',
      description: 'Almohadilla rellena de semillas de lino y lavanda. Úsala fría o tibia para aliviar migrañas o durante la relajación final de yoga (Savasana).',
      price: 59.90,
      compareAtPrice: 79.90,
      stock: 85,
      categorySlug: 'meditacion-yoga',
      images: [
        'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80'
      ],
      isActive: true,
    }
  ];

  for (const prod of products) {
    const category = createdCategories.find(c => c.slug === prod.categorySlug);
    if (category) {
      await prisma.product.create({
        data: {
          name: prod.name,
          slug: slugify(prod.name),
          sku: `SKU-${slugify(prod.name).substring(0, 8).toUpperCase()}-${Math.floor(Math.random() * 1000)}`,
          description: prod.description,
          price: prod.price,
          compareAtPrice: prod.compareAtPrice,
          stock: prod.stock,
          images: prod.images,
          isActive: prod.isActive,
          categoryId: category.id,
        },
      });
    }
  }

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
