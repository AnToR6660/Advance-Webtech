import { Test, TestingModule } from '@nestjs/testing';
import { AntorService } from './antor.service';

describe('AntorService', () => {
  let service: AntorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AntorService],
    }).compile();

    service = module.get<AntorService>(AntorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
