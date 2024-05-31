import { Controller } from '@nestjs/common';
import { OtpsService } from './otps.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('otps')
@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}
}
