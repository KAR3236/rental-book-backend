import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDetails } from 'src/models/customerDetails.model';
import { JwtStrategy } from './jwt.strategy';

@Module({
  // Here, Make configuration of typeorm module for which models need to use in auth services.
  // So, Add all models which are used in auth services.
  imports: [TypeOrmModule.forFeature([CustomerDetails])],
  // JwtStrategy must add in providers otherwise project will throw an error.
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
