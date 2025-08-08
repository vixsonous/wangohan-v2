import passport from 'passport';
import Local from 'passport-local';
import { UserService } from '../User/user-service';
import bcrypt from 'bcrypt';

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => {
  done(null, {id: id, username: 'qweqwe'});
});

const LocalStrategy = Local.Strategy;

passport.use(new LocalStrategy(
  {usernameField: 'email'}, async (email, password, done) => {
    const credentials = await UserService.localStrategyLogin(email, password);

    if(credentials === undefined) throw new Error("User not found!");
    if(credentials.password === undefined) throw new Error("Please login through google authentication");

    const matching = await bcrypt.compare(password, credentials.password);

    if(!matching) throw new Error("Wrong password!");

    done(null, credentials.user_id);
  }
));

export default passport;