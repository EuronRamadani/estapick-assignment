import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class ListingQueryDto {
  @IsOptional()
  @IsString({ message: 'City must be a string.' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'minPrice must be a number.' })
  @Min(0, { message: 'minPrice cannot be negative.' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'maxPrice must be a number.' })
  @Min(0, { message: 'maxPrice cannot be negative.' })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'bedrooms must be a whole number.' })
  @Min(0, { message: 'bedrooms cannot be negative.' })
  bedrooms?: number;

  @IsOptional()
  @IsString({ message: 'bbox must be a string formatted as minLat,minLng,maxLat,maxLng.' })
  bbox?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page must be a whole number.' })
  @Min(1, { message: 'page must be at least 1.' })
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a whole number.' })
  @Min(1, { message: 'limit must be at least 1.' })
  @Max(50, { message: 'limit cannot be greater than 50.' })
  limit = 10;
}
