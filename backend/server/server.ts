import express, { urlencoded } from 'express';
import { router } from './routes';
import passport from './utils/passport';
import session from 'express-session';
import { redisClient } from './utils/redis';
import {RedisStore} from 'connect-redis';
import cors from 'cors';
import {RecipeEvents} from "@/server/utils/recipe-events";

const SESSION_MINUTES = 60;

const app = express();

export const recipeEvents = new RecipeEvents();

app.use(express.json());
app.use(urlencoded({extended: false}));
app.use(cors({
  origin: "*",
}))

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: 'secret key',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * SESSION_MINUTES
  }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.listen(3001, () => {
  console.log("Now listening to port 3001!");
}); 