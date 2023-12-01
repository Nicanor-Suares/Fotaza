const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const { models } = require('../models/index');
const userModel = models.Usuario;
const bcrypt = require('bcrypt');

passport.use(
  'signup', 
  new LocalStrategy({
    passReqToCallback: true,
    usernameField    : 'email',
    passwordField    : 'password',
  }, async (req, email, password, done) => {
    try {
      const user = await userModel.findOne({ where: { email } });
      if (user) {
        return done(null, false, { message: 'Ya existe un usuario con ese email' });
      }

      const existingUsername = await userModel.findOne({ where: { usuario: req.body.usuario } });
      if (existingUsername) {
        return done(null, false, { message: 'Ya existe un usuario con ese username' });
      }

      let confirm_password = req.body.confirm_password;

      if(password !== confirm_password)
        return res.status(400).json({ message: 'Las contraseñas no coinciden' });

      const hashedPassword = await bcrypt.hash(password, 10);

      const imageUrl = req.file ? req.file.path : null;
      const imageName = imageUrl.split('\\').pop();
      const url = '/avatars/' + imageName;

      const newUser = await userModel.create({
        nombre: req.body.nombre,
        usuario: req.body.usuario,
        email,
        password: hashedPassword,
        avatar: url
      });

      return done(null, newUser);
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
async (email, password, done) => {
  console.log(email);
  const user = await userModel.findOne({ where: { email } })

  // Si no existe el usuario, devolver error
  if (!user) return done(null, false, { message: 'Usuario no existente' })

  // Validar la contraseña
  console.log(user.password);
  const validate = await bcrypt.compare(password, user.password)
  console.log(validate);
  if (!validate) return done(null, false, { message: 'Contraseña erronea' })

  return done(null, user, { message: 'Logeado!' })
}
));