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
  create(@Body() data: CreatePinDto) {
    return this.pinService.create(data);
  }

  /**
   * Verify pin endpoint
   *
   * @param data - Verify user payload
   */
  @Post('/verify')
  verify(@Body() data: VerifyPinDto) {
    return this.pinService.verify(data);
  }
}
