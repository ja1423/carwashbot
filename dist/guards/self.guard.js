"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfGuard = void 0;
const common_1 = require("@nestjs/common");
let SelfGuard = class SelfGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (String(req.user.id) !== req.params.id) {
            throw new common_1.ForbiddenException({
                message: 'Ruxsat etilmagan foydalanuvchi',
            });
        }
        return true;
    }
};
exports.SelfGuard = SelfGuard;
exports.SelfGuard = SelfGuard = __decorate([
    (0, common_1.Injectable)()
], SelfGuard);
//# sourceMappingURL=self.guard.js.map