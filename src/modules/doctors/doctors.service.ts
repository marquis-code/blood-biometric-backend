import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DoctorProfile, DoctorProfileDocument } from './schemas/doctor-profile.schema';
import { CreateDoctorProfileDto, ConsultationFeeDto } from './dto/create-doctor-profile.dto';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectModel(DoctorProfile.name) private doctorProfileModel: Model<DoctorProfileDocument>,
  ) {}

  async createProfile(userId: string, createDoctorProfileDto: CreateDoctorProfileDto): Promise<DoctorProfile> {
    const existingProfile = await this.doctorProfileModel.findOne({ userId });
    
    if (existingProfile) {
      throw new ConflictException('Doctor profile already exists');
    }

    // ✅ Ensure default consultation fees if not provided
    const defaultConsultationFees = [
      { type: 'video', amount: 0, currency: 'NGN', isActive: true },
      { type: 'audio', amount: 0, currency: 'NGN', isActive: true },
      { type: 'chat', amount: 0, currency: 'NGN', isActive: true },
      { type: 'in-person', amount: 0, currency: 'NGN', isActive: false }
    ];

    const consultationFees = createDoctorProfileDto.consultationFees?.length > 0 
      ? createDoctorProfileDto.consultationFees.map(fee => ({
          ...fee,
          currency: fee.currency || 'NGN',
          isActive: fee.isActive ?? true
        }))
      : defaultConsultationFees;

    const doctorProfile = new this.doctorProfileModel({
      userId,
      ...createDoctorProfileDto,
      consultationFees,
    });

    return doctorProfile.save();
  }

  async findAll(filters?: { specialty?: string; language?: string; minRating?: number }): Promise<DoctorProfile[]> {
    const query: any = { verificationStatus: 'approved', isActive: true };

    if (filters?.specialty) {
      query.specialties = { $in: [filters.specialty] };
    }

    if (filters?.language) {
      query.languages = { $in: [filters.language] };
    }

    if (filters?.minRating) {
      query.averageRating = { $gte: filters.minRating };
    }

    return this.doctorProfileModel
      .find(query)
      .populate('userId', 'firstName lastName email profileImage')
      .sort({ averageRating: -1 })
      .exec();
  }

    async findOne(id: string): Promise<DoctorProfile> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    const doctor = await this.doctorProfileModel
      .findById(id)
      .populate('userId', 'firstName lastName email profileImage phone')
      .exec();
      
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return doctor;
  }

  // async findOne(id: string): Promise<DoctorProfile> {
  //   const doctor = await this.doctorProfileModel
  //     .findById(id)
  //     .populate('userId', 'firstName lastName email profileImage phone')
  //     .exec();
      
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor profile not found');
  //   }

  //   return doctor;
  // }

  async findByUserId(userId: string): Promise<DoctorProfile | null> {
    const doctorProfile = await this.doctorProfileModel
      .findOne({ userId })
      .populate('userId', 'firstName lastName email')
      .exec();

    return doctorProfile;
  }

  async updateProfile(userId: string, updateDoctorProfileDto: UpdateDoctorProfileDto): Promise<DoctorProfile> {
    const doctorProfile = await this.doctorProfileModel.findOne({ userId });
    
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updatedProfile = await this.doctorProfileModel
      .findByIdAndUpdate(doctorProfile._id, updateDoctorProfileDto, { new: true })
      .populate('userId', 'firstName lastName email profileImage')
      .exec();

    return updatedProfile;
  }

  // ✅ NEW: Update consultation fees
  async updateConsultationFees(userId: string, consultationFees: ConsultationFeeDto[]): Promise<DoctorProfile> {
    const profile = await this.doctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    // ✅ Validate consultation types
    const validTypes = ['video', 'audio', 'chat', 'in-person'];
    const invalidTypes = consultationFees.filter(fee => !validTypes.includes(fee.type));
    
    if (invalidTypes.length > 0) {
      throw new BadRequestException(`Invalid consultation types: ${invalidTypes.map(f => f.type).join(', ')}`);
    }

    // ✅ Update or add consultation fees
    for (const newFee of consultationFees) {
      const existingFeeIndex = profile.consultationFees.findIndex(fee => fee.type === newFee.type);
      
      const feeData = {
        type: newFee.type,
        amount: newFee.amount,
        currency: newFee.currency || 'NGN',
        isActive: newFee.isActive ?? true
      };

      if (existingFeeIndex >= 0) {
        // Update existing fee
        profile.consultationFees[existingFeeIndex] = feeData;
      } else {
        // Add new fee
        profile.consultationFees.push(feeData);
      }
    }

    return await profile.save();
  }

  // ✅ NEW: Get consultation fee for a specific type
  async getConsultationFee(userId: string, consultationType: string): Promise<any> {
    const profile = await this.doctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const consultationFee = profile.consultationFees.find(
      fee => fee.type === consultationType && fee.isActive
    );

    if (!consultationFee) {
      throw new NotFoundException(`Consultation fee not found for type: ${consultationType}`);
    }

    return consultationFee;
  }

  // ✅ NEW: Get all active consultation types for a doctor
  async getActiveConsultationTypes(userId: string): Promise<any[]> {
    const profile = await this.doctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return profile.consultationFees.filter(fee => fee.isActive);
  }

  // ✅ NEW: Toggle consultation type availability
  async toggleConsultationType(userId: string, consultationType: string, isActive: boolean): Promise<DoctorProfile> {
    const profile = await this.doctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const consultationFee = profile.consultationFees.find(fee => fee.type === consultationType);
    
    if (!consultationFee) {
      throw new NotFoundException(`Consultation type not found: ${consultationType}`);
    }

    consultationFee.isActive = isActive;
    return await profile.save();
  }

  // ✅ NEW: Get consultation fees by currency
  async getConsultationFeesByCurrency(userId: string, currency: string = 'NGN'): Promise<any[]> {
    const profile = await this.doctorProfileModel.findOne({ userId });
    
    if (!profile) {
      throw new NotFoundException('Doctor profile not found');
    }

    return profile.consultationFees.filter(
      fee => fee.currency === currency && fee.isActive
    );
  }

  async updateStripeConnectId(userId: string, stripeConnectId: string): Promise<void> {
    const result = await this.doctorProfileModel.findOneAndUpdate(
      { userId },
      { stripeConnectId },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Doctor profile not found');
    }
  }

  async updateAvailability(userId: string, updateAvailabilityDto: UpdateAvailabilityDto): Promise<DoctorProfile> {
    const doctorProfile = await this.doctorProfileModel.findOne({ userId });
    
    if (!doctorProfile) {
      throw new NotFoundException('Doctor profile not found');
    }

    const updatedProfile = await this.doctorProfileModel
      .findByIdAndUpdate(doctorProfile._id, updateAvailabilityDto, { new: true })
      .populate('userId', 'firstName lastName email profileImage')
      .exec();

    return updatedProfile;
  }

  // async verifyDoctor(id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<DoctorProfile> {
  //   const updateData: any = { verificationStatus: status };
    
  //   if (status === 'rejected' && rejectionReason) {
  //     updateData.rejectionReason = rejectionReason;
  //   }

  //   const updatedDoctor = await this.doctorProfileModel
  //     .findByIdAndUpdate(id, updateData, { new: true })
  //     .populate('userId', 'firstName lastName email')
  //     .exec();

  //   if (!updatedDoctor) {
  //     throw new NotFoundException('Doctor profile not found');
  //   }

  //   return updatedDoctor;
  // }

   async verifyDoctor(id: string, status: 'approved' | 'rejected', rejectionReason?: string): Promise<DoctorProfile> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    const updateData: any = { verificationStatus: status };
    
    if (status === 'rejected' && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedDoctor = await this.doctorProfileModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate('userId', 'firstName lastName email')
      .exec();

    if (!updatedDoctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    return updatedDoctor;
  }

  // async updateRating(doctorId: string, newRating: number): Promise<void> {
  //   const doctor = await this.doctorProfileModel.findById(doctorId);
    
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor not found');
  //   }

  //   const totalRatings = doctor.averageRating * doctor.totalReviews;
  //   const newTotalReviews = doctor.totalReviews + 1;
  //   const newAverageRating = (totalRatings + newRating) / newTotalReviews;

  //   await this.doctorProfileModel.findByIdAndUpdate(doctorId, {
  //     averageRating: Number(newAverageRating.toFixed(2)),
  //     totalReviews: newTotalReviews,
  //   });
  // }

    async updateRating(doctorId: string, newRating: number): Promise<void> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    const doctor = await this.doctorProfileModel.findById(doctorId);
    
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const totalRatings = doctor.averageRating * doctor.totalReviews;
    const newTotalReviews = doctor.totalReviews + 1;
    const newAverageRating = (totalRatings + newRating) / newTotalReviews;

    await this.doctorProfileModel.findByIdAndUpdate(doctorId, {
      averageRating: Number(newAverageRating.toFixed(2)),
      totalReviews: newTotalReviews,
    });
  }


  // async incrementConsultations(doctorId: string): Promise<void> {
  //   await this.doctorProfileModel.findByIdAndUpdate(doctorId, {
  //     $inc: { totalConsultations: 1 },
  //   });
  // }

  // async getAvailableSlots(doctorId: string, date: string): Promise<any[]> {
  //   const doctor = await this.doctorProfileModel.findById(doctorId);
    
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor not found');
  //   }

  //   const requestedDate = new Date(date);

  //   // ✅ Convert the Date to a weekday string first
  //   const dayOfWeek = requestedDate
  //     .toLocaleString('en-US', { weekday: 'short' }) // e.g. "Mon", "Tue"
  //     .toLowerCase()                                 // => "mon"
  //     .substring(0, 3);

  //   const dayMapping: Record<string, string> = {
  //     sun: 'sunday',
  //     mon: 'monday',
  //     tue: 'tuesday',
  //     wed: 'wednesday',
  //     thu: 'thursday',
  //     fri: 'friday',
  //     sat: 'saturday'
  //   };

  //   const dayName = dayMapping[dayOfWeek];
  //   const dayAvailability = doctor.availability.find(avail => avail.day === dayName);

  //   if (!dayAvailability) {
  //     return [];
  //   }

  //   // Check if the date is in blackout dates
  //   const isBlackoutDate = doctor.blackoutDates.some(blackoutDate => 
  //     blackoutDate.toDateString() === requestedDate.toDateString()
  //   );

  //   if (isBlackoutDate) {
  //     return [];
  //   }

  //   return dayAvailability.slots.filter(slot => slot.isAvailable);
  // }

    async incrementConsultations(doctorId: string): Promise<void> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    await this.doctorProfileModel.findByIdAndUpdate(doctorId, {
      $inc: { totalConsultations: 1 },
    });
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<any[]> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    const doctor = await this.doctorProfileModel.findById(doctorId);
    
    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    const requestedDate = new Date(date);

    // ✅ Convert the Date to a weekday string first
    const dayOfWeek = requestedDate
      .toLocaleString('en-US', { weekday: 'short' }) // e.g. "Mon", "Tue"
      .toLowerCase()                                 // => "mon"
      .substring(0, 3);

    const dayMapping: Record<string, string> = {
      sun: 'sunday',
      mon: 'monday',
      tue: 'tuesday',
      wed: 'wednesday',
      thu: 'thursday',
      fri: 'friday',
      sat: 'saturday'
    };

    const dayName = dayMapping[dayOfWeek];
    const dayAvailability = doctor.availability.find(avail => avail.day === dayName);

    if (!dayAvailability) {
      return [];
    }

    // Check if the date is in blackout dates
    const isBlackoutDate = doctor.blackoutDates.some(blackoutDate => 
      blackoutDate.toDateString() === requestedDate.toDateString()
    );

    if (isBlackoutDate) {
      return [];
    }

    return dayAvailability.slots.filter(slot => slot.isAvailable);
  }


  // async deactivateDoctor(id: string): Promise<void> {
  //   const result = await this.doctorProfileModel.findByIdAndUpdate(
  //     id,
  //     { isActive: false },
  //     { new: true }
  //   );

  //   if (!result) {
  //     throw new NotFoundException('Doctor profile not found');
  //   }
  // }

  // ✅ NEW: Get doctor with consultation fees for booking
  // async getDoctorForBooking(doctorId: string): Promise<DoctorProfile> {
  //   const doctor = await this.doctorProfileModel
  //     .findById(doctorId)
  //     .populate('userId', 'firstName lastName email profileImage')
  //     .exec();
      
  //   if (!doctor) {
  //     throw new NotFoundException('Doctor profile not found');
  //   }

  //   if (doctor.verificationStatus !== 'approved' || !doctor.isActive) {
  //     throw new ForbiddenException('Doctor is not available for bookings');
  //   }

  //   return doctor;
  // }

    async deactivateDoctor(id: string): Promise<void> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    const result = await this.doctorProfileModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!result) {
      throw new NotFoundException('Doctor profile not found');
    }
  }

    async getDoctorForBooking(doctorId: string): Promise<DoctorProfile> {
    // ✅ Validate ObjectId format first
    if (!Types.ObjectId.isValid(doctorId)) {
      throw new BadRequestException('Invalid doctor ID format');
    }

    const doctor = await this.doctorProfileModel
      .findById(doctorId)
      .populate('userId', 'firstName lastName email profileImage')
      .exec();
      
    if (!doctor) {
      throw new NotFoundException('Doctor profile not found');
    }

    if (doctor.verificationStatus !== 'approved' || !doctor.isActive) {
      throw new ForbiddenException('Doctor is not available for bookings');
    }

    return doctor;
  }
}