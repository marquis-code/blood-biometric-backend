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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async register(registerDto) {
        try {
            const user = await this.usersService.create({
                ...registerDto,
                role: registerDto.role || 'patient',
            });
            const payload = {
                sub: user._id.toString(),
                email: user.email,
                role: user.role
            };
            return {
                access_token: this.jwtService.sign(payload),
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            console.error('Registration error:', error);
            throw new common_1.InternalServerErrorException('Registration failed');
        }
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async validateGoogleUser(googleUser) {
        let user = await this.usersService.findByGoogleId(googleUser.googleId);
        if (!user) {
            user = await this.usersService.findByEmail(googleUser.email);
            if (user) {
                await this.usersService.update(user._id.toString(), { googleId: googleUser.googleId });
                user.googleId = googleUser.googleId;
            }
            else {
                user = await this.usersService.create({
                    ...googleUser,
                    role: 'patient',
                    isVerified: true,
                });
            }
        }
        const payload = {
            sub: user._id.toString(),
            email: user.email,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
            },
        };
    }
    async forgotPassword(email) {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            return { message: 'If an account exists, a password reset email has been sent.' };
        }
        const resetToken = this.jwtService.sign({ sub: user._id.toString(), type: 'password-reset' }, { expiresIn: '1h' });
        await this.usersService.setResetPasswordToken(email, resetToken);
        return { message: 'If an account exists, a password reset email has been sent.' };
    }
    async resetPassword(token, newPassword) {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'password-reset') {
                throw new common_1.UnauthorizedException('Invalid token');
            }
            await this.usersService.updatePassword(payload.sub, newPassword);
            return { message: 'Password has been reset successfully' };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map