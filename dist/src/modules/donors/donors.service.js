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
exports.DonorsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const donor_schema_1 = require("./schemas/donor.schema");
let DonorsService = class DonorsService {
    constructor(donorModel) {
        this.donorModel = donorModel;
    }
    async register(createDonorDto) {
        const existing = await this.donorModel.findOne({
            $or: [
                { email: createDonorDto.email },
                { phone: createDonorDto.phone },
            ],
        });
        if (existing) {
            throw new common_1.ConflictException('Email or phone number already registered');
        }
        const existingCredential = await this.donorModel.findOne({
            credentialId: createDonorDto.credentialId,
        });
        if (existingCredential) {
            throw new common_1.ConflictException('This fingerprint is already registered');
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
    }
    async findAll() {
        const donors = await this.donorModel.find().populate('donationHistory');
        return donors;
    }
    async findById(id) {
        return await this.donorModel.findById(id).populate('donationHistory');
    }
};
DonorsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(donor_schema_1.Donor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], DonorsService);
exports.DonorsService = DonorsService;
//# sourceMappingURL=donors.service.js.map