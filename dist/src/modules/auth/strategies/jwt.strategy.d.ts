import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: unknown[]) => any;
export declare class JwtStrategy extends JwtStrategy_base {
    private usersService;
    private configService;
    constructor(usersService: UsersService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
        sub: string;
        email: string;
        role: string;
    }>;
}
export {};
