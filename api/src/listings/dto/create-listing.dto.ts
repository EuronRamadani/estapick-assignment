import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateListingDto {
  @Transform(trimString)
  @IsString({ message: 'Title is required.' })
  @IsNotEmpty({ message: 'Title cannot be empty.' })
  @MinLength(3, { message: 'Title must be at least 3 characters long.' })
  title!: string;

  @Transform(trimString)
  @IsString({ message: 'Description is required.' })
  @IsNotEmpty({ message: 'Description cannot be empty.' })
  @MinLength(20, {
    message: 'Description must be at least 20 characters long.',
  })
  description!: string;

  @IsInt({ message: 'Price must be a whole number.' })
  @Min(1, { message: 'Price must be greater than zero.' })
  price!: number;

  @Transform(trimString)
  @IsString({ message: 'City is required.' })
  @IsNotEmpty({ message: 'City cannot be empty.' })
  @MinLength(2, { message: 'City must be at least 2 characters long.' })
  city!: string;

  @IsInt({ message: 'Bedrooms must be a whole number.' })
  @Min(0, { message: 'Bedrooms cannot be negative.' })
  bedrooms!: number;

  @IsNumber({}, { message: 'Bathrooms must be a number.' })
  @Min(0, { message: 'Bathrooms cannot be negative.' })
  bathrooms!: number;

  @IsNumber({}, { message: 'Area must be a number.' })
  @Min(1, { message: 'Area must be greater than zero.' })
  area!: number;

  @IsNumber({}, { message: 'Latitude must be a number.' })
  @Min(-90, { message: 'Latitude must be at least -90.' })
  @Max(90, { message: 'Latitude must be at most 90.' })
  latitude!: number;

  @IsNumber({}, { message: 'Longitude must be a number.' })
  @Min(-180, { message: 'Longitude must be at least -180.' })
  @Max(180, { message: 'Longitude must be at most 180.' })
  longitude!: number;

  @IsArray({ message: 'Images must be an array of URLs.' })
  @ArrayNotEmpty({ message: 'At least one image URL is required.' })
  @IsUrl({}, { each: true, message: 'Each image must be a valid URL.' })
  images!: string[];
}
