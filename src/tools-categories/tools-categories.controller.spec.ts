import { Test, TestingModule } from '@nestjs/testing';
import { ToolsCategoriesController } from './tools-categories.controller';

describe('ToolsCategoriesController', () => {
  let controller: ToolsCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ToolsCategoriesController],
    }).compile();

    controller = module.get<ToolsCategoriesController>(
      ToolsCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
