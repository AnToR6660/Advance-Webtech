import { Test, TestingModule } from '@nestjs/testing';
import { AntorController } from './antor.controller';

describe('AntorController', () => {
  let controller: AntorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntorController],
    }).compile();

    controller = module.get<AntorController>(AntorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
