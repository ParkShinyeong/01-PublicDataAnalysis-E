import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './resources/app/app.controller';
import { AppService } from './resources/app/app.service';

import { LoggerMiddleware } from './loggermiddleware';
import { PublicApiController } from './resources/publicApi/publicApi.controller';
import { PublicApiService } from './resources/publicApi/publicApi.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`env/development.env`, `env/.env`],
    }),
    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: () => {
    //     return {
    //        type: 'mariadb',
    //       host: process.env.DATABASE_HOST,
    //       port: parseInt(process.env.DATABASE_PORT),
    //       username: process.env.DATABASE_USER,
    //       password: process.env.DATABASE_PASS,
    //       database: process.env.DATABASE_NAME,
    //       charset: 'utf8mb4_unicode_ci',
    //       logging: true,
    //       autoLoadEntities: true,
    //       entities: [join(__dirname, '/**/*.entity.ts')],
    //       synchronize: false,
    //     };
    //   },
    // }),
    // TypeOrmModule.forFeature([]),
    AppModule,
  ],
  controllers: [PublicApiController, AppController],
  providers: [PublicApiService, AppService],
})
export class AppModule implements NestModule {
  static port: number;
  static apiVersion: string;
  static apiPrefix: string;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  constructor(private readonly configService: ConfigService) {
    AppModule.port = this.configService.get('SERVER_PORT');
    AppModule.apiVersion = this.configService.get('API_VERSION');
    AppModule.apiPrefix = this.configService.get('API_PREFIX');
  }
}
