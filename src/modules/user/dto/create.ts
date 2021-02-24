/**
 * Create user payload.
 */
export class CreateUserDto {
  /** User full name */
  readonly fullName!: string;
  /** User email */
  readonly email!: string;
  /** User password */
  readonly password!: string;
}
