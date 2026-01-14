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
exports.BiometricService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const donor_schema_1 = require("../donors/schemas/donor.schema");
const crypto = require("crypto");
let BiometricService = class BiometricService {
    constructor(donorModel) {
        this.donorModel = donorModel;
        this.challenges = new Map();
        setInterval(() => this.cleanupChallenges(), 5 * 60 * 1000);
    }
    cleanupChallenges() {
        const now = Date.now();
        const maxAge = 5 * 60 * 1000;
        for (const [key, value] of this.challenges.entries()) {
            if (now - value.timestamp > maxAge) {
                this.challenges.delete(key);
            }
        }
    }
    generateChallenge() {
        return crypto.randomBytes(32).toString('base64');
    }
    getRpId() {
        return process.env.RP_ID || 'localhost';
    }
    async createRegistrationChallenge(userId, userName, userEmail) {
        const challenge = this.generateChallenge();
        const userIdBase64 = Buffer.from(userId).toString('base64');
        this.challenges.set(userId, { challenge, timestamp: Date.now() });
        const existingDonor = await this.donorModel.findOne({ email: userEmail });
        const excludeCredentials = existingDonor ? [
            {
                id: existingDonor.credentialId,
                type: 'public-key',
            }
        ] : [];
        return {
            challenge,
            userId: userIdBase64,
            rpId: this.getRpId(),
            excludeCredentials,
        };
    }
    async verifyRegistration(userId, credentialId, publicKey, attestationObject, clientDataJSON, challenge) {
        const storedChallenge = this.challenges.get(userId);
        if (!storedChallenge || storedChallenge.challenge !== challenge) {
            return { success: false, message: 'Invalid challenge' };
        }
        this.challenges.delete(userId);
        const existing = await this.donorModel.findOne({ credentialId });
        if (existing) {
            return { success: false, message: 'Fingerprint already registered' };
        }
        return { success: true };
    }
    async createAuthenticationChallenge() {
        const challenge = this.generateChallenge();
        const challengeId = crypto.randomBytes(16).toString('hex');
        this.challenges.set(challengeId, { challenge, timestamp: Date.now() });
        return {
            challenge,
            challengeId,
            rpId: this.getRpId(),
        };
    }
    async verifyAuthentication(credentialId, authenticatorData, clientDataJSON, signature, challenge) {
        const donor = await this.donorModel.findOne({ credentialId });
        if (!donor) {
            return { success: false, message: 'Fingerprint not recognized' };
        }
        return {
            success: true,
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
    async getAllCredentials() {
        const donors = await this.donorModel.find({}, 'credentialId');
        const challenge = this.generateChallenge();
        const challengeId = crypto.randomBytes(16).toString('hex');
        this.challenges.set(challengeId, { challenge, timestamp: Date.now() });
        return {
            credentials: donors.map(d => ({ credentialId: d.credentialId })),
            challenge,
            challengeId,
            rpId: this.getRpId(),
        };
    }
};
BiometricService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(donor_schema_1.Donor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BiometricService);
exports.BiometricService = BiometricService;
//# sourceMappingURL=biometric.service.js.map