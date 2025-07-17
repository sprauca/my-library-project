import {z} from 'zod';

export const userSchema = z.object({
    email: z.string().email(),
    username: z.string().min(2).max(50).optional(),
    password: z.string().min(8),
});

export const userUpdateSchema = userSchema.partial();