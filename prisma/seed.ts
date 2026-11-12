import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Florida ZIP Codes, Categories, Tigers and Leads...');

  // 1. Florida ZIP Codes
  const floridaZips = [
    // Orlando Area (Orange & Osceola)
    { zip: '32835', city: 'Orlando', county: 'Orange', lat: 28.524, lng: -81.488 }, // MetroWest
    { zip: '32801', city: 'Orlando', county: 'Orange', lat: 28.5383, lng: -81.3792 }, // Downtown
    { zip: '32819', city: 'Orlando', county: 'Orange', lat: 28.4554, lng: -81.4746 }, // Dr. Phillips
    { zip: '32827', city: 'Orlando', county: 'Orange', lat: 28.3812, lng: -81.2721 }, // Lake Nona
    { zip: '32789', city: 'Winter Park', county: 'Orange', lat: 28.5999, lng: -81.3392 },
    { zip: '34741', city: 'Kissimmee', county: 'Osceola', lat: 28.3047, lng: -81.4167 },
    { zip: '34747', city: 'Kissimmee', county: 'Osceola', lat: 28.3242, lng: -81.6033 }, // Celebration / Disney
    { zip: '34787', city: 'Winter Garden', county: 'Orange', lat: 28.5653, lng: -81.5862 },
    { zip: '34711', city: 'Clermont', county: 'Lake', lat: 28.5494, lng: -81.7729 },

    // Miami-Dade & Broward Area
    { zip: '33101', city: 'Miami', county: 'Miami-Dade', lat: 25.7743, lng: -80.1937 },
    { zip: '33139', city: 'Miami Beach', county: 'Miami-Dade', lat: 25.7907, lng: -80.1300 },
    { zip: '33178', city: 'Doral', county: 'Miami-Dade', lat: 25.8195, lng: -80.3553 },
    { zip: '33180', city: 'Aventura', county: 'Miami-Dade', lat: 25.9565, lng: -80.1392 },
    { zip: '33009', city: 'Hallandale Beach', county: 'Broward', lat: 25.9868, lng: -80.1487 },
    { zip: '33301', city: 'Fort Lauderdale', county: 'Broward', lat: 26.1224, lng: -80.1373 },
    { zip: '33064', city: 'Pompano Beach', county: 'Broward', lat: 26.2731, lng: -80.1148 },
    { zip: '33076', city: 'Parkland', county: 'Broward', lat: 26.3115, lng: -80.2526 },

    // Palm Beach Area
    { zip: '33431', city: 'Boca Raton', county: 'Palm Beach', lat: 26.3769, lng: -80.1009 },
    { zip: '33483', city: 'Delray Beach', county: 'Palm Beach', lat: 26.4615, lng: -80.0728 },
    { zip: '33401', city: 'West Palm Beach', county: 'Palm Beach', lat: 26.7153, lng: -80.0534 },

    // Tampa Bay & St. Petersburg Area
    { zip: '33602', city: 'Tampa', county: 'Hillsborough', lat: 27.9506, lng: -82.4572 },
    { zip: '33701', city: 'St. Petersburg', county: 'Pinellas', lat: 27.7676, lng: -82.6403 },
    { zip: '33755', city: 'Clearwater', county: 'Pinellas', lat: 27.9659, lng: -82.8001 },

    // Jacksonville Area
    { zip: '32202', city: 'Jacksonville', county: 'Duval', lat: 30.3322, lng: -81.6557 },
    { zip: '32256', city: 'Jacksonville', county: 'Duval', lat: 30.2223, lng: -81.5235 }
  ];

  for (const item of floridaZips) {
    await prisma.floridaZip.upsert({
      where: { zip: item.zip },
      update: item,
      create: item,
    });
  }

  // 2. Categories with multilingual names and Wizard Questions
  const categories = [
    {
      slug: 'house-cleaning',
      icon: 'Sparkles',
      nameEn: 'House & Airbnb Cleaning',
      namePt: 'Limpeza Residencial & Airbnb',
      nameEs: 'Limpieza de Casas & Airbnb',
      descriptionEn: 'Deep cleaning, regular turnover, move-in/out for homes & vacation rentals.',
      descriptionPt: 'Limpeza pesada (deep), recorrente e turnover de casas de temporada.',
      descriptionEs: 'Limpieza profunda, regular y turnover de propiedades vacacionales.',
      wizardQuestions: JSON.stringify([
        {
          id: 'type',
          labelEn: 'What type of cleaning do you need?',
          labelPt: 'Qual tipo de limpeza você precisa?',
          labelEs: '¿Qué tipo de limpieza necesitas?',
          options: [
            { value: 'standard', labelEn: 'Standard / Regular Cleaning', labelPt: 'Limpeza Padrão / Recorrente', labelEs: 'Limpieza Estándar' },
            { value: 'deep', labelEn: 'Deep Cleaning (Heavy duty)', labelPt: 'Deep Cleaning (Limpeza Pesada)', labelEs: 'Limpieza Profunda' },
            { value: 'airbnb', labelEn: 'Airbnb / Vacation Home Turnover', labelPt: 'Casas de Temporada / Airbnb', labelEs: 'Turnover Airbnb / Vacacional' },
            { value: 'move', labelEn: 'Move-in / Move-out Cleaning', labelPt: 'Mudança (Entrada ou Saída)', labelEs: 'Entrada o Salida (Mudanza)' }
          ]
        },
        {
          id: 'size',
          labelEn: 'Property Size / Layout',
          labelPt: 'Tamanho do Imóvel / Quartos e Banheiros',
          labelEs: 'Tamaño del Inmueble',
          options: [
            { value: '1bed_1bath', labelEn: '1 Bedroom / 1 Bath (~750 sq ft)', labelPt: '1 Quarto / 1 Banheiro (~750 sq ft)', labelEs: '1 Habitación / 1 Baño (~750 sq ft)' },
            { value: '2bed_2bath', labelEn: '2-3 Bedrooms / 2 Baths (~1,500 sq ft)', labelPt: '2 a 3 Quartos / 2 Banheiros (~1.500 sq ft)', labelEs: '2-3 Habitaciones / 2 Baños (~1.500 sq ft)' },
            { value: '4plus_bath', labelEn: '4+ Bedrooms / 3+ Baths (Large Home)', labelPt: '4+ Quartos / 3+ Banheiros (Casa Grande)', labelEs: '4+ Habitaciones / 3+ Baños' }
          ]
        },
        {
          id: 'extras',
          labelEn: 'Any extra services required?',
          labelPt: 'Deseja serviços extras?',
          labelEs: '¿Servicios adicionales?',
          options: [
            { value: 'none', labelEn: 'Standard (No extras)', labelPt: 'Padrão (Sem extras)', labelEs: 'Estándar' },
            { value: 'fridge_oven', labelEn: 'Inside Fridge & Oven', labelPt: 'Geladeira e Forno por dentro', labelEs: 'Interior de Nevera y Horno' },
            { value: 'windows', labelEn: 'Interior Windows & Blinds', labelPt: 'Janelas e Persianas internas', labelEs: 'Ventanas y Persianas' }
          ]
        }
      ])
    },
    {
      slug: 'handyman',
      icon: 'Wrench',
      nameEn: 'Handyman & Small Repairs',
      namePt: 'Handyman & Pequenos Reparos',
      nameEs: 'Handyman & Reparaciones',
      descriptionEn: 'Drywall patching, door locks, TV mounting, general fixes.',
      descriptionPt: 'Reparo de drywall, troca de fechaduras, instalação de TV e consertos.',
      descriptionEs: 'Reparación de drywall, cerraduras, colgar TV y arreglos en general.',
      wizardQuestions: JSON.stringify([
        {
          id: 'job_type',
          labelEn: 'What do you need repaired or installed?',
          labelPt: 'O que precisa ser consertado ou instalado?',
          labelEs: '¿Qué necesitas reparar o instalar?',
          options: [
            { value: 'tv_mounting', labelEn: 'TV Mounting & Shelves', labelPt: 'Instalação de TV na parede / Prateleiras', labelEs: 'Colgar TV / Repisas' },
            { value: 'drywall', labelEn: 'Drywall Hole / Patch Repair', labelPt: 'Reparo de Furos em Parede de Drywall', labelEs: 'Reparación de Drywall' },
            { value: 'plumbing_light', labelEn: 'Faucet / Toilet / Minor Plumbing', labelPt: 'Torneira / Vaso sanitário / Vazamentos leves', labelEs: 'Grifos / Inodoro / Plomería leve' },
            { value: 'electrical_light', labelEn: 'Ceiling Fan / Light Fixtures / Outlets', labelPt: 'Ventilador de Teto / Lustres / Tomadas', labelEs: 'Ventilador / Lámparas / Tomacorrientes' },
            { value: 'other', labelEn: 'Multiple Small Handyman Jobs', labelPt: 'Múltiplos pequenos reparos gerais', labelEs: 'Varios arreglos pequeños' }
          ]
        }
      ])
    },
    {
      slug: 'painting',
      icon: 'Paintbrush',
      nameEn: 'Painting & Drywall',
      namePt: 'Pintura Residencial & Comercial',
      nameEs: 'Pintura & Drywall',
      descriptionEn: 'Interior & exterior painting, baseboards, doors and drywall finish.',
      descriptionPt: 'Pintura interna e externa, rodapés, portas e acabamento.',
      descriptionEs: 'Pintura interior y exterior, zócalos, puertas y acabados.',
      wizardQuestions: JSON.stringify([
        {
          id: 'scope',
          labelEn: 'What area requires painting?',
          labelPt: 'Qual área será pintada?',
          labelEs: '¿Qué área requiere pintura?',
          options: [
            { value: 'interior_full', labelEn: 'Entire House Interior', labelPt: 'Casa Inteira (Interior)', labelEs: 'Interior Completo de Casa' },
            { value: 'rooms', labelEn: '1 to 3 Rooms only', labelPt: 'Apenas 1 a 3 Cômodos', labelEs: '1 a 3 Habitaciones' },
            { value: 'exterior', labelEn: 'Exterior Painting & Pressure Wash', labelPt: 'Pintura Externa & Lava a Jato', labelEs: 'Pintura Exterior' }
          ]
        }
      ])
    },
    {
      slug: 'landscaping',
      icon: 'Trees',
      nameEn: 'Lawn Care & Landscaping',
      namePt: 'Jardinagem & Manutenção de Grama',
      nameEs: 'Jardinería & Cuidado de Césped',
      descriptionEn: 'Mowing, edging, palm tree trimming, weed control & mulch.',
      descriptionPt: 'Corte de grama, poda de palmeiras, controle de ervas e mulch.',
      descriptionEs: 'Corte de césped, poda de palmeras y mantenimiento de jardín.',
      wizardQuestions: JSON.stringify([
        {
          id: 'lot_size',
          labelEn: 'Approximate yard size',
          labelPt: 'Tamanho aproximado do quintal/terreno',
          labelEs: 'Tamaño aproximado del terreno',
          options: [
            { value: 'small', labelEn: 'Small Lot (Under 5,000 sq ft)', labelPt: 'Lote Pequeno (Até 5.000 sq ft)', labelEs: 'Lote Pequeño (< 5.000 sq ft)' },
            { value: 'medium', labelEn: 'Standard Lot (5,000 - 10,000 sq ft)', labelPt: 'Lote Padrão (5.000 a 10.000 sq ft)', labelEs: 'Lote Estándar' },
            { value: 'large', labelEn: 'Large Estate (Over 10,000 sq ft / Acre)', labelPt: 'Terreno Grande (Mais de 10.000 sq ft)', labelEs: 'Terreno Grande' }
          ]
        }
      ])
    },
    {
      slug: 'furniture-assembly',
      icon: 'Armchair',
      nameEn: 'Furniture Assembly',
      namePt: 'Montagem de Móveis (IKEA, Wayfair)',
      nameEs: 'Armado de Muebles',
      descriptionEn: 'Bed frames, dressers, desks, TV units and patio sets.',
      descriptionPt: 'Camas, cômodas, armários, mesas e móveis de varanda.',
      descriptionEs: 'Camas, cómodas, escritorios y muebles de patio.',
      wizardQuestions: JSON.stringify([
        {
          id: 'items',
          labelEn: 'What items need assembly?',
          labelPt: 'Quais itens precisam de montagem?',
          labelEs: '¿Qué muebles necesitan ensamblaje?',
          options: [
            { value: 'bed_dresser', labelEn: 'Bed Frame / Dresser', labelPt: 'Cama / Cômoda', labelEs: 'Cama / Cómoda' },
            { value: 'desk_wardrobe', labelEn: 'Desk / Wardrobe / Dining Set', labelPt: 'Mesa / Guarda-roupa / Mesa de Jantar', labelEs: 'Escritorio / Armario' },
            { value: 'multiple', labelEn: 'Multiple boxes / Whole Room Package', labelPt: 'Vários móveis / Quarto completo', labelEs: 'Varios muebles / Paquete completo' }
          ]
        }
      ])
    },
    {
      slug: 'pool-maintenance',
      icon: 'Waves',
      nameEn: 'Pool Cleaning & Service',
      namePt: 'Manutenção & Limpeza de Piscina',
      nameEs: 'Mantenimiento de Piscinas',
      descriptionEn: 'Weekly chemical balance, brushing, vacuuming and pump checks.',
      descriptionPt: 'Química semanal, escovação, aspiração e revisão de bomba.',
      descriptionEs: 'Balance químico semanal, cepillado y revisión de bomba.',
      wizardQuestions: JSON.stringify([
        {
          id: 'frequency',
          labelEn: 'Service frequency needed',
          labelPt: 'Frequência do serviço',
          labelEs: 'Frecuencia del servicio',
          options: [
            { value: 'weekly', labelEn: 'Weekly Maintenance', labelPt: 'Manutenção Semanal Recorrente', labelEs: 'Mantenimiento Semanal' },
            { value: 'green_recovery', labelEn: 'Green Pool Recovery (Shock Treatment)', labelPt: 'Tratamento de Choque (Piscina Verde)', labelEs: 'Recuperación de Piscina Verde' }
          ]
        }
      ])
    },
    {
      slug: 'moving',
      icon: 'Truck',
      nameEn: 'Moving & Hauling',
      namePt: 'Mudanças & Descarte de Entulho',
      nameEs: 'Mudanzas & Carga',
      descriptionEn: 'Local moves, heavy lifting, truck loading, trash/furniture haul away.',
      descriptionPt: 'Mudanças locais na Flórida, carga de caminhão e descarte.',
      descriptionEs: 'Mudanzas locales, carga y descarga, remoción de escombros.',
      wizardQuestions: JSON.stringify([
        {
          id: 'move_type',
          labelEn: 'Service Needed',
          labelPt: 'Tipo de serviço de mudança',
          labelEs: 'Tipo de servicio',
          options: [
            { value: 'local_move', labelEn: 'Local Apartment/House Move', labelPt: 'Mudança Local Completa', labelEs: 'Mudanza Local' },
            { value: 'labor_only', labelEn: 'Labor Only (Loading / Unloading U-Haul)', labelPt: 'Apenas Carregamento/Descarregamento', labelEs: 'Solo Mano de Obra' },
            { value: 'haul_away', labelEn: 'Junk & Old Furniture Removal', labelPt: 'Descarte de Móveis Velhos / Entulho', labelEs: 'Retiro de Muebles Viejos' }
          ]
        }
      ])
    },
    {
      slug: 'flooring-remodeling',
      icon: 'Hammer',
      nameEn: 'Flooring & Remodeling',
      namePt: 'Pisos (Vinílico/Laminado) & Reformas',
      nameEs: 'Pisos & Remodelación',
      descriptionEn: 'Vinyl plank (LVP), laminate, tile installation and bathroom refreshes.',
      descriptionPt: 'Instalação de piso vinílico, laminado, porcelanato e reformas.',
      descriptionEs: 'Pisos de vinil (LVP), laminados, porcelanato y reformas.',
      wizardQuestions: JSON.stringify([
        {
          id: 'sqft',
          labelEn: 'Approximate area (sq ft)',
          labelPt: 'Área aproximada (Square Feet - sq ft)',
          labelEs: 'Área aproximada en sq ft',
          options: [
            { value: 'under_500', labelEn: 'Under 500 sq ft', labelPt: 'Até 500 sq ft', labelEs: 'Menos de 500 sq ft' },
            { value: '500_1500', labelEn: '500 to 1,500 sq ft', labelPt: '500 a 1.500 sq ft', labelEs: '500 a 1.500 sq ft' },
            { value: 'over_1500', labelEn: 'Over 1,500 sq ft', labelPt: 'Mais de 1.500 sq ft', labelEs: 'Más de 1.500 sq ft' }
          ]
        }
      ])
    }
  ];

  const dbCategories: Record<string, any> = {};
  for (const cat of categories) {
    const saved = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    dbCategories[cat.slug] = saved;
  }

  // 3. Admin User
  const passwordHash = await bcrypt.hash('Tiger123!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@gettigers.net' },
    update: {},
    create: {
      email: 'admin@gettigers.net',
      name: 'Admin GetTigers',
      role: 'ADMIN',
      password: passwordHash
    }
  });

  // 4. Sample Tigers (Florida Pros)
  const tigers = [
    {
      name: 'Carlos Silva',
      email: 'carlos.handyman@gettigers.net',
      businessName: 'Silva Handyman & Remodeling FL',
      slug: 'silva-handyman-orlando',
      bio: 'Over 8 years serving the Greater Orlando area. Specializing in drywall repairs, TV wall mounting, door locks, painting and flooring. Fast response and clean job!',
      phone: '+1 (407) 845-9921',
      whatsapp: '14078459921',
      languages: 'EN,PT,ES',
      baseZipCode: '32835', // MetroWest
      baseCity: 'Orlando',
      serviceRadiusMiles: 35,
      verified: true,
      ratingAverage: 4.9,
      reviewCount: 38,
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
      categories: ['handyman', 'painting', 'furniture-assembly', 'flooring-remodeling'],
      portfolio: [
        {
          title: 'Drywall Repair & Fresh Coat',
          description: 'Repaired water damaged drywall and painted living room in Celebration.',
          beforeImgUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
          afterImgUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80'
        },
        {
          title: 'LVP Vinyl Flooring Installation',
          description: 'Full 1,200 sq ft luxury vinyl plank installation in Dr. Phillips.',
          beforeImgUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=600&auto=format&fit=crop&q=80',
          afterImgUrl: 'https://images.unsplash.com/photo-1502005229762-ee1b2da9700d?w=600&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      name: 'Mariana Santos',
      email: 'mariana.clean@gettigers.net',
      businessName: 'Sparkle Tiger House Cleaning',
      slug: 'sparkle-tiger-cleaning',
      bio: 'Atendimento premium em Orlando, Kissimmee e Celebration. Especialistas em casas de aluguel de temporada (Airbnb turnover) e deep cleaning residencial com produtos de alta qualidade.',
      phone: '+1 (407) 555-0192',
      whatsapp: '14075550192',
      languages: 'EN,PT',
      baseZipCode: '34747', // Celebration / Disney
      baseCity: 'Kissimmee',
      serviceRadiusMiles: 25,
      verified: true,
      ratingAverage: 5.0,
      reviewCount: 52,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      categories: ['house-cleaning'],
      portfolio: [
        {
          title: 'Vacation Home Deep Clean',
          description: '5-bedroom villa prepared for high-season guests in Kissimmee.',
          beforeImgUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
          afterImgUrl: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      name: 'Mateo Hernandez',
      email: 'mateo.miami@gettigers.net',
      businessName: 'Miami Sun Landscaping & Lawn',
      slug: 'mateo-landscaping-miami',
      bio: 'Servicios de jardinería profesional en Miami-Dade y Broward (Doral, Coral Gables, Kendall, Pembroke Pines). Corte de césped, poda de palmeras y mantenimiento comercial.',
      phone: '+1 (786) 304-8841',
      whatsapp: '17863048841',
      languages: 'ES,EN',
      baseZipCode: '33178', // Doral
      baseCity: 'Miami',
      serviceRadiusMiles: 30,
      verified: true,
      ratingAverage: 4.8,
      reviewCount: 29,
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      categories: ['landscaping'],
      portfolio: [
        {
          title: 'Palm Trimming & Fresh Mulch',
          description: 'Revamped front yard landscaping for residence in Doral.',
          beforeImgUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=600&auto=format&fit=crop&q=80',
          afterImgUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?w=600&auto=format&fit=crop&q=80'
        }
      ]
    },
    {
      name: 'Rodrigo Oliveira',
      email: 'rodrigo.moving@gettigers.net',
      businessName: 'Tiger Fast Moving & Hauling',
      slug: 'tiger-moving-florida',
      bio: 'Mudanças residenciais e comerciais em toda a Flórida Central e Sul. Caminhão próprio com mantas protetoras, desmontagem e montagem inclusas.',
      phone: '+1 (407) 912-4433',
      whatsapp: '14079124433',
      languages: 'EN,PT,ES',
      baseZipCode: '32801', // Downtown Orlando
      baseCity: 'Orlando',
      serviceRadiusMiles: 60,
      verified: true,
      ratingAverage: 4.9,
      reviewCount: 45,
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      categories: ['moving', 'furniture-assembly'],
      portfolio: [
        {
          title: '3-Bedroom Apartment Move',
          description: 'Safe moving and furniture placement from MetroWest to Lake Nona.',
          beforeImgUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80',
          afterImgUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?w=600&auto=format&fit=crop&q=80'
        }
      ]
    }
  ];

  for (const t of tigers) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        email: t.email,
        name: t.name,
        role: 'PRO',
        password: passwordHash
      }
    });

    const pro = await prisma.proProfile.upsert({
      where: { userId: user.id },
      update: {
        slug: t.slug,
        businessName: t.businessName,
        bio: t.bio,
        phone: t.phone,
        whatsapp: t.whatsapp,
        languages: t.languages,
        baseZipCode: t.baseZipCode,
        baseCity: t.baseCity,
        serviceRadiusMiles: t.serviceRadiusMiles,
        verified: t.verified,
        ratingAverage: t.ratingAverage,
        reviewCount: t.reviewCount,
        avatarUrl: t.avatarUrl
      },
      create: {
        userId: user.id,
        slug: t.slug,
        businessName: t.businessName,
        bio: t.bio,
        phone: t.phone,
        whatsapp: t.whatsapp,
        languages: t.languages,
        baseZipCode: t.baseZipCode,
        baseCity: t.baseCity,
        serviceRadiusMiles: t.serviceRadiusMiles,
        verified: t.verified,
        ratingAverage: t.ratingAverage,
        reviewCount: t.reviewCount,
        avatarUrl: t.avatarUrl
      }
    });

    // Link Categories
    for (const catSlug of t.categories) {
      const cat = dbCategories[catSlug];
      if (cat) {
        await prisma.proCategory.upsert({
          where: {
            proProfileId_categoryId: {
              proProfileId: pro.id,
              categoryId: cat.id
            }
          },
          update: {},
          create: {
            proProfileId: pro.id,
            categoryId: cat.id
          }
        });
      }
    }

    // Add portfolio items
    for (const item of t.portfolio) {
      await prisma.portfolioItem.create({
        data: {
          proProfileId: pro.id,
          title: item.title,
          description: item.description,
          beforeImgUrl: item.beforeImgUrl,
          afterImgUrl: item.afterImgUrl
        }
      });
    }

    // Sample Review
    await prisma.review.create({
      data: {
        proProfileId: pro.id,
        clientName: 'Jennifer Miller',
        rating: 5,
        comment: 'Outstanding job! Arrived right on time, super respectful and did top quality work. Will definitely hire again.'
      }
    });
  }

  // 5. Sample Open Service Requests (Leads for Tigers to test unlocking)
  const sampleRequests = [
    {
      id: 'lead-clean-orlando',
      categoryId: dbCategories['house-cleaning'].id,
      clientName: 'Patricia Adams',
      clientEmail: 'patricia.adams@example.com',
      clientPhone: '+1 (407) 329-8812',
      clientWhatsapp: '14073298812',
      zipCode: '32819', // Dr Phillips / Orlando
      city: 'Orlando',
      urgency: 'urgent',
      answersJson: JSON.stringify({
        type: 'deep',
        size: '2bed_2bath',
        extras: 'fridge_oven'
      }),
      notes: 'Need a thorough deep cleaning before Friday guests arrive. Single family home with small friendly dog.'
    },
    {
      id: 'lead-handyman-metrowest',
      categoryId: dbCategories['handyman'].id,
      clientName: 'Alexandre Costa',
      clientEmail: 'alexandre.c@example.com',
      clientPhone: '+1 (407) 641-7720',
      clientWhatsapp: '14076417720',
      zipCode: '32835', // MetroWest Orlando
      urgency: 'this_week',
      city: 'Orlando',
      answersJson: JSON.stringify({
        job_type: 'tv_mounting'
      }),
      notes: 'Mount 65 inch TV on living room drywall + assemble a TV credenza from Wayfair.'
    },
    {
      id: 'lead-moving-kissimmee',
      categoryId: dbCategories['moving'].id,
      clientName: 'Roberto Gomez',
      clientEmail: 'roberto.g@example.com',
      clientPhone: '+1 (321) 441-2290',
      clientWhatsapp: '13214412290',
      zipCode: '34747', // Kissimmee / Celebration
      city: 'Kissimmee',
      urgency: 'this_week',
      answersJson: JSON.stringify({
        move_type: 'labor_only'
      }),
      notes: 'Need 2 guys for 3 hours to help unload a 20ft U-Haul truck into a second floor apartment.'
    },
    {
      id: 'lead-lawn-doral',
      categoryId: dbCategories['landscaping'].id,
      clientName: 'Camila Morales',
      clientEmail: 'camila.m@example.com',
      clientPhone: '+1 (786) 554-1029',
      clientWhatsapp: '17865541029',
      zipCode: '33178', // Doral Miami
      city: 'Miami',
      urgency: 'flexible',
      answersJson: JSON.stringify({
        lot_size: 'medium'
      }),
      notes: 'Buscamos servicio quincenal de corte de pasto y recorte de palmeras en Doral Isles.'
    }
  ];

  for (const req of sampleRequests) {
    await prisma.serviceRequest.upsert({
      where: { id: req.id },
      update: req,
      create: req
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
