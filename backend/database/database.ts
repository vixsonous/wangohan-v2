import {Kysely, PostgresDialect} from 'kysely';
import {Pool} from 'pg';
import dotenv from 'dotenv';
import { Database } from './types';
dotenv.config();

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    max: 10
  })
});

export const db = new Kysely<Database>({dialect});