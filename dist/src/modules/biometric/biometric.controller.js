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
exports.BiometricController = void 0;
const common_1 = require("@nestjs/common");
const biometric_service_1 = require("./biometric.service");
const registration_challenge_dto_1 = require("./dto/registration-challenge.dto");
const verify_registration_dto_1 = require("./dto/verify-registration.dto");
const verify_authentication_dto_1 = require("./dto/verify-authentication.dto");
let BiometricController = class BiometricController {
    constructor(biometricService) {
        this.biometricService = biometricService;
    }
    async getRegistrationChallenge(dto) {
        return await this.biometricService.createRegistrationChallenge(dto.userId, dto.userName, dto.userEmail);
    }
    async verifyRegistration(dto) {
        return await this.biometricService.verifyRegistration(dto.userId, dto.credentialId, dto.publicKey, dto.attestationObject, dto.clientDataJSON, dto.challenge);
    }
    async getAuthenticationChallenge() {
        return await this.biometricService.createAuthenticationChallenge();
    }
    async verifyAuthentication(dto) {
        return await this.biometricService.verifyAuthentication(dto.credentialId, dto.authenticatorData, dto.clientDataJSON, dto.signature, dto.challenge);
    }
    async getAllCredentials() {
        return await this.biometricService.getAllCredentials();
    }
};
__decorate([
    (0, common_1.Post)('registration-challenge'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [registration_challenge_dto_1.RegistrationChallengeDto]),
    __metadata("design:returntype", Promise)
], BiometricController.prototype, "getRegistrationChallenge", null);
__decorate([
    (0, common_1.Post)('verify-registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_registration_dto_1.VerifyRegistrationDto]),
    __metadata("design:returntype", Promise)
], BiometricController.prototype, "verifyRegistration", null);
__decorate([
    (0, common_1.Post)('authentication-challenge'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BiometricController.prototype, "getAuthenticationChallenge", null);
__decorate([
    (0, common_1.Post)('verify-authentication'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [verify_authentication_dto_1.VerifyAuthenticationDto]),
    __metadata("design:returntype", Promise)
], BiometricController.prototype, "verifyAuthentication", null);
__decorate([
    (0, common_1.Get)('get-all-credentials'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BiometricController.prototype, "getAllCredentials", null);
BiometricController = __decorate([
    (0, common_1.Controller)('api/biometric'),
    __metadata("design:paramtypes", [biometric_service_1.BiometricService])
], BiometricController);
exports.BiometricController = BiometricController;
//# sourceMappingURL=biometric.controller.js.map