import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import { Database } from './types';
dotenv.config();

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    max: 10
  })
});

export const db = new Kysely<Database>({dialect});