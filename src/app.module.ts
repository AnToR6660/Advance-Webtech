import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AntorController } from './antor/antor.controller';
import { AntorService } from './antor/antor.service';
import { AntorModule } from './antor/antor.module';

@Module({
  imports: [AntorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
