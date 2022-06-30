import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { GubnType } from 'src/config/gubnType';
import { ResponseDto } from './dto/publicApiResponse';

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

interface IReq {
  key: string;
  service: string;
  type: string;
  start: number;
  end: number;
  region: string;
  now?: string;
}

@Injectable()
export class PublicApiService {
  logger: Logger;
  constructor() {
    this.logger = new Logger();
  }

  async getWaterLevelAndRainfall(region: string): Promise<ResponseDto> {
    const regionCode = GubnType[region]['code'];
    const regionName = GubnType[region]['name'];
    const waterLevel = await this.getWaterLevelData(regionCode);
    const rainfall = await this.getRainfallData(regionName);

    const resOutput: ResponseDto = {
      gubnCode: regionCode, // 지역코드
      gubnName: regionName, // 지역명
      waterLevel: waterLevel, // 하수관 수위 현황 평균값
      rainfall: rainfall, // 강우량 현황 평균값
      date: moment().format('YYYY/MM/DD/HH:MM'),
    };
    console.log(resOutput.date);
    return resOutput;
  }

  async getRainfallData(regionName: string): Promise<number> {
    const key = process.env.RAINFALL_API_ACCESS_KEY;
    const start = 1;
    const end = 282;

    try {
      const response = await axios({
        url: `http://openAPI.seoul.go.kr:8088/${key}/json/ListRainfallService/${start}/${end}/` + encodeURI(regionName),
        method: 'GET',
      });

      let totalRainfall = 0,
        count = 0;
      const now = moment(response.data.ListRainfallService.row[0].RECEIVE_TIME);
      console.log(now);

      response.data.ListRainfallService.row.map(r => {
        const receive = moment(r.RECEIVE_TIME);

        if (moment.duration(now.diff(receive)).asMinutes() < 60) {
          totalRainfall += Number(r.RAINFALL10);
          count += 1;
        }
      });
      const result = Number((totalRainfall / count).toFixed(4));
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async getWaterLevelData(regionCode: string): Promise<number> {
    try {
      const req: IReq = {
        key: process.env.PIPE_API_ACCESS_KEY,
        service: 'DrainpipeMonitoringInfo',
        type: 'json',
        start: 1,
        end: 1000,
        region: regionCode,
        now: String(moment().format('YYYYMMDDHH') - 1),
      };

      const res = await axios({
        url: `http://openapi.seoul.go.kr:8088/${req.key}/${req.type}/${req.service}/${req.start}/${req.end}/${req.region}/${req.now}/${req.now}`,
        method: 'GET',
      });

      const rowLength = res.data.DrainpipeMonitoringInfo.row.length;
      const waterLevel = (
        res.data.DrainpipeMonitoringInfo.row.reduce((acc, cur) => {
          acc += Number(cur.MEA_WAL);
          return acc;
        }, 0) / rowLength
      ).toFixed(4);

      return Number(waterLevel);
    } catch (error) {
      console.log(error);
    }
  }
}
