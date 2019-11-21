
export const {
  PORT = 4000,
  NODE_ENV = 'development',
  MONGO_URI = 'mongodb+srv://peichaodu:doctor2004@test-itworks-kjbyl.mongodb.net/test?retryWrites=true&w=majority',
  SESS_NAME = 'sid',
  SESS_SECRET = 'secret!session',
  SESS_LIFETIME = 1000 * 60 * 60 * 2
} = process.env;
