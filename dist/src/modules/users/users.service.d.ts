import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private userModel;
    constructor(userModel: Model<any>);
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    findByGoogleId(googleId: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<void>;
    updatePassword(id: string, newPassword: string): Promise<void>;
    verifyUser(id: string): Promise<void>;
    setResetPasswordToken(email: string, token: string): Promise<void>;
}
