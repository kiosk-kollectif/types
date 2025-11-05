import { Test, TestingModule } from '@nestjs/testing';
import { InvalidesTokenService } from './invalides-token.service';

describe('InvalidesTokenService', () => {
  let service: InvalidesTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvalidesTokenService],
    }).compile();

    service = module.get<InvalidesTokenService>(InvalidesTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
