import {createClient} from 'redis';
import { log } from './log';

export const redisClient = await createClient({
  socket: {
    host: "redis",
    port: 6379
  }
})
.on("error", (err) => log(err))
.connect();

export class RecipeCacheKey {
  public static GET_WEEKLY_RECIPES_KEY = 'GET:weekly-recipes';
  public static GET_POPULAR_RECIPES_KEY = 'GET:popular-recipes';
  public static GET_RECIPE_KEY = (recipe_id: string, recipe_name: string) => `GET:recipe_id=${recipe_id}&recipe_name=${recipe_name}`;
  public static TRANSFORM_IMAGE = (src: string, h: string, w: string, fit: string, quality: string,format: string, upscale: string, upscaleMethod: string) => `${src}?h=${h}&w=${w}&fit=${fit}&quality=${quality}&format=${format}&upscale=${upscale}&upscaleMethod=${upscaleMethod}`;
  public static GET_RECIPE_LIST = (page_no: number) => `GET:recipe-list-page=${page_no}`;
}

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
        if(data !== undefined) {
          await redisClient.setEx(key, expire, JSON.stringify(data));
          resolve(JSON.parse(JSON.stringify(data)) as T);
        } else {
          console.log(key + " No result found!");
          reject(undefined);
        }

      }
    });
  }

  public static async delete(key: string) {
    log("Successfully deleted cache data: " + key);
    await redisClient.del(key);
  }
}