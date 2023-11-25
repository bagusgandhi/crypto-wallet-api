import * as dotenv from 'dotenv';
dotenv.config();

export const Env = () => ({ 
    JWT_SECRET: process.env.JWT_SECRET
});
