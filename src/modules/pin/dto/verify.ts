/**
 * Verify pin dto.
 */
export class VerifyPinDto {
  /** User email */
  readonly email!: string;
  /** Pin code */
  readonly code!: string;
}
