import { EMAIL_DOMAIN, PASSWORD_RGX } from '@constants';
import { IsEmail, IsString, Matches } from 'class-validator';

/**
 * Sign in payload.
 */
export class SignInDto {
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
