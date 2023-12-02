import * as dotenv from 'dotenv';
dotenv.config();

export const Env = () => ({ 
    JWT_SECRET: process.env.JWT_SECRET,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT
});
