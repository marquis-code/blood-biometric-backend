import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donor, DonorDocument } from './schemas/donor.schema';
import { CreateDonorDto } from './dto/create-donor.dto';

@Injectable()
export class DonorsService {
  constructor(
    @InjectModel(Donor.name) private donorModel: Model<DonorDocument>,
  ) {}

  async register(createDonorDto: CreateDonorDto) {
    // Check if email or phone already exists
    const existing = await this.donorModel.findOne({
      $or: [
        { email: createDonorDto.email },
        { phone: createDonorDto.phone },
      ],
    });

    if (existing) {
      throw new ConflictException('Email or phone number already registered');
    }

    // Check if credential ID already exists
    const existingCredential = await this.donorModel.findOne({
      credentialId: createDonorDto.credentialId,
    });

    if (existingCredential) {
      throw new ConflictException('This fingerprint is already registered');
    }

    const donor = new this.donorModel({
      ...createDonorDto,
      registrationDate: new Date(),
      lastDonationDate: null,
      donationHistory: [],
    });

    await donor.save();

    return {
      success: true,
      message: 'Donor registered successfully',
      donor: {
        id: donor._id,
        firstName: donor.firstName,
        lastName: donor.lastName,
        email: donor.email,
        phone: donor.phone,
        dateOfBirth: donor.dateOfBirth,
        bloodType: donor.bloodType,
gender: donor.gender,
address: donor.address,
credentialId: donor.credentialId,
registrationDate: donor.registrationDate,
lastDonationDate: donor.lastDonationDate,
donationHistory: donor.donationHistory,
medicalNotes: donor.medicalNotes,
},
};
}async findAll() {
const donors = await this.donorModel.find().populate('donationHistory');
return donors;
}async findById(id: string) {
return await this.donorModel.findById(id).populate('donationHistory');
}
}