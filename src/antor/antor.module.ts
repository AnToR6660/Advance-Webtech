import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userInfo } from 'os';
import { PropertyTbl, userTbl } from './antor.entity';
import { AntorController } from './antor.controller';
import { AntorService } from './antor.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'; 
@Module({
    imports: [TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'antor',
      database: 'sweethome',
      entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([userTbl,PropertyTbl]),
    JwtModule.register({
      secret:'secret',
      signOptions:{expiresIn:'100s'}
    }),
    
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com', // Gmail SMTP server
        port: 465, // SSL port
        secure: true, // Use SSL
        auth: {
          user: 'tahmeedhossain99@gmail.com', // Your Gmail address
          pass: 'qzkf itzw rybd piln', // Your Gmail password or App Password
        },
      },
      defaults: {
        from: '"No Reply" <your-email@gmail.com>', // Default from email address
      },
      template: {
        dir: join(__dirname, 'templates'), // Optional: directory for email templates
        adapter: new HandlebarsAdapter(), // Use Handlebars for email templating (optional)
        options: {
          strict: true,
        },
      },
    }),
  
  
  ],
  controllers: [AntorController],
  providers: [AntorService,AuthGuard],
})
export class AntorModule {}
