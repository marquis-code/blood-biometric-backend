import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { BiometricModule } from './modules/biometric/biometric.module';
import { DonorsModule } from './modules/donors/donors.module';
import { DonationsModule } from './modules/donations/donations.module';
import { StaffModule } from './modules/staff/staff.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`]
    }),

    MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('MONGO_URL'),
        }),
      }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, 
        limit: 100,
      },
    ]),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    BiometricModule,
    DonorsModule,
    DonationsModule,
    StaffModule,
  ]
})
export class AppModule {}