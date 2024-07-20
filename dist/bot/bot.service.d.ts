import { Bot } from './model/bot.model';
import { Context, Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';
export declare class BotService {
    private botRepo;
    private readonly bot;
    private readonly users;
    private step;
    private step1;
    private user;
    private car;
    constructor(botRepo: typeof Bot, bot: Telegraf<Context>, users: UsersService);
    start(ctx: Context): Promise<void>;
    onMessage(ctx: Context): Promise<void>;
}
