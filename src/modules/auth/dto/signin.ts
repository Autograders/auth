/**
 * Sign in payload.
 */
export class SignInDto {
  /** User email */
  readonly email!: string;
  /** User password */
  readonly password!: string;
}
