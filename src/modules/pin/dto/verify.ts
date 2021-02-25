import { EMAIL_DOMAIN, PIN_LENGTH } from '@constants';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

/**
 * Verify pin dto.
 */
export class VerifyPinDto {
  /** User email */
  @IsString()
  @IsEmail()
  @Matches(new RegExp(`${EMAIL_DOMAIN}$`))
  readonly email!: string;

  /** Pin code */
  @IsString()
  @Length(PIN_LENGTH, PIN_LENGTH)
  @Matches(/^[a-zA-Z0-9]+$/)
  readonly code!: string;
}
