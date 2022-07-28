import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { AppModule } from './../src/app.module';
import { AppController } from 'src/resources/app/app.controller';
import { AppService } from 'src/resources/app/app.service';

const path = require('path');

/*
    작성자 : 박신영
      - 프로젝트 대한 테스트 코드 작성
     */
    
describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    app = moduleFixture.createNestApplication();

    // 테스트 어플리케이션도 실제 어플리케이션처럼 작동하도록 설정해줍니다. 
    app.use(compression());
    app.enableVersioning();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    app.use(cookieParser());
    app.use('/public', express.static(path.join(__dirname, '../public')));

    await app.init();
  });

  // url에 대한 요청을 테스트 합니다. 
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('hello world!');
  });

  describe("/info", () => {
    it("GET 200", () => {
      return request(app.getHttpServer())
      .get("/info/?region=gangnam")
      .expect(200); 
    }); 

    it("GET 400", () => {
      return request(app.getHttpServer())
      .get("/info/?region=gangnaaaaam")
      .expect(400); 
    })
  });
});
