import { EMAIL_DOMAIN, PASSWORD_RGX } from '@constants';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

/**
 * Create user payload.
 */
export class CreateUserDto {
  /** User full name */
  @IsString()
  @Length(3, 255)
  readonly fullName!: string;

  /** User email */
  @IsString()
  @IsEmail()
  @Matches(new RegExp(`${EMAIL_DOMAIN}$`))
  readonly email!: string;

  /** User password */
  @IsString()
  @Matches(PASSWORD_RGX)
  readonly password!: string;
}
