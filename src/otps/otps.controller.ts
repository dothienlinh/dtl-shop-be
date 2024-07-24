import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OtpsService } from './otps.service';
@ApiTags('otps')
@Controller('otps')
export class OtpsController {
  constructor(private readonly otpsService: OtpsService) {}
}
