const Redis = require('ioredis');


const redisClient = new Redis({
  host: 'localhost', // default is 127.0.0.1
  port: 6379,        // default is 6379
  db: 0              // default is 0
});

redisClient.on('connect', () => {
  console.log('Redis client connected');
});

redisClient.on('error', (err) => {
  console.error('Error connecting to Redis:', err); 
});

const setValue = async (key, value) => {
  try {
    await redisClient.set(key, JSON.stringify(value));
    console.log(`Set key ${key} with value ${value}`);
  } catch (err) {
    console.error('Error setting value in Redis:', err);
  }
};

const getValue = async (key) => {
  try {
    const value = await redisClient.get(key);
    console.log(`Got value ${value} for key ${key}`);
    return JSON.parse(value);
  } catch (err) {
    console.error('Error getting value from Redis:', err);
  }
};

module.exports = {
  redisClient,
  setValue,
  getValue
};
