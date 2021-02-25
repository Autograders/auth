import { IsBoolean } from 'class-validator';

/**
 * Sign out payload.
 */
export class SignOutDto {
  /** Sign out from all devices flag */
  @IsBoolean()
  readonly allDevices!: boolean;
}
