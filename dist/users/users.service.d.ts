import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Users } from './model/user.model';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { MailService } from '../mail/mail.service';
import { LoginUserDto } from './dto/login_user.dto';
import { FindUserDto } from './dto/find_user.dto';
import { Otp } from '../otp/model/otp.model';
export declare class UsersService {
    private readonly userRepo;
    private readonly otpRepo;
    private readonly jwtService;
    private readonly mailService;
    constructor(userRepo: typeof Users, otpRepo: typeof Otp, jwtService: JwtService, mailService: MailService);
    getTokens(user: Users): Promise<{
        access_token: any;
        refresh_token: any;
    }>;
    registration(createUserDto: CreateUserDto, res: Response): Promise<{
        message: string;
        user: any;
        tokens: {
            access_token: any;
            refresh_token: any;
        };
    }>;
    create(createUserDto: CreateUserDto): Promise<any>;
    activate(link: string): Promise<{
        message: string;
        user: any;
    }>;
    login(loginUserDto: LoginUserDto, res: Response): Promise<{
        message: string;
        user: any;
        tokens: {
            access_token: any;
            refresh_token: any;
        };
    }>;
    logout(refreshToken: string, res: Response): Promise<{
        message: string;
        user_refresh_token: any;
    }>;
    refreshToken(userId: number, refreshToken: string, res: Response): Promise<{
        message: string;
        user: any;
        tokens: {
            access_token: any;
            refresh_token: any;
        };
    }>;
    findUser(findUserDto: FindUserDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: number): Promise<any>;
    update(id: number, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: number): Promise<"Not found" | "removed successfully">;
}
