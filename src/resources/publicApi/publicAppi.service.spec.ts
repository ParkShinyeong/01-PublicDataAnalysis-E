import { Test, TestingModule } from '@nestjs/testing';
import { ErrorResponse } from 'src/http/dto';
import { PublicApiService } from './publicApi.service';

/*
    작성자 : 박신영
      - 서비스에 대한 테스트 코드 작성
     */
describe('PublicApiService', () => {
  let service: PublicApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PublicApiService],
    }).compile();

    service = module.get<PublicApiService>(PublicApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('강우량과 하수관로 수위 현황 결합 데이터 요청', () => {
    it('데이터 요청 성공', async () => {
      const result = await service.getWaterLevelAndRainfall('gangnam');
      expect(result).toHaveProperty('date');
      expect(result).toHaveProperty('gubnCode');
      expect(result).toHaveProperty('gubnName');
      expect(result).toHaveProperty('waterLevel');
      expect(result).toHaveProperty('rainfall');
    });

    it('요청 시 입력값이 유효하지 않음', async () => {
      try {
        await service.getWaterLevelAndRainfall('gangnaaaam');
      } catch (e) {
        expect(e).toBeInstanceOf(ErrorResponse);
        expect(e.statusCode).toEqual(400);
      }
    });

    it('요청 시 입력값이 없음', async () => {
      try {
        await service.getWaterLevelAndRainfall('');
      } catch (e) {
        expect(e).toBeInstanceOf(ErrorResponse);
        expect(e.statusCode).toEqual(400);
      }
    });
  });
});
