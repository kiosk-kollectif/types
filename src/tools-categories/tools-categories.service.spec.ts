import { Test, TestingModule } from '@nestjs/testing';
import { ToolsCategoriesService } from './tools-categories.service';

describe('ToolsCategoriesService', () => {
  let service: ToolsCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ToolsCategoriesService],
    }).compile();

    service = module.get<ToolsCategoriesService>(ToolsCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
