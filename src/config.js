import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = 4000,
  IN_PROD = process.env.NODE_ENV === 'production',
  SESS_NAME = 'sid',
  SESS_SECRET = 'ssh!secret!',
  SESS_LIFETIME = 1000 * 60 * 60 * 2, // 2 hours
  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
  REDIS_PASSWORD = 'secret',
} = process.env
