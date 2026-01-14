"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DonationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const donation_schema_1 = require("./schemas/donation.schema");
const donor_schema_1 = require("../donors/schemas/donor.schema");
let DonationsService = class DonationsService {
    constructor(donationModel, donorModel) {
        this.donationModel = donationModel;
        this.donorModel = donorModel;
    }
    checkEligibility(lastDonationDate) {
        if (!lastDonationDate) {
            return { eligible: true };
        }
        const lastDonation = new Date(lastDonationDate);
        const today = new Date();
        const daysSince = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
        const requiredDays = 90;
        if (daysSince >= requiredDays) {
            return { eligible: true };
        }
        else {
            const daysRemaining = requiredDays - daysSince;
            return {
                eligible: false,
                reason: `Donor must wait ${daysRemaining} more days. Last donation was ${daysSince} days ago.`,
            };
        }
    }
    async recordDonation(donorId, quantity, location, staffId, notes) {
        const donor = await this.donorModel.findById(donorId);
        if (!donor) {
            throw new common_1.NotFoundException('Donor not found');
        }
        const eligibility = this.checkEligibility(donor.lastDonationDate);
        if (!eligibility.eligible) {
            throw new common_1.BadRequestException(eligibility.reason);
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
};
DonationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(donation_schema_1.Donation.name)),
    __param(1, (0, mongoose_1.InjectModel)(donor_schema_1.Donor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], DonationsService);
exports.DonationsService = DonationsService;
//# sourceMappingURL=donations.service.js.map