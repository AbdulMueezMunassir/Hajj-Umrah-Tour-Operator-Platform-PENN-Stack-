import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPackages() {
  console.log('🌱 Seeding packages...');

  // Delete existing packages
  await prisma.package.deleteMany({});
  console.log('✅ Cleared existing packages');

  const packages = [
    // ==================== UMRAH PACKAGES ====================
    {
      name: 'Premium Umrah Package - September 2026',
      type: 'UMRAH' as const,
      departureCity: 'Colombo',
      travelDate: new Date('2026-09-16'),
      returnDate: new Date('2026-09-27'),
      duration: 11,
      totalPrice: 460000,
      advancePercent: 20,
      availableSeats: 45,
      description:
        'Experience a spiritually enriching 11-day Umrah journey with 5-star accommodations in Makkah and Madinah. Includes direct SriLankan Airlines flights from Colombo, guided Ziyarat tours, and full board Sri Lankan meals prepared by resident chefs.',
      posterUrl:
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      status: 'ACTIVE' as const,
      hotels: {
        create: [
          {
            city: 'MAKKAH',
            name: 'Swissôtel Al Maqam',
            stars: 5,
            distance: '100m to Haram Courtyard',
            roomType: 'Double Sharing',
            nights: 6,
          },
          {
            city: 'MADINAH',
            name: 'Anwar Al Madinah Mövenpick',
            stars: 5,
            distance: '50m to Prophet\'s Mosque',
            roomType: 'Double Sharing',
            nights: 5,
          },
        ],
      },
      inclusions: {
        create: [
          { name: 'Direct Return Flights (SriLankan Airlines)', included: true },
          { name: 'Umrah E-Visa & Medical Insurance', included: true },
          { name: '5-Star Hotels (Makkah + Madinah)', included: true },
          { name: 'Full Board Sri Lankan Meals', included: true },
          { name: 'Haramain High-Speed Train', included: true },
          { name: 'Guided Historical Ziyarat', included: true },
          { name: '5L Sealed Zamzam Water', included: true },
          { name: 'Pre-Departure Seminar', included: true },
        ],
      },
      itinerary: {
        create: [
          { day: 1, location: 'Colombo → Jeddah → Makkah', title: 'Departure & First Umrah', description: 'Depart from BIA Colombo, arrive Jeddah, transfer to Makkah and perform Umrah with guide.', order: 0 },
          { day: 2, location: 'Makkah', title: 'Rest & Ibadah', description: 'Free day for prayer and rest at Haram.', order: 1 },
          { day: 3, location: 'Makkah', title: 'Historical Ziyarat', description: 'Visit Cave of Hira, Jabal Thawr, Mina, Arafat.', order: 2 },
          { day: 4, location: 'Makkah', title: 'Private Ibadah', description: 'Personal time for prayer and reflection.', order: 3 },
          { day: 5, location: 'Makkah → Madinah', title: 'Haramain High-Speed Train', description: 'Travel to Madinah via bullet train. First Salam at Rawdah.', order: 4 },
          { day: 6, location: 'Madinah', title: 'Madinah Ziyarat', description: 'Visit Masjid Quba, Mount Uhud, Masjid al-Qiblatayn.', order: 5 },
          { day: 7, location: 'Madinah', title: 'Free Day', description: 'Reflection and prayer at Prophet\'s Mosque.', order: 6 },
          { day: 8, location: 'Madinah', title: 'Date Market Visit', description: 'Explore authentic Madinah date market.', order: 7 },
          { day: 9, location: 'Madinah → Colombo', title: 'Farewell Salam', description: 'Farewell prayer and departure to Colombo.', order: 8 },
        ],
      },
    },
    {
      name: 'Royal Ramadhan Umrah 1447H - Last 10 Days',
      type: 'UMRAH' as const,
      departureCity: 'Colombo',
      travelDate: new Date('2027-03-10'),
      returnDate: new Date('2027-03-25'),
      duration: 15,
      totalPrice: 780000,
      advancePercent: 20,
      availableSeats: 30,
      description:
        'Perform Umrah in the most blessed nights of Ramadhan. Includes Suhoor and Iftar buffets, Taraweeh prayers steps away from Mataf, and full spiritual guidance. Experience Laylatul Qadr in the holy sanctuaries.',
      posterUrl:
        'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80',
      status: 'ACTIVE' as const,
      hotels: {
        create: [
          {
            city: 'MAKKAH',
            name: 'Makkah Clock Royal Tower (Fairmont)',
            stars: 5,
            distance: 'Direct access to Haram',
            roomType: 'Triple Sharing',
            nights: 10,
          },
          {
            city: 'MADINAH',
            name: 'The Oberoi Madinah',
            stars: 5,
            distance: 'Direct courtyard access',
            roomType: 'Triple Sharing',
            nights: 4,
          },
        ],
      },
      inclusions: {
        create: [
          { name: 'Return Flights (SriLankan / Saudia)', included: true },
          { name: 'Ramadhan Umrah Visa', included: true },
          { name: '5-Star Hotels (10 Nights Makkah)', included: true },
          { name: 'Daily Suhoor & Iftar Buffet', included: true },
          { name: 'Laylatul Qadr Programs', included: true },
          { name: 'Haramain High-Speed Train', included: true },
          { name: 'Eid Prayers in Holy Sanctuary', included: true },
          { name: '24/7 Spiritual Guide', included: true },
        ],
      },
      itinerary: {
        create: [
          { day: 1, location: 'Colombo → Jeddah → Makkah', title: 'Arrival & Welcome Iftar', description: 'Arrival in Jeddah, transfer to Makkah. Iftar at hotel.', order: 0 },
          { day: 2, location: 'Makkah', title: 'First Umrah', description: 'Perform Umrah with guided rituals.', order: 1 },
          { day: 3, location: 'Makkah', title: 'Taraweeh & Ibadah', description: 'Join Taraweeh prayers at Haram.', order: 2 },
          { day: 4, location: 'Makkah', title: 'Ziyarat Tour', description: 'Historical sites tour.', order: 3 },
          { day: 5, location: 'Makkah', title: 'Laylatul Qadr Programs', description: 'Special night prayers.', order: 4 },
        ],
      },
    },
    {
      name: 'Family Umrah Package - December 2026',
      type: 'UMRAH' as const,
      departureCity: 'Colombo',
      travelDate: new Date('2026-12-15'),
      returnDate: new Date('2026-12-26'),
      duration: 12,
      totalPrice: 420000,
      advancePercent: 20,
      availableSeats: 60,
      description:
        'Specially designed for families with children and elderly parents. Includes interconnected rooms, wheelchair assistance during Tawaf, dedicated Colombo-style meals, and a family-friendly spiritual guide.',
      posterUrl:
        'https://images.unsplash.com/photo-1537444532052-02afbc2b5e77?w=800&q=80',
      status: 'ACTIVE' as const,
      hotels: {
        create: [
          {
            city: 'MAKKAH',
            name: 'Swissôtel Al Maqam',
            stars: 5,
            distance: '100m to Haram Courtyard',
            roomType: 'Quad Sharing',
            nights: 7,
          },
          {
            city: 'MADINAH',
            name: 'Pullman Zamzam Madina',
            stars: 5,
            distance: '150m to Masjid an-Nabawi',
            roomType: 'Quad Sharing',
            nights: 4,
          },
        ],
      },
      inclusions: {
        create: [
          { name: 'Direct Flights (Family Group Discount)', included: true },
          { name: 'Umrah Visa for All Ages', included: true },
          { name: 'Family Rooms (Interconnected)', included: true },
          { name: 'Child-Friendly Meals', included: true },
          { name: 'Wheelchair Assistance On Demand', included: true },
          { name: 'Historical Ziyarat Tour', included: true },
          { name: 'Family Photo Package', included: true },
        ],
      },
      itinerary: {
        create: [
          { day: 1, location: 'Colombo → Jeddah → Makkah', title: 'Family Arrival', description: 'Arrive as a family. Welcome dinner.', order: 0 },
          { day: 2, location: 'Makkah', title: 'First Umrah Together', description: 'Guided Umrah with family assistance.', order: 1 },
          { day: 3, location: 'Makkah', title: 'Ziyarat & Kids Activities', description: 'Historical tour + kids program.', order: 2 },
        ],
      },
    },

    // ==================== HAJJ PACKAGES ====================
    {
      name: 'Standard Hajj Package 1447H',
      type: 'HAJJ' as const,
      departureCity: 'Colombo',
      travelDate: new Date('2027-05-15'),
      returnDate: new Date('2027-06-10'),
      duration: 26,
      totalPrice: 1850000,
      advancePercent: 20,
      availableSeats: 40,
      description:
        'Complete Hajj journey with comfortable accommodations, standard Mina tents, and experienced Sri Lankan guides. Includes full board meals, transportation to all Hajj sites, and 24/7 support throughout the pilgrimage.',
      posterUrl:
        'https://images.unsplash.com/photo-1565019011521-b0575cbb57bc?w=800&q=80',
      status: 'ACTIVE' as const,
      hotels: {
        create: [
          {
            city: 'MAKKAH',
            name: 'Al Marwa Rayhaan by Rotana',
            stars: 4,
            distance: '200m to Haram',
            roomType: 'Quad Sharing',
            nights: 12,
          },
          {
            city: 'MADINAH',
            name: 'Millennium Al Aqeeq Hotel',
            stars: 4,
            distance: '150m to Masjid an-Nabawi',
            roomType: 'Quad Sharing',
            nights: 8,
          },
        ],
      },
      inclusions: {
        create: [
          { name: 'Return Flights (Colombo-Jeddah)', included: true },
          { name: 'Hajj Visa & Nusuk Registration', included: true },
          { name: 'Standard Mina Tents', included: true },
          { name: 'Full Board Meals', included: true },
          { name: 'Transportation to All Sites', included: true },
          { name: 'Qurbani (Dham) Arrangement', included: true },
          { name: 'Sri Lankan Hajj Guide', included: true },
          { name: 'Medical Support', included: true },
        ],
      },
      itinerary: {
        create: [
          { day: 1, location: 'Colombo → Jeddah', title: 'Departure', description: 'Depart for Jeddah in Ihram.', order: 0 },
          { day: 2, location: 'Makkah', title: 'Arrival Umrah', description: 'Perform Umrah upon arrival.', order: 1 },
          { day: 10, location: 'Mina', title: 'Days of Hajj Begin', description: 'Transfer to Mina for 5 days of Hajj.', order: 9 },
          { day: 11, location: 'Arafat', title: 'Day of Arafat', description: 'Day of Arafat with special prayers.', order: 10 },
          { day: 12, location: 'Muzdalifah → Mina', title: 'Muzdalifah & Jamarat', description: 'Night at Muzdalifah, stoning at Jamarat.', order: 11 },
          { day: 13, location: 'Makkah', title: 'Tawaf al-Ifadah', description: 'Return to Makkah for final Tawaf.', order: 12 },
          { day: 26, location: 'Madinah → Colombo', title: 'Return Home', description: 'Farewell and departure.', order: 25 },
        ],
      },
    },
    {
      name: 'VIP Hajj Package 1447H - Maktab A',
      type: 'HAJJ' as const,
      departureCity: 'Colombo',
      travelDate: new Date('2027-05-12'),
      returnDate: new Date('2027-06-08'),
      duration: 28,
      totalPrice: 2650000,
      advancePercent: 20,
      availableSeats: 25,
      description:
        'The ultimate Hajj experience with VIP Maktab A, upgraded 5-star accommodations in Makkah and Madinah, air-conditioned Mina tents, private transportation, and comprehensive medical support with dedicated Sri Lankan doctors.',
      posterUrl:
        'https://images.unsplash.com/photo-1519817650390-64a93db51149?w=800&q=80',
      status: 'ACTIVE' as const,
      hotels: {
        create: [
          {
            city: 'MAKKAH',
            name: 'Fairmont Makkah Clock Tower',
            stars: 5,
            distance: 'Direct access to Haram',
            roomType: 'Double Sharing',
            nights: 14,
          },
          {
            city: 'MADINAH',
            name: 'Dar Al Iman InterContinental',
            stars: 5,
            distance: 'Front row to Prophet\'s Mosque',
            roomType: 'Double Sharing',
            nights: 8,
          },
        ],
      },
      inclusions: {
        create: [
          { name: 'Direct SriLankan Business Class Option', included: true },
          { name: 'VIP Hajj Visa & Fast-Track', included: true },
          { name: 'VIP Maktab A (Premium Mina Tents)', included: true },
          { name: '5-Star Hotels Throughout', included: true },
          { name: 'Full Board Premium Meals', included: true },
          { name: 'Dedicated Sri Lankan Doctor', included: true },
          { name: 'Private A/C Coaches', included: true },
          { name: 'Qurbani Included', included: true },
          { name: 'Personal Islamic Scholar', included: true },
        ],
      },
      itinerary: {
        create: [
          { day: 1, location: 'Colombo → Jeddah', title: 'VIP Departure', description: 'Priority departure with Ihram.', order: 0 },
          { day: 2, location: 'Makkah', title: 'Welcome Umrah', description: 'Perform Umrah with personal scholar.', order: 1 },
          { day: 12, location: 'VIP Mina Tents', title: 'Premium Hajj Days', description: 'Experience Hajj in VIP air-conditioned tents.', order: 11 },
          { day: 13, location: 'Arafat', title: 'Day of Arafat', description: 'VIP section at Arafat with all amenities.', order: 12 },
          { day: 28, location: 'Madinah → Colombo', title: 'Return Home', description: 'Farewell Salam and VIP departure.', order: 27 },
        ],
      },
    },
    {
      name: 'Economy Hajj Package 1447H',
      type: 'HAJJ' as const,
      departureCity: 'Colombo',
      travelDate: new Date('2027-05-18'),
      returnDate: new Date('2027-06-12'),
      duration: 25,
      totalPrice: 1550000,
      advancePercent: 20,
      availableSeats: 50,
      description:
        'Affordable Hajj package with comfortable 3-4 star accommodations. Includes all essentials for a complete pilgrimage journey without compromising on spiritual experience. Perfect for budget-conscious pilgrims.',
      posterUrl:
        'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80',
      status: 'ACTIVE' as const,
      hotels: {
        create: [
          {
            city: 'MAKKAH',
            name: 'Al Kiswah Towers Hotel',
            stars: 3,
            distance: '800m to Haram (shuttle)',
            roomType: 'Quint Sharing',
            nights: 12,
          },
          {
            city: 'MADINAH',
            name: 'Al Eiman Royal Hotel',
            stars: 3,
            distance: '200m to Prophet\'s Mosque',
            roomType: 'Quint Sharing',
            nights: 7,
          },
        ],
      },
      inclusions: {
        create: [
          { name: 'Return Flights (Economy Class)', included: true },
          { name: 'Hajj Visa', included: true },
          { name: 'Standard Mina Tents', included: true },
          { name: '3 Meals Daily', included: true },
          { name: 'Shuttle Service to Haram', included: true },
          { name: 'Group Guide', included: true },
          { name: 'Basic Medical Support', included: true },
        ],
      },
      itinerary: {
        create: [
          { day: 1, location: 'Colombo → Jeddah', title: 'Departure', description: 'Group departure in Ihram.', order: 0 },
          { day: 2, location: 'Makkah', title: 'First Umrah', description: 'Guided Umrah with group.', order: 1 },
          { day: 11, location: 'Mina', title: 'Hajj Days', description: 'Complete Hajj rituals.', order: 10 },
          { day: 25, location: 'Colombo', title: 'Arrival Home', description: 'Return to Sri Lanka.', order: 24 },
        ],
      },
    },
  ];

  for (const pkg of packages) {
    await prisma.package.create({ data: pkg });
    console.log(`✅ Created: ${pkg.name}`);
  }

  const count = await prisma.package.count();
  console.log(`\n🎉 Successfully seeded ${count} packages!`);
}

seedPackages()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });