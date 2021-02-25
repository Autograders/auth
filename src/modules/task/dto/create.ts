import { ArrayMinSize, IsArray, IsDateString, IsInt, IsString, Length, Matches, Max, Min } from 'class-validator';

/**
 * Create task payload.
 */
export class CreateTaskDto {
  /** Task name */
  @IsString()
  @Length(3, 255)
  @Matches(/^[a-zA-Z0-9-:&_ ]+$/)
  readonly name!: string;

  /** Task max tries */
  @IsInt()
  @Min(3)
  @Max(30)
  readonly tries!: number;

  /** Task files */
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  readonly files!: string[];

  /** Task due date*/
  @IsDateString({ strict: true })
  readonly due!: string;
}
