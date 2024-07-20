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
exports.BotService = void 0;
const common_1 = require("@nestjs/common");
const sequelize_1 = require("@nestjs/sequelize");
const bot_model_1 = require("./model/bot.model");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const app_constants_1 = require("../app.constants");
const telegraf_1 = require("telegraf");
const users_service_1 = require("../users/users.service");
let BotService = class BotService {
    constructor(botRepo, bot, users) {
        this.botRepo = botRepo;
        this.bot = bot;
        this.users = users;
        this.step = 0;
        this.step1 = 0;
        this.user = {};
        this.car = {};
    }
    async start(ctx) {
        this.step = 0;
        this.step1 = 0;
        await ctx.reply('Assalomu alaykum  ' +
            ctx.message.from.first_name +
            '\n' +
            'Avtomobil yuvish uchun Registration uchun ekranning pastki qismidagi (Registration) tugmasini bosing.', {
            reply_markup: {
                keyboard: [
                    [{ text: 'Registration' }, { text: 'About us' }],
                    [{ text: 'Our location 📍' }, { text: 'Contact with us 📲' }],
                ],
                resize_keyboard: true,
            },
        });
    }
    async onMessage(ctx) {
        if ('text' in ctx.message) {
            const ret = 'return back';
            console.log(this.step);
            function returnBack(ctx, user, step, step1) {
                ctx.reply(`id: ${user.id}
Name: ${user.name || 'empty'},
Age: ${user.age || 'empty'},
Mashina: ${user.car_name || 'empty'}`, {
                    reply_markup: {
                        keyboard: [
                            [{ text: 'Resgistration' }, { text: 'About us' }],
                            [{ text: 'Our location 📍' }, { text: 'Contact with us 📲' }],
                        ],
                        resize_keyboard: true,
                    },
                });
            }
            if (ctx.message.text == 'Our location 📍') {
                await ctx.sendLocation(35.804819, 51.43407, {
                    live_period: 86400,
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step == 0 && ctx.message.text == 'Registration') {
                this.user.id = ctx.message.from.id;
                this.step++;
                await ctx.reply('Enter your name', {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step == 1 && this.user.id == ctx.message.from.id) {
                this.user.name = ctx.message.text;
                this.step++;
                await ctx.reply(`Enter your age`, {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step == 2 && this.user.id == ctx.message.from.id) {
                this.user.age = ctx.message.text;
                this.step++;
                await ctx.reply(`Car name`, {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step == 3 && this.user.id == ctx.message.from.id) {
                this.user.car_name = ctx.message.text;
                await ctx.reply(`id: ${this.user.id}
                      Name: ${this.user.name},
                      Age: ${this.user.age},
                      Mashina: ${this.user.car_name} `);
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (ctx.message.text == 'About us') {
                await ctx.reply('Avtomobillarga xizmat ko’rsatish har doim daromadli xizmat ko’rsatish sohalaridan biri bo’lib kelmoqda. Ayniqsa har bir avtomobil egasi o’z mashinasiga o’zi xizmat ko’rsatsa bu ajoyib imkoniyatdan boshqa narsa emas.');
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (ctx.message.text == 'Registration') {
                await ctx.reply('Mashinagizni turini ayting', {
                    reply_markup: {
                        keyboard: [[{ text: 'Yengil mashina' }, { text: 'Yuk mashinasi' }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step1 == 0 && ctx.message.text == 'Yengil mashina') {
                console.log(ctx, 'Yengil mashina');
                this.car.id = ctx.message.from.id;
                this.step1++;
                await ctx.reply('Mashina name', {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step1 == 1 && this.car.id == ctx.message.from.id) {
                this.car.name = ctx.message.text;
                this.step1++;
                await ctx.reply(`Qanday yuvish kerek`, {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.car.id == ctx.message.from.id) {
                console.log(ctx.message.text);
                this.car.yuvish = ctx.message.text;
                this.step1++;
                await ctx.reply(`
Yengi mashina
id: ${this.car.id}
Car_name: ${this.car.name},
Type wash: ${this.car.yuvish},
                      `);
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (ctx.message.text == 'Add car') {
                await ctx.reply('Mashinagizni turini aytining', {
                    reply_markup: {
                        keyboard: [[{ text: 'Yengil mashina' }, { text: 'Yuk mashinasi' }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step1 == 0 && ctx.message.text == 'Yuk mashinasi') {
                console.log(ctx, 'Yengil mashina');
                this.car.id = ctx.message.from.id;
                this.step1++;
                await ctx.reply('Mashina name', {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.step1 == 1 && this.car.id == ctx.message.from.id) {
                this.car.name = ctx.message.text;
                this.step1++;
                await ctx.reply(`Qanday yuvish kerek`, {
                    reply_markup: {
                        keyboard: [[{ text: ret }]],
                        resize_keyboard: true,
                    },
                });
            }
            else if (ctx.message.text == ret) {
                this.step1 = --this.step1;
                this.step = --this.step;
                returnBack(ctx, this.user, this.step, this.step1);
            }
            else if (this.car.id == ctx.message.from.id) {
                console.log(ctx.message.text);
                this.car.yuvish = ctx.message.text;
                this.step1++;
                await ctx.reply(`
Yuk Mashinasi
id: ${this.car.id}
Car_name: ${this.car.name},
Type wash: ${this.car.yuvish},
                      `);
            }
        }
    }
};
exports.BotService = BotService;
exports.BotService = BotService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, sequelize_1.InjectModel)(bot_model_1.Bot)),
    __param(1, (0, nestjs_telegraf_1.InjectBot)(app_constants_1.BOT_NAME)),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof telegraf_1.Telegraf !== "undefined" && telegraf_1.Telegraf) === "function" ? _a : Object, users_service_1.UsersService])
], BotService);
//# sourceMappingURL=bot.service.js.map