import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerDetails } from 'src/models/customerDetails.model';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CustomerDetails)
    private customerDetailsModel: Repository<CustomerDetails>,
  ) {}

  async validateUserById(id: number): Promise<CustomerDetails | null> {
    // This query will find data based on is which is in the token.
    return await this.customerDetailsModel.findOne({ where: { id } });
  }
}
