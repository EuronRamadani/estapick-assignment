import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ListingsService } from './listings.service';
import { PrismaService } from '../prisma/prisma.service';

const listing = {
  id: 1,
  title: 'Test Listing',
  description: 'A useful test listing with enough description.',
  price: 120000,
  city: 'Prishtina',
  bedrooms: 2,
  bathrooms: 1,
  area: 60,
  latitude: 42.6629,
  longitude: 21.1655,
  images: JSON.stringify(['/listings/apartment-1.svg']),
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
};

describe('ListingsService', () => {
  let service: ListingsService;
  const prisma = {
    $transaction: jest.fn(),
    listing: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        ListingsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = moduleRef.get(ListingsService);
  });

  it('returns paginated results with correct metadata and skip/take', async () => {
    prisma.$transaction.mockResolvedValue([[listing], 18]);

    const result = await service.findAll({ page: 2, limit: 5 });

    expect(prisma.listing.findMany).toHaveBeenCalledWith({
      where: {},
      orderBy: { createdAt: 'desc' },
      skip: 5,
      take: 5,
    });
    expect(prisma.listing.count).toHaveBeenCalledWith({ where: {} });
    expect(result).toEqual({
      data: [{ ...listing, images: ['/listings/apartment-1.svg'] }],
      meta: {
        page: 2,
        limit: 5,
        total: 18,
        totalPages: 4,
      },
    });
  });

  it('filters by city', async () => {
    prisma.$transaction.mockResolvedValue([[listing], 1]);

    await service.findAll({ city: 'Prishtina', page: 1, limit: 10 });

    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { city: { contains: 'Prishtina' } },
      }),
    );
  });

  it('filters by price range', async () => {
    prisma.$transaction.mockResolvedValue([[listing], 1]);

    await service.findAll({ minPrice: 100000, maxPrice: 150000, page: 1, limit: 10 });

    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { price: { gte: 100000, lte: 150000 } },
      }),
    );
  });

  it('filters by exact bedroom count', async () => {
    prisma.$transaction.mockResolvedValue([[listing], 1]);

    await service.findAll({ bedrooms: 2, page: 1, limit: 10 });

    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { bedrooms: 2 },
      }),
    );
  });

  it('filters by bbox', async () => {
    prisma.$transaction.mockResolvedValue([[listing], 1]);

    await service.findAll({ bbox: '42.6,21.1,42.7,21.2', page: 1, limit: 10 });

    expect(prisma.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          latitude: { gte: 42.6, lte: 42.7 },
          longitude: { gte: 21.1, lte: 21.2 },
        },
      }),
    );
  });

  it('combines city, price, bedrooms, and bbox filters', async () => {
    prisma.$transaction.mockResolvedValue([[listing], 1]);

    const result = await service.findAll({
      city: 'Prishtina',
      minPrice: 100000,
      maxPrice: 150000,
      bedrooms: 2,
      bbox: '42.6,21.1,42.7,21.2',
      page: 1,
      limit: 10,
    });

    expect(prisma.listing.findMany).toHaveBeenCalledWith({
      where: {
        city: { contains: 'Prishtina' },
        price: { gte: 100000, lte: 150000 },
        bedrooms: 2,
        latitude: { gte: 42.6, lte: 42.7 },
        longitude: { gte: 21.1, lte: 21.2 },
      },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
    });
    expect(result.meta.total).toBe(1);
    expect(result.data[0].images).toEqual(['/listings/apartment-1.svg']);
  });

  it('throws 404 when a listing is missing', async () => {
    prisma.listing.findUnique.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toEqual(
      new NotFoundException('Listing not found'),
    );
  });

  it('rejects invalid bbox values', async () => {
    await expect(
      service.findAll({ bbox: '42.7,21.1,42.6,21.2', page: 1, limit: 10 }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects malformed bbox values', async () => {
    await expect(
      service.findAll({ bbox: '42.6,21.1,42.7', page: 1, limit: 10 }),
    ).rejects.toEqual(
      new BadRequestException('bbox must be formatted as minLat,minLng,maxLat,maxLng'),
    );
  });

  it('rejects minPrice greater than maxPrice', async () => {
    await expect(
      service.findAll({ minPrice: 200000, maxPrice: 100000, page: 1, limit: 10 }),
    ).rejects.toEqual(
      new BadRequestException('minPrice cannot be greater than maxPrice'),
    );
  });

  it('stores created listing images as JSON and returns string array images', async () => {
    prisma.listing.create.mockResolvedValue({
      ...listing,
      title: 'Created Listing',
      images: JSON.stringify(['/listings/apartment-2.svg']),
    });

    const result = await service.create({
      title: 'Created Listing',
      description: 'A useful created listing with enough description.',
      price: 150000,
      city: 'Prishtina',
      bedrooms: 2,
      bathrooms: 1,
      area: 70,
      latitude: 42.6629,
      longitude: 21.1655,
      images: ['/listings/apartment-2.svg'],
    });

    expect(prisma.listing.create).toHaveBeenCalledWith({
      data: {
        title: 'Created Listing',
        description: 'A useful created listing with enough description.',
        price: 150000,
        city: 'Prishtina',
        bedrooms: 2,
        bathrooms: 1,
        area: 70,
        latitude: 42.6629,
        longitude: 21.1655,
        images: JSON.stringify(['/listings/apartment-2.svg']),
      },
    });
    expect(result.images).toEqual(['/listings/apartment-2.svg']);
  });

  it('maps malformed stored image JSON to an empty array', async () => {
    prisma.listing.findUnique.mockResolvedValue({
      ...listing,
      images: 'not-json',
    });

    const result = await service.findOne(1);

    expect(result.images).toEqual([]);
  });
});
