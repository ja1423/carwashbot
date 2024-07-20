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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const user_model_1 = require("./model/user.model");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const uuid_1 = require("uuid");
const mail_service_1 = require("../mail/mail.service");
const sequelize_2 = require("sequelize");
const otp_model_1 = require("../otp/model/otp.model");
let UsersService = class UsersService {
    constructor(userRepo, otpRepo, jwtService, mailService) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.jwtService = jwtService;
        this.mailService = mailService;
    }
    async getTokens(user) {
        const payload = {
            id: user.id,
            isActive: user.isActive,
            isOwner: user.isOwner,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.ACCESS_TOKEN_KEY,
                expiresIn: process.env.ACCESS_TOKEN_TIME,
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.REFRESH_TOKEN_KEY,
                expiresIn: process.env.REFRESH_TOKEN_TIME,
            }),
        ]);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
        };
    }
    async registration(createUserDto, res) {
        const user = await this.userRepo.findOne({
            where: { email: createUserDto.email },
        });
        if (user) {
            throw new common_1.BadRequestException('This user already exists');
        }
        if (createUserDto.password !== createUserDto.confirPassword) {
            throw new common_1.BadRequestException('Password does not match');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 7);
        const newUser = await this.userRepo.create({
            ...createUserDto,
            hashedPassword,
        });
        const tokens = await this.getTokens(newUser);
        const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
        const activationLink = (0, uuid_1.v4)();
        const updatedUser = await this.userRepo.update({ hashedRefreshToken, activationLink }, { where: { id: newUser.id }, returning: true });
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 1000,
            httpOnly: true,
        });
        try {
            await this.mailService.sendMail(updatedUser[1][0]);
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('Send error');
        }
        const response = {
            message: 'User registered',
            user: updatedUser[1][0],
            tokens,
        };
        return response;
    }
    async create(createUserDto) {
        return this.userRepo.create(createUserDto);
    }
    async activate(link) {
        if (!link) {
            throw new common_1.BadRequestException('Activation link not found');
        }
        const updateUser = await this.userRepo.update({ isActive: true }, {
            where: { activationLink: link, isActive: false },
            returning: true,
        });
        if (!updateUser[1][0]) {
            throw new common_1.BadRequestException('User already activated');
        }
        const response = {
            message: 'User activated successfully',
            user: updateUser[1][0].isActive,
        };
        return response;
    }
    async login(loginUserDto, res) {
        const { email, password } = loginUserDto;
        const user = await this.userRepo.findOne({ where: { email } });
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        if (!user.isActive) {
            throw new common_1.BadRequestException('User not activated');
        }
        const isMatchPass = await bcrypt.compare(password, user.hashedPassword);
        if (!isMatchPass) {
            throw new common_1.BadRequestException('Password is not match');
        }
        const tokens = await this.getTokens(user);
        const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
        const activationLink = (0, uuid_1.v4)();
        const updatedUser = await this.userRepo.update({ hashedRefreshToken, activationLink }, { where: { id: user.id }, returning: true });
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 1000,
            httpOnly: true,
        });
        const response = {
            message: 'User registered',
            user: updatedUser[1][0],
            tokens,
        };
        return response;
    }
    async logout(refreshToken, res) {
        const userData = await this.jwtService.verify(refreshToken, {
            secret: process.env.REFRESH_TOKEN_KEY,
        });
        if (!userData) {
            throw new common_1.ForbiddenException('User not verified');
        }
        const updateUser = await this.userRepo.update({
            hashedPassword: null,
        }, {
            where: { id: userData.id },
            returning: true,
        });
        res.clearCookie('refresh_token');
        const reponse = {
            message: 'User logged out successfully',
            user_refresh_token: updateUser[1][0].hashedRefreshToken,
        };
        return reponse;
    }
    async refreshToken(userId, refreshToken, res) {
        console.log(refreshToken);
        const decodecToken = await this.jwtService.decode(refreshToken);
        if (userId != decodecToken['id']) {
            throw new common_1.BadRequestException('user not found');
        }
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user || !user.hashedRefreshToken) {
            throw new common_1.BadRequestException('user not found');
        }
        const tokenMatch = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
        if (!tokenMatch) {
            throw new common_1.ForbiddenException('Forbiddin');
        }
        const tokens = await this.getTokens(user);
        const hashedRefreshToken = await bcrypt.hash(tokens.refresh_token, 7);
        const activationLink = (0, uuid_1.v4)();
        const updatedUser = await this.userRepo.update({ hashedRefreshToken, activationLink }, { where: { id: user.id }, returning: true });
        res.cookie('refresh_token', tokens.refresh_token, {
            maxAge: 15 * 24 * 60 * 1000,
            httpOnly: true,
        });
        const response = {
            message: 'User refreshed',
            user: updatedUser[1][0],
            tokens,
        };
        return response;
    }
    async findUser(findUserDto) {
        const where = {};
        if (findUserDto.fullName) {
            where['fullName'] = {
                [sequelize_2.Op.like]: `%${findUserDto.fullName}%`,
            };
        }
        if (findUserDto.email) {
            where['email'] = {
                [sequelize_2.Op.like]: `%${findUserDto.email}%`,
            };
        }
        if (findUserDto.phone) {
            where['phone'] = {
                [sequelize_2.Op.like]: `%${findUserDto.phone}%`,
            };
        }
        if (findUserDto.tgLink) {
            where['tgLink'] = {
                [sequelize_2.Op.like]: `%${findUserDto.tgLink}%`,
            };
        }
        console.log(where);
        const users = await this.userRepo.findAll({ where });
        if (users) {
            throw new common_1.BadRequestException('User not found');
        }
        return users;
    }
    async findAll() {
        return this.userRepo.findAll();
    }
    async findOne(id) {
        return this.userRepo.findByPk(id);
    }
    async update(id, updateUserDto) {
        const user = await this.userRepo.update(updateUserDto, {
            where: { id },
            returning: true,
        });
        return user[1][0];
    }
    async remove(id) {
        const userRows = await this.userRepo.destroy({ where: { id } });
        if (userRows == 0)
            return 'Not found';
        return 'removed successfully';
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(user_model_1.Users)),
    __param(1, (0, sequelize_1.InjectModel)(otp_model_1.Otp)),
    __metadata("design:paramtypes", [Object, Object, typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, mail_service_1.MailService])
], UsersService);
//# sourceMappingURL=users.service.js.map