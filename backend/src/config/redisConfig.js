import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Erro no Cliente Redis:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Conectado ao Redis.');
  } catch (err) {
    console.error('Não foi possível conectar ao Redis.', err);
  }
})();

export default redisClient;