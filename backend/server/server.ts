import express, { urlencoded } from 'express';
import { router } from './routes';
import passport from './utils/passport';
import session from 'express-session';
import {RedisStore} from 'connect-redis';
import { redisClient } from './utils/redis';

const app = express();
app.use(express.json());
app.use(urlencoded({extended: false}));

app.use(session({
  store: new RedisStore({client: redisClient}),
  secret: 'secret key',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000* 60
  }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use("/api", router);

app.listen(3001, () => {
  console.log("Now listening to port 3001!");
}); 