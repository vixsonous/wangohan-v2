import passport from 'passport';
import Local from 'passport-local';

passport.serializeUser((user, done) => {
  done(null, 1);
});

passport.deserializeUser((id, done) => {
  console.log(id);
  done(null, {id: 1, username: 'qweqwe'});
});

const LocalStrategy = Local.Strategy;

passport.use(new LocalStrategy(
  {usernameField: 'email'}, async (email, password, done) => {
    try {
      console.log(email);
      done(null, {id: 1, username: 'qweqwe'});
    } catch (error) {
      console.log(error);
      done(error, undefined);
    }
  }
));

export default passport;