import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const images = (...paths: string[]) => JSON.stringify(paths);

const photo = {
  cityApartment: '/images/121959b9-fb77-4feb-9d83-112bac56d3e2.webp',
  hillsideDevelopment: '/images/4381c1d2-b9d7-4af5-85bc-bd06623e47f8.webp',
  highRise: '/images/638009f3-2055-42bb-9b17-992a1c7ffe01.webp',
  residenceOne: '/images/81911304-5e5e-422e-a76c-6dc0f245fd51.webp',
  residenceTwo: '/images/859602c7-756e-4534-a90d-1370b8e2d003.webp',
  residenceThree: '/images/93b2c18f-78aa-42d8-a7fb-102c9d2fdf36.webp',
  residenceFour: '/images/a6c2ddab-bee8-4dfd-a2ec-a82e5d7967a2.webp',
  residenceFive: '/images/d0f034fd-312f-4222-81b2-5a45bc75fed9.webp',
  residenceSix: '/images/e7e7c6e1-015b-429c-9a05-ac656a1560d9.webp',
};

async function main() {
  await prisma.listing.deleteMany();
  await prisma.$executeRawUnsafe("DELETE FROM sqlite_sequence WHERE name = 'Listing'");

  await prisma.listing.createMany({
    data: [
      {
        title: 'Modern Apartment in Prishtina',
        description:
          'Bright two-bedroom apartment near the city center with a practical layout, balcony, and easy access to cafes and offices.',
        price: 128000,
        city: 'Prishtina',
        bedrooms: 2,
        bathrooms: 1,
        area: 68,
        latitude: 42.6629,
        longitude: 21.1655,
        images: images(photo.cityApartment, photo.highRise),
      },
      {
        title: 'Family Home near Germia',
        description:
          'Comfortable family home with a private garden, generous living space, and a calm location close to Germia Park.',
        price: 245000,
        city: 'Prishtina',
        bedrooms: 4,
        bathrooms: 2.5,
        area: 156,
        latitude: 42.6706,
        longitude: 21.1842,
        images: images(photo.hillsideDevelopment, photo.residenceOne),
      },
      {
        title: 'Sunny Lakrishte Flat',
        description:
          'Move-in ready apartment with afternoon light, elevator access, and strong transport links across Prishtina.',
        price: 104000,
        city: 'Prishtina',
        bedrooms: 1,
        bathrooms: 1,
        area: 52,
        latitude: 42.6538,
        longitude: 21.1547,
        images: images(photo.residenceTwo, photo.cityApartment),
      },
      {
        title: 'Penthouse by Mother Teresa Boulevard',
        description:
          'Top-floor residence with a broad terrace, city views, open living area, and secure underground parking.',
        price: 310000,
        city: 'Prishtina',
        bedrooms: 3,
        bathrooms: 2,
        area: 126,
        latitude: 42.6602,
        longitude: 21.1594,
        images: images(photo.highRise, photo.residenceThree),
      },
      {
        title: 'New Neighborhood Duplex',
        description:
          'Well-planned duplex in a newer building with three bedrooms, two baths, and a flexible upper-level workspace.',
        price: 186000,
        city: 'Prishtina',
        bedrooms: 3,
        bathrooms: 2,
        area: 112,
        latitude: 42.6487,
        longitude: 21.1768,
        images: images(photo.residenceFour, photo.hillsideDevelopment),
      },
      {
        title: 'City View Apartment in Prizren',
        description:
          'Renovated apartment with views toward the old town, a separate kitchen, and a short walk to central streets.',
        price: 92000,
        city: 'Prizren',
        bedrooms: 2,
        bathrooms: 1,
        area: 61,
        latitude: 42.2139,
        longitude: 20.7397,
        images: images(photo.cityApartment, photo.residenceFive),
      },
      {
        title: 'Historic Quarter Studio',
        description:
          'Efficient studio with updated finishes, low running costs, and a central Prizren location for easy daily living.',
        price: 54000,
        city: 'Prizren',
        bedrooms: 0,
        bathrooms: 1,
        area: 32,
        latitude: 42.2098,
        longitude: 20.7426,
        images: images(photo.residenceSix, photo.highRise),
      },
      {
        title: 'Prizren Riverside Home',
        description:
          'Detached home with a compact yard, bright living room, and quick access to river walks and neighborhood shops.',
        price: 168000,
        city: 'Prizren',
        bedrooms: 3,
        bathrooms: 2,
        area: 138,
        latitude: 42.2195,
        longitude: 20.7291,
        images: images(photo.hillsideDevelopment, photo.residenceTwo),
      },
      {
        title: 'Modern Flat near the Fortress',
        description:
          'Two-bedroom flat with a clean interior palette, practical storage, and a balcony facing the hillside.',
        price: 118000,
        city: 'Prizren',
        bedrooms: 2,
        bathrooms: 1,
        area: 74,
        latitude: 42.2115,
        longitude: 20.7488,
        images: images(photo.highRise, photo.cityApartment),
      },
      {
        title: 'Cozy Studio in Peja',
        description:
          'Compact studio apartment with a smart kitchenette, updated bathroom, and easy access to Peja city amenities.',
        price: 48000,
        city: 'Peja',
        bedrooms: 0,
        bathrooms: 1,
        area: 29,
        latitude: 42.6591,
        longitude: 20.2883,
        images: images(photo.residenceOne, photo.residenceSix),
      },
      {
        title: 'Peja Family Apartment',
        description:
          'Spacious three-bedroom apartment with two balconies, mountain air, and a comfortable layout for daily routines.',
        price: 132000,
        city: 'Peja',
        bedrooms: 3,
        bathrooms: 1.5,
        area: 96,
        latitude: 42.6642,
        longitude: 20.3004,
        images: images(photo.residenceThree, photo.hillsideDevelopment),
      },
      {
        title: 'Villa near Rugova Road',
        description:
          'Elegant villa with a landscaped yard, generous entertaining spaces, and quick access toward Rugova Canyon.',
        price: 335000,
        city: 'Peja',
        bedrooms: 5,
        bathrooms: 3,
        area: 224,
        latitude: 42.6537,
        longitude: 20.2798,
        images: images(photo.hillsideDevelopment, photo.residenceFour),
      },
      {
        title: 'Quiet Peja Two-Bedroom',
        description:
          'Well-maintained apartment in a calm residential pocket with good natural light and practical room sizes.',
        price: 87000,
        city: 'Peja',
        bedrooms: 2,
        bathrooms: 1,
        area: 63,
        latitude: 42.6685,
        longitude: 20.2915,
        images: images(photo.residenceFive, photo.cityApartment),
      },
      {
        title: 'Renovated House in Gjakova',
        description:
          'Updated home with three bedrooms, a tidy courtyard, newer windows, and a convenient location near local services.',
        price: 142000,
        city: 'Gjakova',
        bedrooms: 3,
        bathrooms: 2,
        area: 121,
        latitude: 42.3803,
        longitude: 20.4308,
        images: images(photo.residenceTwo, photo.residenceSix),
      },
      {
        title: 'Gjakova Garden Residence',
        description:
          'Large family residence with a private garden, covered parking, and flexible rooms for work or guests.',
        price: 198000,
        city: 'Gjakova',
        bedrooms: 4,
        bathrooms: 2.5,
        area: 174,
        latitude: 42.3868,
        longitude: 20.4243,
        images: images(photo.hillsideDevelopment, photo.residenceFive),
      },
      {
        title: 'Bright Apartment in Ferizaj',
        description:
          'Fresh two-bedroom apartment in Ferizaj with an open living area, balcony, and quick access to daily shopping.',
        price: 83000,
        city: 'Ferizaj',
        bedrooms: 2,
        bathrooms: 1,
        area: 59,
        latitude: 42.3706,
        longitude: 21.1553,
        images: images(photo.residenceFour, photo.highRise),
      },
      {
        title: 'Ferizaj New-Build Flat',
        description:
          'Newer flat with efficient heating, elevator access, and a balanced layout for a couple or small family.',
        price: 112000,
        city: 'Ferizaj',
        bedrooms: 2,
        bathrooms: 1.5,
        area: 76,
        latitude: 42.3659,
        longitude: 21.1636,
        images: images(photo.cityApartment, photo.residenceThree),
      },
      {
        title: 'Gjilan Corner Apartment',
        description:
          'Corner apartment with cross ventilation, two comfortable bedrooms, and easy access to central Gjilan streets.',
        price: 78000,
        city: 'Gjilan',
        bedrooms: 2,
        bathrooms: 1,
        area: 57,
        latitude: 42.4635,
        longitude: 21.4699,
        images: images(photo.residenceOne, photo.residenceFour),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
