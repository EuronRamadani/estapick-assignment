import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateListingDto } from './dto/create-listing.dto';
import { ListingQueryDto } from './dto/listing-query.dto';
import { ListingsService } from './listings.service';
import {
  ListingResponse,
  PaginatedListingsResponse,
} from './types/listing-response.type';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  findAll(@Query() query: ListingQueryDto): Promise<PaginatedListingsResponse> {
    return this.listingsService.findAll(query);
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: 400,
        exceptionFactory: () =>
          new BadRequestException('Listing id must be a whole number.'),
      }),
    )
    id: number,
  ): Promise<ListingResponse> {
    return this.listingsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateListingDto): Promise<ListingResponse> {
    return this.listingsService.create(dto);
  }
}
