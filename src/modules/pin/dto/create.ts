import { EMAIL_DOMAIN } from '@constants';
import { IsEmail, IsString, Matches } from 'class-validator';

/**
 * Create pin payload.
 */
export class CreatePinDto {
  /** User email */
  @IsString()
  @IsEmail()
  @Matches(new RegExp(`${EMAIL_DOMAIN}$`))
  readonly email!: string;
}
