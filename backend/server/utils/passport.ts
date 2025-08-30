import passport from 'passport';
import Local from 'passport-local';
import Google from 'passport-google-oauth20';
import { UserService } from '../User/user-service';
import bcrypt from 'bcrypt';
import { UserRepository} from "@/server/User/user-repository";
import {log} from "@/server/utils/log";

interface PassportUser {
  id: string;
  strategy: "local" | "google"
}

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (userParams: PassportUser, done) => {
  let user;

  if(userParams.strategy === "google") {
    log("Logging in with google strategy");
    user = await UserRepository.getUserByGoogleId(userParams.id);
  }

  if(userParams.strategy === "local") {
    log("Logging in with local strategy");
    user = await UserRepository.getUserById(Number(userParams.id));
  }

  if(user === undefined) {
    log("User not found!");
    done(new Error("User not found!"), null);
    return;
  }

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

    done(null, {id: String(credentials.user_id), strategy: "local"} as PassportUser);
  }
));

const GoogleStrategy = Google.Strategy;

passport.use(new GoogleStrategy({
  callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
},async (accessToken, refreshToken, profile, done) => {

  const googleCredentials = await UserService.googleStrategyLogin(profile.id);

  const isVerified = profile._json.email_verified;
  const email = profile._json.email;
  if(googleCredentials === undefined && isVerified !== undefined && isVerified && email !== undefined) {
    const createResult = await UserService.googleStrategyRegister(email, profile.id);

    if(createResult === undefined) {
      done("There was an error registering with OAuth!", false);
      return;
    }

    done(null, {id: profile.id, strategy: 'google'} satisfies PassportUser);
    return;
  }

  if(googleCredentials === undefined) {
    done("User with google credentials does not exist!", false);
    return;
  }

  const googleId = googleCredentials.google_id;

  if(googleId === undefined) {
    done("Please login through email and password!", false);
    return;
  }

  done(null, {id: googleId, strategy: 'google'} satisfies PassportUser);
}))

export default passport;