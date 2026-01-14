import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Staff, StaffDocument } from './schemas/staff.schema';

@Injectable()
export class StaffService {
  constructor(
    @InjectModel(Staff.name) private staffModel: Model<StaffDocument>,
  ) {
    this.seedStaffUsers();
  }

  private async seedStaffUsers() {
    const count = await this.staffModel.countDocuments();
    if (count === 0) {
      const defaultStaff = [
        { name: 'Nurse Jane', email: 'nurse@hospital.com', password: 'nurse123', role: 'nurse' },
        { name: 'Dr. Smith', email: 'doctor@hospital.com', password: 'doctor123', role: 'doctor' },
      ];

      await this.staffModel.insertMany(defaultStaff);
      console.log('Default staff users created');
    }
  }

  async login(email: string, password: string) {
    // In production, hash and compare passwords properly!
    const staff = await this.staffModel.findOne({ email, password });
    
    if (!staff) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      success: true,
      message: 'Login successful',
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    };
  }
}