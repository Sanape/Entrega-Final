import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import userService from '../services/User.service.js';
import { uploadFileToCloudinary } from './uploadFiles.middleware.js';
import { UserDto } from '../dto/User.dto.js';
import { errors } from '../utils/errorDictionary.js';
import config from '../config.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.URL_FRONTEND + '/api/sessions/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        const foundUser = await userService.getByFilter({
          where: {
            email: profile.email,
          },
        });

        if (!foundUser) {
          const profilePhoto = await uploadFileToCloudinary(profile.picture);

          const newUser = {
            email: profile.email,
            first_name: profile.displayName,
            last_name: '',
            password: '',
            url_profile_photo: profilePhoto.url,
            profile_public_id: profilePhoto.public_id,
            oauthuser: true,
          };

          const createdUser = await userService.create(newUser);

          const userDto = new UserDto(
            createdUser.id,
            newUser.first_name,
            newUser.last_name,
            createdUser.email,
            createdUser.role,
            newUser.url_profile_photo
          );

          return done(null, userDto);
        } else if (foundUser.oauthuser) {
          const userDto = new UserDto(
            foundUser.id,
            foundUser.first_name,
            foundUser.last_name,
            foundUser.email,
            foundUser.role,
            foundUser.url_profile_photo
          );

          return done(null, userDto);
        } else {
          return done(new errors.BAD_LOGIN_METHOD());
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const foundUser = await userService.getById(id);

  const userDto = new UserDto(
    foundUser.id,
    foundUser.first_name,
    foundUser.last_name,
    foundUser.email,
    foundUser.role,
    foundUser.url_profile_photo
  );

  done(null, userDto);
});
