import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Donation, DonationDocument } from './schemas/donation.schema';
import { Donor, DonorDocument } from '../donors/schemas/donor.schema';

@Injectable()
export class DonationsService {
  constructor(
    @InjectModel(Donation.name) private donationModel: Model<DonationDocument>,
    @InjectModel(Donor.name) private donorModel: Model<DonorDocument>,
  ) {}

  private checkEligibility(lastDonationDate: string | null): { eligible: boolean; reason?: string } {
    if (!lastDonationDate) {
      return { eligible: true };
    }

    const lastDonation = new Date(lastDonationDate);
    const today = new Date();
    const daysSince = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
    
    const requiredDays = 90;
    
    if (daysSince >= requiredDays) {
      return { eligible: true };
    } else {
      const daysRemaining = requiredDays - daysSince;
      return {
        eligible: false,
        reason: `Donor must wait ${daysRemaining} more days. Last donation was ${daysSince} days ago.`,
      };
    }
  }

  async recordDonation(
    donorId: string,
    quantity: string,
    location: string,
    staffId: string,
    notes?: string,
  ) {
    const donor = await this.donorModel.findById(donorId);
    
    if (!donor) {
      throw new NotFoundException('Donor not found');
    }

    // Check eligibility
    const eligibility = this.checkEligibility(donor.lastDonationDate);
    if (!eligibility.eligible) {
      throw new BadRequestException(eligibility.reason);
    }

    const donation = new this.donationModel({
      donorId,
      donationDate: new Date(),
      bloodType: donor.bloodType,
      quantity,
      location,
      staffId,
      notes,
    });

    await donation.save();

    // Update donor
    donor.lastDonationDate = donation.donationDate.toISOString();
    donor.donationHistory.push(donation._id.toString());
    await donor.save();

    return {
      success: true,
      message: 'Donation recorded successfully',
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
        lastDonationDate: donor.lastDonationDate,
        donationHistory: donor.donationHistory,
        medicalNotes: donor.medicalNotes,
        registrationDate: donor.registrationDate,
        credentialId: donor.credentialId,
      },
    };
  }

  async findAll() {
    return await this.donationModel.find().populate('donorId staffId');
  }
}