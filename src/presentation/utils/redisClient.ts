import { createClient } from "redis";

const redisClient=createClient({
    socket:{
        host: '127.0.0.1',  
        port: 6379, 
    }
})

redisClient.connect().catch((err) => console.error('Redis connection error:', err));

export default redisClient