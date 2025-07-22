import {createClient, RedisArgument} from 'redis';
import { log } from './log';

const redisClient = await createClient({
  socket: {
    host: "redis",
    port: 6379
  }
})
.on("error", (err) => log(err))
.connect();

export class CacheUtil {
  private static DEFAULT_EXPIRE = 60;
  public static async get<T, TFunc extends (...args: any[]) => any>(key: string, cb: TFunc, expire: number = this.DEFAULT_EXPIRE, ...args: Parameters<TFunc>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      const data = await redisClient.get(key);
      if(data) {
        log(key + " Cache HIT!");
        resolve(JSON.parse(data) as T);
      } else {
        log(key + " Cache MISS!");
        const data = await cb(...args);
        await redisClient.setEx(key, expire, JSON.stringify(data));
        resolve(JSON.parse(JSON.stringify(data)) as T);
      }
    });
  }
}