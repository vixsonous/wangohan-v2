import passport from 'passport';
import Local from 'passport-local';
import { UserService } from '../User/user-service';
import bcrypt from 'bcrypt';
import { UserRepository} from "@/server/User/user-repository";

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await UserRepository.getUserById(id);

  if(user === undefined) done("User not found!", false);

  done(null, user);
});

const LocalStrategy = Local.Strategy;

passport.use(new LocalStrategy(
  {usernameField: 'email'}, async (email, password, done) => {
    const credentials = await UserService.localStrategyLogin(email);

    if(credentials === undefined) {
      done("Email not found!", false);
      return;
    }

    if(credentials.password === undefined) {
      done("Please login through google authentication!", false);
      return;
    }

    const matching = await bcrypt.compare(password, credentials.password);

    if(!matching) {
      done("Wrong password!", false);
      return;
    }

    done(null, credentials.user_id);
  }
));

export default passport;