/**
 * Verify pin dto.
 */
export class VerifyUserDto {
  /** User email */
  readonly email!: string;
  /** Pin code */
  readonly code!: string;
}
