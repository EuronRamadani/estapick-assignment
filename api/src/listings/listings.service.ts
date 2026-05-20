import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Listing, Prisma } from '@prisma/client';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingQueryDto } from './dto/listing-query.dto';
import {
  ListingResponse,
  PaginatedListingsResponse,
} from './types/listing-response.type';
import { PrismaService } from '../prisma/prisma.service';

type ParsedBoundingBox = {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
};

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListingQueryDto): Promise<PaginatedListingsResponse> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;

    if (
      query.minPrice !== undefined &&
      query.maxPrice !== undefined &&
      query.minPrice > query.maxPrice
    ) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    const where = this.buildWhere(query);
    const [data, total] = await this.prisma.$transaction([
      this.prisma.listing.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.listing.count({ where }),
    ]);

    return {
      data: data.map((listing) => this.toResponse(listing)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number): Promise<ListingResponse> {
    const listing = await this.prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    return this.toResponse(listing);
  }

  async create(dto: CreateListingDto): Promise<ListingResponse> {
    const listing = await this.prisma.listing.create({
      data: {
        ...dto,
        images: JSON.stringify(dto.images),
      },
    });

    return this.toResponse(listing);
  }

  private buildWhere(query: ListingQueryDto): Prisma.ListingWhereInput {
    const where: Prisma.ListingWhereInput = {};

    if (query.city) {
      where.city = {
        contains: query.city,
      };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {
        gte: query.minPrice,
        lte: query.maxPrice,
      };
    }

    if (query.bedrooms !== undefined) {
      where.bedrooms = query.bedrooms;
    }

    if (query.bbox) {
      const bbox = this.parseBoundingBox(query.bbox);
      where.latitude = {
        gte: bbox.minLat,
        lte: bbox.maxLat,
      };
      where.longitude = {
        gte: bbox.minLng,
        lte: bbox.maxLng,
      };
    }

    return where;
  }

  private parseBoundingBox(rawBbox: string): ParsedBoundingBox {
    const parts = rawBbox.split(',').map((part) => Number(part.trim()));

    if (parts.length !== 4 || parts.some((value) => Number.isNaN(value))) {
      throw new BadRequestException(
        'bbox must be formatted as minLat,minLng,maxLat,maxLng',
      );
    }

    const [minLat, minLng, maxLat, maxLng] = parts;

    if (minLat < -90 || maxLat > 90 || minLng < -180 || maxLng > 180) {
      throw new BadRequestException('bbox latitude/longitude values are out of range.');
    }

    if (minLat > maxLat || minLng > maxLng) {
      throw new BadRequestException(
        'bbox minimum latitude/longitude values must be less than maximum values.',
      );
    }

    return { minLat, minLng, maxLat, maxLng };
  }

  private toResponse(listing: Listing): ListingResponse {
    return {
      ...listing,
      images: this.parseImages(listing.images),
    };
  }

  private parseImages(images: string): string[] {
    let parsed: unknown;

    try {
      parsed = JSON.parse(images);
    } catch {
      return [];
    }

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((image): image is string => typeof image === 'string');
  }
}
