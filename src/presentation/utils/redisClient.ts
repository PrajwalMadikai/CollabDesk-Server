import { createClient, RedisClientOptions } from "redis";


let isConnecting = false;
let connectionAttempts = 0;

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: 6379,
        connectTimeout: 10000
    },
    retry: {
        strategy: (times: number) => Math.min(times * 50, 2000)
    }
} as RedisClientOptions);

redisClient.on('error', (err) => {
    console.error('Redis client error:', err);
});

redisClient.on('connect', () => {
    console.log('Redis client connected');
    isConnecting = false;
    connectionAttempts = 0;
});

async function connectRedis() {
    if (isConnecting) {
        console.log('Connection attempt already in progress, skipping...');
        return;
    }

    try {
        console.log(`Attempting Redis connection... Attempt ${connectionAttempts}`);
        isConnecting = true;
        connectionAttempts++;

        // Check if client is already connected before attempting connection
        if (redisClient.isOpen) {
            console.log('Redis client is already connected');
            isConnecting = false;
            return;
        }

        await redisClient.connect();
        console.log('Redis connected successfully');
        isConnecting = false;
    } catch (err) {
        console.error('Redis connection error:', err);
        isConnecting = false;

        if (connectionAttempts < 10) { // Limit retries to avoid infinite attempts
            console.log('Retrying in 5 seconds...');
            setTimeout(connectRedis, 5000);
        } else {
            console.error('Maximum connection attempts reached. Please check Redis configuration.');
        }
    }
}

connectRedis();

export default redisClient;