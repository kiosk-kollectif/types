import { Test, TestingModule } from '@nestjs/testing';
import { VerificationCodesController } from './verification-codes.controller';

describe('VerificationCodesController', () => {
  let controller: VerificationCodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationCodesController],
    }).compile();

    controller = module.get<VerificationCodesController>(
      VerificationCodesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
