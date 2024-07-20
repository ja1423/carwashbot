import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Response } from 'express';
import { LoginUserDto } from './dto/login_user.dto';
import { FindUserDto } from './dto/find_user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    registration(createUserDto: CreateUserDto, res: Response): Promise<{
        message: string;
        user: any;
        tokens: {
            access_token: any;
            refresh_token: any;
        };
    }>;
    create(createUserDto: CreateUserDto): Promise<any>;
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
    refresh(id: number, refreshToken: string, res: Response): Promise<{
        message: string;
        user: any;
        tokens: {
            access_token: any;
            refresh_token: any;
        };
    }>;
    activate(link: string): Promise<{
        message: string;
        user: any;
    }>;
    findUser(findUserDto: FindUserDto): Promise<any>;
    findAll(): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    remove(id: string): Promise<"Not found" | "removed successfully">;
}
