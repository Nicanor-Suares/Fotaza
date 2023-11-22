const passport = require('passport');
const passportJwt = require('passport-jwt');
const ExtractJwt = passportJwt.ExtractJwt;
const StrategyJwt = passportJwt.Strategy;
const { models } = require('../models/index');
const userModel = models.Usuario;

passport.use(
  new StrategyJwt({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret', // Replace with your actual secret key
  }, async (jwtPayload, done) => {
    console.log("HOLA AMIGUIS");
    try {
      // Look up the user based on the payload
      const user = await userModel.findOne({ where: { user_id: jwtPayload.id } });
      console.log("USUARIO JWT", user);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);
