import { PinService } from './service';
import { VerifyPinDto } from './dto/verify';
import { CreatePinDto } from './dto/create';
import { Body, Controller, Post } from '@nestjs/common';

/**
 * Pin controller.
 */
@Controller('pin')
export class PinController {
  /** Pin service */
  private readonly pinService!: PinService;

  /**
   * Creates a new pin controller.
   *
   * @param pinService - Pin service
   */
  constructor(pinService: PinService) {
    this.pinService = pinService;
  }

  /**
   * Create pin endpoint
   *
   * @param data - Create pin payload
   */
  @Post()
  async create(@Body() data: CreatePinDto) {
    await this.pinService.create(data);
    return {
      message: `Pin successfully sent to '${data.email}'`
    };
  }

  /**
   * Verify pin endpoint
   *
   * @param data - Verify user payload
   */
  @Post('/verify')
  async verify(@Body() data: VerifyPinDto) {
    await this.pinService.verify(data);
    return {
      message: `Pin '${data.code}' for '${data.email}' verified successfully`
    };
  }
}
