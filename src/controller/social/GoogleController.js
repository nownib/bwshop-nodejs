require("dotenv").config();
import passport from "passport";
import userApiService from "../../service/userApiService";
import userController from "../../controller/userController";
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const loginWithGoogle = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_APP_CLIENT_ID,
        clientSecret: process.env.GOOGLE_APP_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_APP_REDIRECT,
      },
      async (accessToken, refreshToken, profile, cb) => {
        const typeAccount = "GOOGLE";
        let dataRaw = {
          username: profile.displayName,
          email:
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : "",
          avatar: profile.photos[0].value,
          googleId: profile.id,
        };
        let user = await userApiService.upsertUserSocialMedia(
          typeAccount,
          dataRaw
        );
        return cb(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

export default loginWithGoogle;
