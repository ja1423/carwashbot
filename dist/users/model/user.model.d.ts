import { Model } from 'sequelize-typescript';
interface IUserCreationAttr {
    fullName: string;
    hashedPassword: string;
    tgLink: string;
    email: string;
    phone: string;
    photo: string;
}
export declare class Users extends Model<Users, IUserCreationAttr> {
    id: number;
    fullName: string;
    hashedPassword: string;
    tgLink: string;
    email: string;
    phone: string;
    photo: string;
    isOwner: boolean;
    isActive: boolean;
    hashedRefreshToken: string;
    activationLink: string;
}
export {};
