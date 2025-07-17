"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    username: zod_1.z.string().min(2).max(50).optional(),
    password: zod_1.z.string().min(8),
});
exports.userUpdateSchema = exports.userSchema.partial();
