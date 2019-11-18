
export const {
  PORT = 4000,
  NODE_ENV = 'development',
  MONGO_URI = 'mongodb+srv://Jack_Test:1234@cluster0-qfnqg.mongodb.net/test?retryWrites=true&w=majority',
  SESS_NAME = 'sid',
  SESS_SECRET = 'secret!session',
  SESS_LIFETIME = 1000 * 60 * 60 * 2
} = process.env;