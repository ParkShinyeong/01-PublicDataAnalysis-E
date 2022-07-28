import { Controller, Get, Query } from '@nestjs/common';
import { DefaultResponse } from 'src/http/dto';
import { PublicApiService } from './publicApi.service';

@Controller()
export class PublicApiController {
  constructor(private readonly publicApiService: PublicApiService) {}
  
  /* 
    작성자 : 염하늘, 김용민, 김태영, 박신영
     - 서울시 하수관로 수위와 강우량 정보를 가져오는 컨트롤러 구현
     - 엔드 포인트, 쿼리 파라미터 설정
     - response 값을 포매팅
  */
  @Get('/info')
  async getWaterLevelByRainfall(@Query('region') region: string): Promise<DefaultResponse> {
    const result = await this.publicApiService.getWaterLevelAndRainfall(region);
    return DefaultResponse.ok(result)
  }
}
